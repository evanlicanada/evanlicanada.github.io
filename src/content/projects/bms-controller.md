---
title: "BMS Controller (UBC Supermileage)"
starName: "BETELGEUSE"
coord: [-5, -1, 4]
color: "#FF9900"
status: "DEPLOYED"
category: "POWER ELECTRONICS"
order: 4
summary: "Firmware for a custom battery management system for an urban concept vehicle."
specs:
  - label: "MCU"
    val: "STM32G0"
  - label: "Comm Protocol"
    val: "I2C"
tech:
  - "C++"
  - "STM32CubeIDE"
  - "Firmware"
  - "I2C"
github: ""
---

# BMS Controller

Developed firmware using STM32cubeIDE to control a new battery management system for the Urban Concept vehicle at UBC Supermileage, managing data from charge and state-of-charge sensors to optimize battery usage. Implemented I2C communication protocols to parse and manage real-time charge state data for the autonomous vehicle prototype.
