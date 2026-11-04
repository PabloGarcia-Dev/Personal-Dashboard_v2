#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include "secrets.h"   // WIFI_SSID and WIFI_PASS

// ---------- MPU-6050 (washer) ----------
const int MPU_ADDR = 0x68;
const unsigned long SAMPLE_MS = 20;     // 50 samples/sec
unsigned long lastSample = 0;
float lastMag = 0;
float washerPeakAcc = 0;
int washerPeak = 0;
unsigned long washerPulses = 0;

// ---------- SW-420 (dryer) ----------
const int DRYER_PIN = 33;
volatile unsigned long dryerPulses = 0;
void IRAM_ATTR dryerISR(){ dryerPulses++; }

// ---------- Tuned values (fixed) ----------
const int ACCEL_THRESH        = 400;   // washer: jump that counts as a pulse (idle floor tops out ~280)
const int ACCEL_THRESH_DRYER  = 1500;  // same, but while the dryer is running or ramping down
const int WASHER_MIN_PULSES   = 2;     // pulses in one second for it to count as active
const int WIN_ON              = 10;    // active seconds in the window -> running
const int WIN_OFF             = 0;     // active seconds in the window or fewer -> idle

const int DRYER_MIN_PULSES    = 2;
const int ON_SCORE            = 15;
const int OFF_SCORE           = 5;
const int MAX_SCORE           = 30;
const int DECAY               = 3;

// ---------- Washer sliding window ----------
const int WIN = 300;             // seconds of history (5 min)
bool winBuf[WIN] = {false};
int winIdx = 0, winCount = 0;

// ---------- State ----------
bool washerRunning = false, dryerRunning = false;
int washerScore = 0, dryerScore = 0;
int washerRate = 0, dryerRate = 0;
unsigned long lastTick = 0;

WebServer server(80);

void handleStatus() {
    String json = "{";
    json += "\"washer\":" + String(washerRunning ? "true" : "false");
    json += ",\"dryer\":" + String(dryerRunning ? "true" : "false");
    json += ",\"washerScore\":" + String(washerScore);
    json += ",\"dryerScore\":" + String(dryerScore);
    json += ",\"washerRate\":" + String(washerRate);
    json += ",\"dryerRate\":" + String(dryerRate);
    json += ",\"washerPeak\":" + String(washerPeak);
    json += ",\"rssi\":" + String(WiFi.RSSI());
    json += ",\"uptime\":" + String(millis() / 1000);
    json += "}";

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
}

void connectWiFi(){
    WiFi.mode(WIFI_STA);
    WiFi.persistent(false);
    WiFi.setAutoReconnect(true);
    WiFi.disconnect(true);
    delay(200);

    IPAddress ip(192,168,0,194), gw(192,168,0,1), mask(255,255,255,0), dns(192,168,0,1);
    WiFi.config(ip, gw, mask, dns);

    WiFi.begin(WIFI_SSID, WIFI_PASS);

    unsigned long start = millis();
    while(WiFi.status() != WL_CONNECTED && millis() - start < 15000){
        delay(250);
    }
    WiFi.setSleep(false);   // on wall power, so no need to save energy
}

void mpuInit(){
    Wire.begin(21, 22);

    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x6B);   // wake the chip
    Wire.write(0);
    Wire.endTransmission(true);

    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x1A);   // CONFIG register
    Wire.write(0x04);   // low-pass filter ~21 Hz, cuts high-frequency buzz
    Wire.endTransmission(true);
}

int16_t readWord(){
    int16_t hi = Wire.read();
    int16_t lo = Wire.read();
    return (hi << 8) | lo;
}

void sampleWasher(){
    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x3B);
    Wire.endTransmission(false);
    if(Wire.requestFrom(MPU_ADDR, 6, true) < 6) return;

    int16_t ax = readWord();
    int16_t ay = readWord();
    int16_t az = readWord();

    float mag = sqrtf((float)ax*ax + (float)ay*ay + (float)az*az);
    float d = fabsf(mag - lastMag);
    bool dryerActive = dryerRunning || dryerScore > 0;   // also covers the dryer's ramp-down
    int thr = dryerActive ? ACCEL_THRESH_DRYER : ACCEL_THRESH;

    if(lastMag != 0){
        if(d < 8000 && d > washerPeakAcc) washerPeakAcc = d;  // ignore slams/glitches in the readout
        if(d > thr) washerPulses++;
    }
    lastMag = mag;
}

// Washer: count active seconds in the last WIN seconds
void updateWasher(){
    washerRate = (int)washerPulses;
    washerPulses = 0;
    bool active = washerRate >= WASHER_MIN_PULSES;

    winCount += (int)active - (int)winBuf[winIdx];
    winBuf[winIdx] = active;
    winIdx = (winIdx + 1) % WIN;

    washerScore = winCount;   // shows in /status
    if(winCount >= WIN_ON) washerRunning = true;
    else if(winCount <= WIN_OFF) washerRunning = false;
}

// Dryer: score that climbs on active seconds and drains on quiet ones
void updateMachine(volatile unsigned long &pulses, int &score, bool &running, int &rate, int minPulses){
    unsigned long p = pulses;
    pulses = 0;
    rate = (int)p;
    if((int)p >= minPulses) score = min(score + 1, MAX_SCORE);
    else score = max(score - DECAY, 0);

    if(score >= ON_SCORE) running = true;
    else if(score <= OFF_SCORE) running = false;
}

void setup() {
    Serial.begin(115200);

    mpuInit();
    pinMode(DRYER_PIN, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(DRYER_PIN), dryerISR, RISING);

    setCpuFrequencyMhz(80);

    connectWiFi();
    Serial.println(WiFi.status() == WL_CONNECTED
        ? "Connected! IP: " + WiFi.localIP().toString()
        : "WiFi not connected yet, will keep retrying");

    server.on("/status", handleStatus);
    server.begin();
    Serial.println("Server started!");
}

void loop() {
    if(millis() - lastSample >= SAMPLE_MS){
        lastSample = millis();
        sampleWasher();
    }

    if(millis() - lastTick >= 1000){
        lastTick = millis();

        washerPeak = (int)washerPeakAcc;   // publish the peak, then reset it
        washerPeakAcc = 0;

        updateWasher();
        updateMachine(dryerPulses, dryerScore, dryerRunning, dryerRate, DRYER_MIN_PULSES);
    }

    if(WiFi.status() != WL_CONNECTED){
        connectWiFi();
        return;
    }

    server.handleClient();
}
