---
title: "IoT Remote Display Flowerpot"
starName: "ALTAIR"
coord: [2, -5, 3]
color: "#00FF00"
status: "OPERATIONAL"
category: "EMBEDDED"
order: 3
summary: "A full-stack IoT messaging system featuring a custom Python backend and a wireless relay server."
specs:
  - label: "Microcontroller"
    val: "ESP32"
  - label: "Communication"
    val: "Secure Wi-Fi via Relay Server"
tech:
  - "ESP32"
  - "C++"
  - "Python"
  - "Networking"
  - "3D Printing"
github: "https://github.com/evanlicanada/Relay-server-esp-flowerpot"
---

# Display Flowerpot + Relay server

A flowerpot that can display messages sent from anywhere in the world via a relay server. This project can be broken down into three pieces: the flowerpot (with an LCD display), the relay server (setup with port forwarding), and the lead computer (sends messages).

- Developed a full-stack IoT messaging system featuring a custom Python backend and a wireless relay server for seamless, asynchronous client-to-server data delivery.
- Engineered C++ ESP32 firmware to establish secure, headless network connections, enabling remote data reception and display (on LCD) without manual user-side configuration.
