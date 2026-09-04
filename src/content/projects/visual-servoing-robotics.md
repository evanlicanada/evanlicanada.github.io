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
coverImage: "/project_cover_imgs/visual_servoing_cover.jpg"
---

## Overview

For the 400-level introductory robotics classes at UBC (ELEC 442 and MECH 464), I built an end-to-end perception, calibration, and closed-loop control system using Quanser QArms (a 4DoF robotic arm). This module, covering computer vision and visual servoing, was developed from scratch to serve as a hands-on laboratory for engineering undergraduates.

The system combines pinhole camera geometry, eye-in-hand ChArUco calibration, position-based visual servoing (PBVS), and a hybrid 2.5D image-based visual servoing (IBVS) controller capable of dynamically tracking moving targets in real time.

---

## Real-Time Tracking & Perception Demo

Below is a demonstration of the hybrid 2.5D IBVS controller running on the physical QArm. As the target is moved across the workspace, the system regulates image-plane errors to keep the object centered in the camera frame while simultaneously driving the arm along the optical axis to maintain a consistent standoff distance:

<video controls class="w-full rounded border border-white/10 my-4" playsinline>
  <source src="/images/project-visual-servoing/IBVS_tracking_demo.mov" type="video/quicktime">
  <source src="/images/project-visual-servoing/IBVS_tracking_demo.mov" type="video/mp4">
  Your browser does not support the video tag.
</video>

The perception pipeline isolates the target using HSV color thresholding and morphological filtering, extracting subpixel centroids via image moments and deprojecting features into 3D camera coordinates:

![Visual Servoing Tracking Output](/images/project-visual-servoing/tracking_CV.png)

---

## Technical Implementations

### Perception & Hand-Eye Calibration
- **Camera Geometry & Distortion**: Formulated perspective projection using pinhole camera models and intrinsic calibration matrices ($K$). Modeled 5-coefficient geometric lens distortion (radial $k_1, k_2, k_3$ and tangential $p_1, p_2$) to map between 2D pixel coordinates and normalized 3D rays.
- **Eye-in-Hand Calibration ($AX = XB$)**: Implemented hand-eye calibration using ChArUco targets with OpenCV (`cv2.solvePnP` and `cv2.calibrateHandEye`). Because the QArm's camera is physically mounted behind the wrist joint rather than on the flange, moving the wrist alters the camera-to-gripper relationship. To handle this, I engineered a dynamic transformation pipeline chaining the static hand-eye matrix with the live wrist rotation: $T_{cam2gripper} = T_{rot}(\varphi_4) \cdot T_{hand-eye}$.
- **RGB-D Spatial Filtering**: Extracted target centroids $(u,v)$ via image moments ($m_{00}, m_{10}, m_{01}$) and deprojected 2D coordinates into 3D using ROS 2 `image_geometry`. Coupled this with a $5\times 5$ spatial patch-median depth filter (`get_patch_median_depth`) and temporal buffers to eliminate depth dropouts, noise spikes, and boundary bleeding from the RealSense D415.

### Control & Visual Servoing Algorithms
- **Position-Based Visual Servoing (PBVS)**: Built a closed-loop 3D Cartesian pick-and-place system. Chained coordinate transformations from Camera Frame $\to$ Gripper Frame $\to$ Base Frame via forward kinematics ($T_{gripper2base}$). Implemented rolling median buffers for Cartesian noise suppression, coordinating pickup via a 4-state Finite State Machine (`PRONE` $\to$ `SURVEY` $\to$ `GRAB` $\to$ `DROP`).
- **Hybrid 2.5D Image-Based Visual Servoing (IBVS)**: Designed an IBVS architecture using the Image Jacobian (Interaction Matrix) to regulate 2D image plane errors $(u, v)$ and keep targets centered in the camera FOV. Coupled this with real-time depth ($Z$) from the RealSense camera (and contour-area scaling for near-field distances $<0.4$m) to command forward approach velocities along the optical axis, enabling smooth autonomous target tracking across the workspace.

---

## Architectural Trade-Offs

- **PBVS vs. IBVS vs. Hybrid 2.5D**:
  - *PBVS (Position-Based)*: Generates straight-line 3D Cartesian trajectories, making motion planning straightforward. However, it is highly sensitive to calibration errors; if hand-eye calibration or camera intrinsics are off by even 10–15%, the 3D target estimate shifts significantly, leading to missed grasps.
  - *IBVS (Image-Based)*: Servos directly on 2D image pixel errors via the Image Jacobian, making it robust against camera intrinsic and hand-eye calibration inaccuracies. However, pure IBVS can produce erratic 3D trajectories and risk features leaving the camera's FOV during rotations.
  - *Hybrid 2.5D*: By decoupling lateral image-plane centering from the optical depth axis ($Z$), the controller retains 2D calibration robustness while maintaining predictable straight-line approach paths and avoiding camera retreat singularities.
- **ROS 2 in Docker vs. Native Setup**: Quanser's proprietary driver runs on Windows, while ROS 2 Humble runs natively on Ubuntu. Packaged the entire ROS 2 workspace into VS Code Dev Containers (Docker) with USB passthrough for the RealSense camera, communicating with the Windows host driver through a custom TCP socket gateway.

---

## Practical Challenges & Hardware Solutions

- **Mechanical Cantilever Sag**: When extending forward at long reaches, the QArm experienced mechanical gravity sag of up to 4–5 cm vertically. Implemented software-defined vertical compensation offsets parameterized by radial reach distance.
- **Depth Sensor Dropouts & Near-Field Limit**: RGB-D sensors only detect the front surface of an object, which would cause the gripper to close prematurely on the front face. Added a horizontal `grab_depth` translation offset during the grasp phase. When approaching within 0.4 m (below the RealSense D415 minimum sensing range), the system transitions to contour-area scaling to estimate relative proximity.
- **Motor Current Overloads & Gripper Stall**: Transitioning from simulation to physical QArms caused motor shutdowns when commanding rigid gripper positions. Built a 30 Hz control daemon that arbitrates joint positions while monitoring live motor currents, providing adaptive closed-loop torque control.
