# Personal Dashboard V2

A living-room kiosk dashboard running 24/7 on a Raspberry Pi 5. It shows the weather, UCF shuttle arrivals, laundry status, Pi health, and AdGuard Home stats on one fullscreen Chromium page, with no keyboard needed.

V2 is a rewrite of the original vanilla-JS dashboard using React, Vite, Tailwind, and an Express backend. It adds a custom ESP32 sensor node that tells you when the washer and dryer are running.

---

## Features

- **Clock**: local time and date.
- **Weather**: current conditions, 6-day forecast, and a sunrise/sunset progress bar (Open-Meteo, no API key).
- **UCF shuttle**: next Route 2 arrivals at the Boardwalk stop. On game days, an amber card shows the "GAME DAY Route 2" times.
- **Laundry**: live washer and dryer status with a run timer. The dryer shows a warning if it runs past 90 minutes.
- **System monitor**: CPU, RAM, temperature, disk, throttle status, and IP.
- **AdGuard Home**: queries today, blocked today, and block percentage.
- **Stats page** at `/stats`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Process manager | PM2 |
| Laundry sensors | ESP32, MPU-6050 (washer), SW-420 (dryer) |
| Weather | Open-Meteo |
| Shuttle | UCF TransLoc |

---

## How it fits together

```
ESP32 (washer + dryer sensors) --/status--> Express server (Pi) --> React app (Chromium)
AdGuard Home (Pi) ------------------------> Express server (Pi) -->
Open-Meteo / UCF TransLoc ----------------> Express server (Pi) -->
```

The React hooks fetch from the Express routes, which in turn talk to the outside services. Keeping secrets and third-party calls on the server means credentials never reach the browser.

---

## Project structure

```
Personal-Dashboard_v2/
├── src/
│   ├── main.jsx
│   ├── App.jsx                     # Routes: /  and  /stats
│   ├── pages/                      # Dashboard.jsx, StatsPage.jsx
│   ├── hooks/                      # useWeather, useShuttle, useLaundry, useAdguard
│   └── components/
│       ├── widgets/                # Clock, Weather, Shuttle, Laundry, System, AdGuard
│       └── auxiliary/              # LastUpdated
├── server/
│   ├── server.js                   # Static serving + API routes
│   ├── routes/                     # weather, shuttle, system, adguard, laundry
│   └── .env.example
├── firmware/
│   └── laundry-esp32/
│       ├── Dryer_Washer_Sensor.ino
│       └── secrets.example.h
├── index.html                      # Vite template (do not overwrite with a build)
└── package.json
```

---

## Setup

### Requirements

- Node.js 18 or newer
- A Raspberry Pi 5 (any machine works for development)
- AdGuard Home, if you want that widget
- An ESP32 with the laundry firmware, if you want that widget

### Run locally

```bash
npm install
cd server && npm install && cd ..

cp server/.env.example server/.env   # then fill in your values
npm run dev                          # Vite dev server
node server/server.js                # Express API (separate terminal)
```

### Server configuration

Create `server/.env`. It is gitignored.

```
ADGUARD_URL=http://localhost
ADGUARD_USER=your-username
ADGUARD_PASS=your-password
ESP32_URL=http://<esp32-ip>
LATITUDE=28.5868
LONGITUDE=-81.2062
```

---

## Deploying to the Pi

Build on your computer, copy the output to the Pi, and restart PM2.

```bash
npm run build
ssh pi@<pi-ip> "rm -rf /home/pi/Personal-Dashboard_v2/assets"
scp -r dist/* pi@<pi-ip>:/home/pi/Personal-Dashboard_v2/
ssh pi@<pi-ip> "pm2 restart Pops"
```

> **Warning:** Always copy `dist/*` from the project root. Do not run `scp` from inside `dist/` with `.` as the destination. That overwrites the project's root `index.html` with the built one and the app stops updating.

### First-time PM2 setup

```bash
pm2 start server/server.js --name Pops
pm2 save
pm2 startup        # run the command it prints so Pops starts on boot
```

### Kiosk mode

Chromium opens `http://localhost:3001/` fullscreen on boot.

---

## The laundry sensor node

An ESP32 watches both machines by vibration and serves their state over HTTP. The Express `laundry` route reads from it and the widget displays the result.

### Hardware

| Part | Used for | Connection |
|---|---|---|
| ESP32 dev board | Controller | USB 5V from a wall charger |
| MPU-6050 | Washer vibration | SDA to pin 21, SCL to pin 22, 3.3V, GND |
| SW-420 | Dryer vibration | Signal to pin 33, 3.3V, GND |

Mount each sensor rigidly to its machine's panel, leave slack in the wires, and strain-relieve the connections. **Keep the washer and dryer from touching.** When they touch, the dryer shakes the washer's sensor hard enough to look like washer activity.

### Firmware setup

1. Copy `firmware/laundry-esp32/secrets.example.h` to `secrets.h` and fill in `WIFI_SSID` and `WIFI_PASS`. `secrets.h` is gitignored.
2. Set the static IP in `connectWiFi()` to match your network.
3. Flash with the Arduino IDE.

### Endpoint

`GET /status` returns:

```json
{
  "washer": true,
  "dryer": false,
  "washerScore": 300,
  "dryerScore": 0,
  "washerRate": 12,
  "dryerRate": 0,
  "washerPeak": 880,
  "rssi": -62,
  "uptime": 86400
}
```

### How detection works

**Washer (MPU-6050).** The board samples acceleration at 50 Hz. A sample counts as a pulse when the jump in magnitude exceeds a threshold. A second with 2 or more pulses is "active". The washer is running when at least 10 of the last 300 seconds were active, and idle when none were.

**Dryer (SW-420).** Pulses are counted by interrupt. A score climbs by 1 on each active second and drops by 3 on each quiet one. The dryer is running when the score reaches 15 and idle when it falls to 5.

**Tuned values** (from about 26 captures of every machine state):

| Setting | Value | Why |
|---|---|---|
| Washer threshold | 400 | The idle floor tops out near 280; fill and wash start near 450 |
| Washer threshold, dryer on | 1500 | Lifts it above the dryer's vibration leaking into the washer sensor |
| Min pulses per second | 2 | Rejects single bumps |
| Window on / off | 10 / 0 | Running at 10 active seconds, idle when empty |
| Dryer on / off / max / decay | 15 / 5 / 30 / 3 | Fast stop, no flapping |

### Known limits

- **The washer turns off about 2 minutes after it stops**, because the 300-second window has to drain.
- **Fill and wash can't be seen while the dryer is running.** Their vibration is weaker than the dryer's leak, so the washer is only detected at drain and spin during those overlaps. The washer timer can undercount if the dryer starts first.
- **A smart plug with energy monitoring** would fix that case and is the recommended upgrade.
- There is no authentication on `/status`. Keep the ESP32 on your private network.

---

## Widget behavior notes

- The laundry timer is kept in `localStorage`, so it survives a page reload.
- It adds a 15-second offset for the sensor's detection delay.
- A gap of up to 3 minutes is tolerated before the timer resets.
- The dryer shows an amber "Check on the dryer" warning after 90 minutes.

---

## Security

- Credentials live in `server/.env` and `firmware/**/secrets.h`. Both are gitignored.
- Never commit built `dist/` output or `.env` files.
- If a secret is ever committed, rotate it first, then rewrite history with `git filter-repo`.

---

## Authors

Built by **Pablo Garcia** | Idea by **Alexander Grigalashvili** and **Pablo Garcia**

---

<img width="2560" height="1440" alt="image" src="https://github.com/user-attachments/assets/e7e5f4c3-8d62-44e1-9386-fdb88cbccd6c" />

---
