// src/data/projectsData.js

// This array will hold all of your project information.
export const projects = [
  {
    title: "Fully Autonomous Robot",
    description: "A fully autonomous robot designed to navigate obstacles, then detect and retrieve specified objects",
    // You can add a new property here!
    detailedDescription: "Developed the core control logic using PlatformIO/C++ and a multi-ESP32 architecture, enabling robust and responsive autonomous navigation. Engineered a real-time navigation system using infrared reflectance sensors and PID control, achieving near 100\% path consistency at speeds of 1-2 m/s. Designed and implemented a closed-loop pet detection and retrieval system with LIDAR sensors and magnetometers, consistently collecting items in under 5 seconds. Collaborated in a four-person team over four months to design and build the robot leading to a 2nd place finish out of 15 teams in the 2025 Robot Summer competition",
    techStack: ["ESP32", "C++", "3D Printing", "Laser Cutting"],
    githubLink: "https://github.com/evanlicanada/Robot-Summer-Team-7",
    image: "/images/robot_summer.jpg",
  },
  {
    title: "Relay Server Based Display",
    description: "Using an ESP32 in a known network as a relay, this allows me to have an ESP32 (embedded into a 3d printed pot) display a message sent from anywhere in the world",
    detailedDescription: "The high level goal of this project was to have some decorative object that could display a message sent from anywhere else in the world provided an internet connection.",
    sections: [
      { type: 'text', value: 'This app helps users track carbon footprints.' },
      { type: 'image', value: '/images/gradient2.jpg', alt: 'App Flow' },
      { type: 'text', value: 'Here is a secondary deep-dive into the API...' },
      { type: 'code', value: 'npm install eco-tracker' }
    ],
    techStack: ["ESP32", "3D Printing", "Python"],
    githubLink: "/project/relay-flowerpot",
    id: "relay-flowerpot",
    image: "/images/gradient2.jpg",
  },
  {
    title: "Automatic Drink Dispenser",
    description: "A drink dispenser that can mix a variety of drinks automatically",
    detailedDescription: "A description with lots more details",
    techStack: ["Arduino", "Woodworking", "Stepper motors", "Pumps"],
    githubLink: "https://github.com/your-username/your-repo-3",
    image: "/images/gradient2.jpg",
  },
  {
    title: "Machine Learning based virtual robot",
    description: "A virtual robot created that can navigate a Gazebo environment using machine learning and PID control",
    detailedDescription: "A description with lots more details",
    techStack: ["ROS", "Python", "Pytorch", "Gazebo", "Machine Learning"],
    githubLink: "https://github.com/evanlicanada/ENPH353-team-9-competition-stuff",
    image: "/images/gradient2.jpg",
  },
  {
    title: "Steering PCB",
    decription: "Designed and assembled a compact steering PCB using KiCAD, incorporating driver control interfaces for critical systems such as the emergency shut off and starter motor",
    detailedDescription: "A description with lots more details",
    techStack: ["KiCAD", "PCB Design", "Soldering"],
    githubLink: "https://github.com/evanlicanada/Steering-PCB",
    image: "/images/gradient2.jpg",
  },
  {
    title: "BMS controller",
    description: "Designed and implemented a Battery Management System (BMS) controller for an electric vehicle at UBC supermileage using STM32CUBEIDE and a STM32G0, ensuring safe and efficient battery operation",
    detailedDescription: "A description with lots more details",
    techStack: ["KiCAD", "PCB Design", "Soldering"],
    githubLink: "https://github.com/evanlicanada/BMS-controller",
    image: "/images/gradient2.jpg",
  }
];