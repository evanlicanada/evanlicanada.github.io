---
title: "Visual Servoing Robotics Labs (PBVS & IBVS)"
starName: "PROXIMA CENTAURI"
coord: [2, 5, -3]
color: "#FF9900"
status: "COMPLETED"
category: "ROBOTICS"
order: 3
summary: "A complete perception, calibration, and closed-loop control system for Quanser QArms featuring PBVS and Hybrid 2.5D IBVS algorithms."
specs:
  - label: "Hardware"
    val: "Quanser QArm (4DoF) & Intel RealSense D415"
  - label: "Algorithms"
    val: "PBVS, Hybrid 2.5D IBVS, Hand-Eye Calibration"
  - label: "Tech Stack"
    val: "ROS 2 Humble, Python, OpenCV, Docker"
tech:
  - "Python"
  - "ROS 2"
  - "OpenCV"
  - "Docker"
  - "Computer Vision"
  - "Kinematics"
---

## Overview

For the 400-level introductory robotics classes at UBC (ELEC 442 and MECH 464), I built a complete perception, calibration, and closed-loop control system for the Quanser QArms (a 4DoF robotic arm). This module, covering Computer Vision & Visual Servoing, was designed from scratch to serve as a comprehensive laboratory for engineering students.

## Core Technical Implementations

### Perception & Calibration
- **Camera Geometry & Lens Distortion**: Formulated perspective projection using pinhole camera models and intrinsic calibration matrices ($K$). Modeled 5-coefficient geometric lens distortion (radial $k_1, k_2, k_3$ and tangential $p_1, p_2$) to map between 2D pixel coordinates and normalized 3D rays.
- **Eye-in-Hand Calibration ($AX = XB$)**: Implemented hand-eye calibration using ChArUco targets with OpenCV (`cv2.solvePnP` and `cv2.calibrateHandEye`). To account for the QArm's physical camera placement mounted behind the wrist joint rather than the flange, I engineered a dynamic transformation pipeline chaining the base hand-eye matrix with the live wrist joint rotation: $T_{cam2gripper} = T_{rot}(\varphi_4) \cdot T_{hand-eye}$.
- **Perception Pipeline & RGB-D Spatial Filtering**: Developed an image processing pipeline in OpenCV using HSV color thresholding and morphological filtering (open/close) to isolate targets under shifting ambient lighting. Extracted subpixel centroids $(u,v)$ via 0th and 1st order image moments ($m_{00}, m_{10}, m_{01}$). Deprojected 2D features into 3D camera coordinates using ROS 2 `image_geometry` (`PinholeCameraModel`) coupled with a 5x5 spatial patch-median depth filter to eliminate depth dropouts, noise, and boundary bleeding.

### Visual Servoing Algorithms
- **Position-Based Visual Servoing (PBVS)**: Engineered a closed-loop 3D Cartesian pick-and-place system. Chained coordinate transformations from Camera Frame $\to$ Gripper Frame $\to$ Base Frame via forward kinematics ($T_{gripper2base}$). Implemented rolling median buffers for Cartesian noise suppression. Coordinated the pick-and-place sequence using a 4-state Finite State Machine (FSM: `PRONE` $\to$ `SURVEY` $\to$ `GRAB` $\to$ `DROP`).
- **Hybrid 2.5D Image-Based Visual Servoing (IBVS)**: Designed an Image-Based Visual Servoing architecture using the Image Jacobian (Interaction Matrix) to regulate 2D image plane errors $(u, v)$ and keep the target centered in the camera FOV, while coupling real-time depth ($Z$) from the RealSense camera (and contour-area estimation for near-field distances <0.4m) to command forward approach velocity along the optical axis. This enabled real-time dynamic target tracking where the QArm autonomously tracks and pursues moving objects across the workspace during the `SURVEY` state.

## Architectural Trade-Offs

- **PBVS vs. IBVS vs. Hybrid 2.5D**:
  - *PBVS (Position-Based)*: Generates intuitive 3D Cartesian trajectories and straight-line paths, making motion planning straightforward. However, it is highly sensitive to calibration errors—if hand-eye calibration ($T_{cam2gripper}$) or camera intrinsics are off by even 10–15%, the 3D target estimate shifts drastically, causing failed grasps.
  - *IBVS (Image-Based)*: Servos directly on 2D image pixel errors via the Image Jacobian, making it robust against camera intrinsic and hand-eye calibration inaccuracies. However, pure IBVS can produce erratic 3D Cartesian trajectories and suffer from the classic "camera retreat" singularity.
  - *Hybrid 2.5D*: By decoupling lateral image-plane centering from the optical depth axis ($Z$), the system maintains 2D calibration robustness while ensuring predictable forward approach trajectories.
- **ROS 2 & Docker Architecture**: Packaged the entire ROS 2 Humble workspace within VS Code Dev Containers (Docker) with USB passthrough for the Intel RealSense D415 camera, bridging containerized ROS 2 nodes to a Windows host server via a custom TCP socket connection to communicate with Quanser's proprietary driver.

## Challenges Overcome

- **QArm Gravity Sag**: The QArm experienced mechanical gravity sag of up to 4–5 cm vertically at long reaches. Resolved by implementing software-defined vertical compensation offsets based on radial reach distance.
- **Depth Camera Limitations**: RealSense hits a minimum sensing range at <0.4m. Handled by falling back to contour-area scaling to estimate relative proximity when too close.
- **Non-Rigid Hand-Eye Calibration**: The camera mounted before the wrist meant the transform changed with wrist rotation. Solved by constraining the wrist during ChArUco calibration and pre-multiplying by the live wrist rotation matrix during runtime.
