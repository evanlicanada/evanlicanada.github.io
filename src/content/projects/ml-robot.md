---
title: "CRNN Virtual Autonomous Robot (ENPH 353)"
starName: "VEGA"
coord: [-4, 2, -2]
color: "#00E5FF"
status: "COMPLETED"
category: "SOFTWARE"
order: 2
summary: "An autonomous simulated robot in ROS/Gazebo that navigates complex terrains and uses a custom 3M-parameter CRNN with CTC loss for real-time 30 FPS clue-reading."
specs:
  - label: "Architecture"
    val: "CRNN (5-stage CNN + BiLSTM + CTC Loss)"
  - label: "Frameworks"
    val: "ROS, PyTorch, OpenCV, Gazebo"
  - label: "Inference Speed"
    val: "30 FPS Real-Time OCR (Laptop CPU)"
  - label: "Accuracy & Score"
    val: "99.32% Accuracy (22 pts / 70s)"
tech:
  - "Python"
  - "PyTorch"
  - "ROS"
  - "OpenCV"
  - "Gazebo"
  - "Computer Vision"
  - "Deep Learning"
coverImage: "/project_cover_imgs/CRNN_cover.png"
github: "https://github.com/evanlicanada/ENPH353-team-9-competition-stuff"
---

## Project Overview

For the UBC Engineering Physics ENPH 353 Competition, my teammate Andrew McKell and I developed an autonomous simulated robot in ROS and Gazebo. Acting as a detective robot, the vehicle was tasked with navigating a complex course—paved roadways, off-road grassy paths, high-grade mountain ramps, pedestrian crosswalks, and dynamic obstacles—while identifying and reading clue signs scattered throughout the environment to solve a crime mystery without colliding or leaving the track.

I led the computer vision pipeline, deep learning character recognition model (CRNN), overall ROS system integration, and state machine architecture.

---

## System Architecture & ROS Node Decoupling

To allow parallel development and prevent perception workloads from stalling motion control, the software stack was engineered into modular, decoupled ROS nodes:

- `linefollow.py`: Handles real-time camera frame preprocessing, road edge extraction, lane-center estimation, and PD velocity control commands (`/cmd_vel`).
- `sign_reader.py`: Subscribes to the robot camera feed, isolates clue signs via HSV thresholding, computes homography transforms for 4-point perspective warping, crops text regions, and runs CRNN inference.
- `score_tracker_interface.py`: Central coordinator node that collects decoded string predictions, submits answers to the competition scoring server, and manages state machine progression.

Decoupling sign recognition from navigation allowed image processing and neural network inference to execute asynchronously at the full 30 FPS camera framerate. The robot was able to read clues at full speed without stopping, slowing down, or veering off course.

---

## Computer Vision Pipeline

```
Camera Frame (RGB)
   │
   ├──> Line Following: HLS Transform ──> Hue Masking (>100) ──> CLAHE & Dilation ──> Inner Edge Contours ──> EMA Memory & PD Control
   │
   └──> Sign Detection: HSV Blue Base ──> Polygon Area Gate (>18k) ──> 4-Point Homography Warp (300x200) ──> Text Crop (286x55)
                                                                                                                    │
                                                                                                            CRNN Inference (30 FPS)
```

### 1. Road Edge & Line Following
- **Color Space Isolation**: Processed the lower half of camera frames, converting from RGB to HLS color space to decouple illumination from chromaticity.
- **Sky & Cloud Filtering**: Implemented hue thresholding (filtering out hues $>100$) to eliminate false road-edge detections caused by sky and cloud textures when climbing steep mountain ramps.
- **Contrast Enhancement**: Applied Contrast Limited Adaptive Histogram Equalization (CLAHE) and morphological dilation (`cv2.dilate`) to bridge gaps in worn road surfaces.
- **Inner-Edge Contour Extraction**: Naive centroid tracking fails when turns distort the visible lane area. Instead, computed road boundaries using the 95th percentile x-coordinate for left borders and 5th percentile for right borders.
- **Temporal Memory & Dynamic Lane Width**: Maintained an Exponential Moving Average (EMA) of lane width (`lane_width_px`). When one border temporarily exited the camera FOV during aggressive turns, the missing edge was projected from memory, preventing wrong-way turn flips.
- **PD Velocity Control**: Fed normalized lateral error into a tuned PD controller to command smooth angular velocities.

### 2. Sign Detection & Homography Rectification
- **Blue Base Gating**: Identified sign stands by filtering for the blue mounting base in HSV space (Hue $\approx 120$).
- **Geometric Verification**: Detected candidate white signboards using `cv2.approxPolyDP` to confirm 4-sided convex polygons exceeding a minimum area threshold (`AREA_THRESH = 18000`), ensuring sufficient resolution before triggering inference.
- **4-Point Perspective Warp**: Extracted ordered corner coordinates and computed a homography matrix (`cv2.getPerspectiveTransform` and `cv2.warpPerspective`) to rectify skewed signs into a normalized $300 \times 200$ pixel frontal plane.
- **Text Region Extraction**: Cropped the bottom text strip ($286 \times 55$ px) containing clue words, isolating characters from background noise.

---

## Deep Learning: Custom CRNN with CTC Loss

### Why CRNN Over Traditional OCR?
Traditional Optical Character Recognition (OCR) systems rely on segmenting bounding boxes for individual letters before classification. Under real-time robotic motion, characters frequently touch, blur, or experience non-uniform lighting, causing segmentation algorithms to fail.

By treating the horizontal pixel axis as a time sequence, a Convolutional Recurrent Neural Network (CRNN) with Connectionist Temporal Classification (CTC) loss reads entire words end-to-end without requiring character segmentation.

```
Input Image (1 x 64 x 256)
   │
   ▼
[CNN Feature Extractor]  (5 Conv2D Blocks: 64 -> 128 -> 256 -> 256 -> 512 + BatchNorm + ReLU)
   │                      * Block 4: MaxPool2d((2, 1)) preserves horizontal sequence length
   ▼
Feature Map (512 x 8 x 64)
   │
   ▼
[Map-to-Sequence]        (Linear Projection: 512 x 8 -> 64)
   │
   ▼
[Bidirectional LSTM]     (2 Layers, Hidden Size: 256, Output: 512)
   │
   ▼
[CTC Loss & Decoder]     (CTCLoss() + greedy_decoder() for blank/duplicate removal)
   │
   ▼
Predicted Word ("UNKNOWN", "EVIDENCE", etc.)
```

### Architecture Specifications
- **CNN Backbone**: 5 convolutional blocks with Batch Normalization and ReLU activations. Block 4 utilizes asymmetric vertical pooling (`MaxPool2d((2, 1))`) to compress height ($64 \to 8$) while preserving horizontal sequence length ($256 \to 64$).
- **Map-to-Sequence Layer**: Flattens vertical features into a linear projection ($512 \times 8 \to 64$) formatted for temporal sequential processing.
- **Bidirectional LSTM**: 2-layer BiLSTM (hidden dimension: 256, combined output: 512) scanning both left-to-right and right-to-left to capture full contextual character relationships.
- **CTC Loss & Greedy Decoder**: Output dense layer mapped to character class logits. Trained using PyTorch `nn.CTCLoss()`. At runtime, a lightweight `greedy_decoder()` collapses repeated characters and removes blank separator tokens (`_`).
- **Computational Efficiency**: Total model size is ~3.08M trainable parameters. It trained in under 10 minutes on Google Colab and runs inference at 30 FPS on standard laptop CPUs without requiring a dedicated GPU.

---

## Overcoming Model Failure & Domain Shift

Our initial CRNN model trained on 500 clean synthetic word images achieved near-zero training loss, but failed completely when deployed in the Gazebo simulation environment—reading `"UNKNOWN"` as `"UN NUN"`.

### The Root Cause
Synthetic training fonts were razor-sharp and uniformly illuminated. In contrast, real camera feeds from the moving robot exhibited significant motion blur, compression artifacts, thresholding noise, and perspective distortion.

### The Solution: Synthetic Degradation Pipeline
I overhauled the data generation pipeline (`training_generator.ipynb`) in Google Colab to introduce realistic sensor degradations:

1. **Randomized Transformations**: Affine rotations, scale shifts, and jittered bounding boxes.
2. **Noise & Blur Simulation**: Gaussian noise, motion blur kernels, and variable contrast.
3. **Threshold & Pixelation Artifacts**: Simulating low-bitrate camera artifacts and erosion/dilation defects.
4. **Curriculum Training**: Trained on a balanced distribution of 500 clean images, 250 mildly degraded images, and 250 heavily degraded images.

### Temporal Majority Voting
To eliminate ambiguous character edge cases (such as distinguishing between `'O'` and `'D'`), the sign reader sampled predictions continuously across multiple frames as the robot drove past, using a temporal majority voting buffer to lock in the final prediction.

```
Validation Loss: < 0.0005
Validation Accuracy: 99.32% (in 57 epochs / < 10 min training)
Inference Speed: 30 FPS continuous throughput
```

---

## Results & Impact

- 99.32% OCR accuracy on degraded, skewed, and blurred competition signage.
- 22 points scored in 70 seconds during the final competition run, finishing among the top scoring teams.
- Full 30 FPS real-time execution running concurrently with line-following and vehicle control on a standard CPU.

---

## Source Repositories & References

- **GitHub Repository**: [evanlicanada/ENPH353-team-9-competition-stuff](https://github.com/evanlicanada/ENPH353-team-9-competition-stuff)
