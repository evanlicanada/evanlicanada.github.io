---
title: "Custom BLDC Electronic Speed Controller (ESC)"
starName: "ALPHA CENTAURI"
coord: [-3, 5, 2]
color: "#FF5500"
status: "IN DEVELOPMENT"
category: "POWER ELECTRONICS"
order: 1
summary: "A custom Electronic Speed Controller (ESC) for drone BLDC motors featuring FOC control, STM32G4 MCU, and high-power MOSFETs."
specs:
  - label: "Microcontroller"
    val: "STM32G473CET6 (with CORDIC for FOC)"
  - label: "Power Delivery"
    val: "Power MOSFETs + Gate Drivers"
  - label: "Current Sensing"
    val: "Shunt resistors + LPF to onboard Op-Amp"
  - label: "Control Protocol"
    val: "CAN bus input, Field Oriented Control (FOC)"
tech:
  - "STM32 / C++"
  - "KiCAD"
  - "PCB Design"
  - "FOC Algorithm"
  - "BLDC Control"
coverImage: "/project_cover_imgs/temp_img_1.png"
github: "https://github.com"
---

# BLDC Motor Electronic Speed Controller (ESC)

This project is a scratch-built Electronic Speed Controller (ESC) tailored for standard-sized drone BLDC motors (e.g., 2306 or 2207 style stators). The core objective of this build is to implement Field Oriented Control (FOC) from the ground up, handle high-current/high-frequency PCB design, and dive deep into bare-metal STM32 programming.

## System Architecture

The hardware topology is designed for high efficiency, high current switching, and low noise:
- **Microcontroller**: Powered by the STM32G473CET6. This MCU was specifically chosen for its integrated CORDIC coprocessor, which dramatically accelerates the trigonometric calculations required for real-time FOC loops. It also features fast ADCs and onboard Op-Amps.
- **Power Stage**: High-current power MOSFETs paired with dedicated gate drivers provide precise phase control to the motor coils. 
- **Current Sensing**: Inline phase current is measured using precision shunt resistors, filtered through a low-pass network (ferrite beads and low-ESR ceramic capacitors), and fed directly into the STM32's onboard operational amplifiers.
- **Power Regulation**: Includes a dedicated TI buck converter IC to supply the gate drivers, and a low-dropout (LDO) regulator for clean MCU power.

## Firmware & Control

The firmware drives the motor using a Field Oriented Control (FOC) algorithm, enabling smooth, efficient, and precise torque control compared to traditional trapezoidal commutation. Target commands and telemetry are interfaced externally via a robust CAN bus network.

## Current Progress & Challenges

Currently in the active design and schematic capture phase. The primary challenge being navigated is managing scope creep—balancing the desire to add advanced telemetry and protection features against the necessity of completing a robust, functional core hardware revision. The high-current PCB layout will require careful attention to return paths and thermal management to prevent noise from disrupting the sensitive analog current measurements.

