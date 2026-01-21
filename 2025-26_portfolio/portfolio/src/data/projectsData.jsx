// src/data/projectsData.js

// This array will hold all of your project information.
export const projects = [
  {
    title: "Fully Autonomous Robot",
    description: "A fully autonomous robot designed to navigate obstacles, then detect and retrieve specified objects",
    // You can add a new property here!
    detailedDescription: "Developed the core control logic using PlatformIO/C++ and a multi-ESP32 architecture, enabling robust and responsive autonomous navigation. Engineered a real-time navigation system using infrared reflectance sensors and PID control, achieving near 100\% path consistency at speeds of 1-2 m/s. Designed and implemented a closed-loop pet detection and retrieval system with LIDAR sensors and magnetometers, consistently collecting items in under 5 seconds. Collaborated in a four-person team over four months to design and build the robot leading to a 2nd place finish out of 15 teams in the 2025 Robot Summer competition",
    techStack: ["ESP32", "C++", "3D Printing", "Laser Cutting"],
    githubLink: "/project/robot-summer",
    id: "robot-summer",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ], 
    image: "/images/robot_summer.jpg",
  },
  {
    title: "Display Flowerpot + Relay server",
    description: "A flowerpot that can display messages sent from anywhere in the world via a relay server",
    detailedDescription: "This project can be broken down into three pieces. The flowerpot (with a LCD display), the relay server (setup with port forwarding), and the lead computer (sends messages).",
    techStack: ["ESP32", "3D Printing", "Python"],
    githubLink: "/project/relay-flowerpot",
    id: "relay-flowerpot",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ],
    image: "/images/gradient2.jpg",
  },
  {
    title: "Automatic Drink Dispenser",
    description: "A drink dispenser that can mix a variety of drinks automatically",
    detailedDescription: "The dispenser can dispense up to 6 red solo cups using a stepper motor + timing belt + linear rail system to move the spout. Liquid is pumped using peristaltic pump to allow for the use of the original drink containers without any modifications. The entire system is controlled using an ESP32 microcontroller and built on a wooden frame.",
    techStack: ["Arduino", "Woodworking", "Stepper motors", "Pumps"],
    githubLink: "/project/drink-dispenser",
    image: "/images/gradient2.jpg",
    id: "drink-dispenser",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ],
  },
  {
    title: "Machine Learning based virtual robot",
    description: "A virtual robot created that can navigate a Gazebo environment using machine learning and PID control",
    detailedDescription: "In order to compete in the ENPH353 competition, we created, tested and deplayed a robot that could navigate a Gazebo environment using computer vision and PID, and could read signage using a CNN + RNN model.",
    techStack: ["ROS", "Python", "Pytorch", "Gazebo", "Machine Learning"],
    githubLink: "projects/ML-robot",
    image: "/images/project-ML-robot/cover.png",
    id: "ML-robot",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ],
  },
  {
    title: "Steering PCB",
    description: "Designed and assembled a compact steering PCB using KiCAD",
    detailedDescription: "My First PCB project, I designed and assembled a steering PCB for an electric vehicle at UBC supermileage using KiCAD, incorporating essential components such as an emergency shutoff, starter motor, and driver control interfaces.",
    techStack: ["KiCAD", "PCB Design", "Soldering"],
    githubLink: "projects/steering-pcb",
    image: "/images/project-steering-pcb/cover.jpg",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ],
    id: "steering-pcb",
  },
  {
    title: "BMS controller",
    description: "I developed the firmware for a custom battery management system for the urban concept vehicle",
    detailedDescription: "Designed and implemented a Battery Management System (BMS) controller for an electric vehicle at UBC supermileage using STM32CUBEIDE and a STM32G0, ensuring safe and efficient battery operation",
    techStack: ["KiCAD", "PCB Design", "Soldering"],
    githubLink: "projects/bms-controller",
    image: "/images/gradient2.jpg",
    id: "bms-controller",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ],
  },
  {
    title: "Portfolio Website",
    description: "My personal portfolio website - you're looking at it right now!",
    detailedDescription: "I decided to create my own portfolio website to get more experience in webdev and showcase my projects. This website was built using React, JavaScript, and CSS. It replaced an old version built using just HTML and CSS.",
    techStack: ["React", "JavaScript", "CSS"],
    githubLink: "/projects/portfolio-website",
    image: "/images/project-portfolio-website/cover.png",
    id: "portfolio-website",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ],
  },
  {
    title: "Sprinkler Zone Controller",
    description: "Custom arduino controller to schedule and activate sprinkler zones automatically",
    detailedDescription: "A schedule can be inputted by the user using a 4x4 keypad with feedback given visually via a LCD display with a custom UI. The sprinklers are then controlled using relays. THe whole system is built around an Arduino.",
    techStack: ["Arduino", "C++"],
    githubLink: "/projects/sprinkler-control",
    image: "/images/project-sprinkler-control/cover.jpg",
    id: "sprinkler-control",
    sections: [
      { type: 'image', value: '/images/under_construction.jpg', alt: 'Under Construction - Come back soon!' },
    ]
  }
];