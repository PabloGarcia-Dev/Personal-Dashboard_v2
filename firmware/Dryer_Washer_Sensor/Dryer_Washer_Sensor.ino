#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include "secrets.h"

// MPU-6050 (washer)
const int MPU_ADDR = 0x68;
const unsigned long SAMPLE_MS = 20;    // 50 samples/sec
unsigned long lastSample = 0;
float lastMag = 0;

// SW-420 (dryer)
const int DRYER_PIN = 33;

bool washerRunning = false;
bool dryerRunning = false;

volatile unsigned long washerPulses = 0, dryerPulses = 0;
int washerScore = 0, dryerScore = 0;
int washerRate = 0, dryerRate = 0;
unsigned long lastTick = 0;

int ACCEL_THRESH = 800;          // washer: jump size that counts as a pulse
int WASHER_MIN_PULSES = 5;       // washer: pulses/sec to count as active
const int DRYER_MIN_PULSES = 2;        // dryer: pulses/sec to count as active
const int ON_SCORE  = 15;
const int OFF_SCORE = 5;    // turns off at or below this
const int MAX_SCORE = 30;   // was 60
const int DECAY     = 3;    // drain 3 per quiet second

// globals
float washerPeakAcc = 0;
int washerPeak = 0;

void IRAM_ATTR dryerISR(){ dryerPulses++; }

WebServer server(80);

void handleStatus() {
    String json = "{";
    json += "\"washer\":" + String(washerRunning ? "true" : "false") + ",";
    json += "\"dryer\":" + String(dryerRunning ? "true" : "false");
    json += ",\"washerScore\":" + String(washerScore) + ",\"dryerScore\":" + String(dryerScore);
    json += ",\"washerRate\":" + String(washerRate) + ",\"dryerRate\":" + String(dryerRate);
    json += ",\"washerPeak\":" + String(washerPeak);
    json += ",\"rssi\":" + String(WiFi.RSSI());
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
    WiFi.setSleep(true);
}

void mpuInit(){
    Wire.begin(21, 22);
    Wire.beginTransmission(MPU_ADDR);
    Wire.write(0x6B);   // wake the chip
    Wire.write(0);
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
    if(lastMag != 0){
        if(d > washerPeakAcc) washerPeakAcc = d;
        if(d > ACCEL_THRESH) washerPulses++;
    }
    lastMag = mag;
}

void updateMachine(volatile unsigned long &pulses, int &score, bool &running, int &rate, int minPulses){
    unsigned long p = pulses;
    pulses = 0;
    rate = p;
    if(p >= minPulses) score = min(score + 1, MAX_SCORE);
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
    
        updateMachine(washerPulses, washerScore, washerRunning, washerRate, WASHER_MIN_PULSES);
        updateMachine(dryerPulses, dryerScore, dryerRunning, dryerRate, DRYER_MIN_PULSES);
    }

    if(WiFi.status() != WL_CONNECTED){
        connectWiFi();
        return;
    }

    server.handleClient();
}
