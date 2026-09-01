---
title: "Sprinkler Zone Controller"
starName: "PROCYON"
coord: [4, 2, 5]
color: "#00AAFF"
status: "OPERATIONAL"
category: "EMBEDDED"
order: 7
summary: "Custom Arduino controller to schedule and activate sprinkler zones automatically."
specs:
  - label: "Interface"
    val: "4x4 Keypad + LCD Display"
  - label: "Outputs"
    val: "Relays"
tech:
  - "Arduino"
  - "C++"
  - "UI/UX"
  - "Relays"
github: ""
---

# Sprinkler Zone Controller

A custom Arduino controller to schedule and activate sprinkler zones automatically. A schedule can be inputted by the user using a 4x4 keypad with feedback given visually via an LCD display with a custom UI. The sprinklers are then controlled using relays. The whole system is built around an Arduino and written in C++.
