---
title: "CRNN Virtual ROS Robot"
starName: "VEGA"
coord: [-4, 2, -2]
color: "#00E5FF"
status: "COMPLETED"
category: "SOFTWARE"
order: 2
summary: "Autonomous navigation system within a Linux Gazebo environment using computer vision and machine learning."
specs:
  - label: "Frameworks"
    val: "ROS, PyTorch, OpenCV"
  - label: "Model Architecture"
    val: "CRNN (CNN + LSTM + CTC Loss)"
  - label: "Accuracy"
    val: "99% for real-time OCR"
tech:
  - "Python"
  - "ROS"
  - "PyTorch"
  - "OpenCV"
  - "Gazebo"
  - "Linux"
coverImage: "/project_cover_imgs/CRNN_cover.png"
github: "https://docs.google.com/document/d/1hdRIZrXr4zudI94FXJ5oCMeBp6HHGw1l_HrVgnCSa5w/edit?usp=sharing"
---

# Machine Learning Based Virtual Robot

Developed an autonomous navigation system within Linux, using a ROS/Gazebo environment and Python, integrating real-time computer vision (OpenCV) for dynamic obstacle detection and path planning.

Designed a robust image processing pipeline utilizing OpenCV to isolate, filter, and track visual features, generating optimized bounding boxes to feed into the CRNN for interpretation. Trained a custom PyTorch Convolutional Recurrent Neural Network (CRNN) using Google Colab and deployed locally, achieving 99% accuracy for real-time Optical Character Recognition (OCR) on signage text.
