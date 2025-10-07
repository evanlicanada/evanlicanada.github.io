// src/data/projectsData.js

// This array will hold all of your project information.
export const projects = [
  {
    title: "Fully Autonomous Robot",
    description: "A fully autonomous robot designed to navigate obstacles, then detect and retrieve specified objects",
    // You can add a new property here!
    detailedDescription: "Developed the core control logic using PlatformIO/C++ and a multi-ESP32 architecture, enabling robust and responsive autonomous navigation. Engineered a real-time navigation system using infrared reflectance sensors and PID control, achieving near 100\% path consistency at speeds of 1-2 m/s. Designed and implemented a closed-loop pet detection and retrieval system with LIDAR sensors and magnetometers, consistently collecting items in under 5 seconds. Collaborated in a four-person team over four months to design and build the robot leading to a 2nd place finish out of 15 teams in the 2025 Robot Summer competition",
    techStack: ["ESP32", "C++", "3D Printing", "Laser Cutting"],
    githubLink: "https://github.com/your-username/your-repo-1",
    image: "/images/robot_summer.jpg",
  },
  {
    title: "Relay Server Based Display",
    description: "Using an ESP32 in a known network as a relay, this allows me to have an ESP32 (embedded into a 3d printed pot) display a message sent from anywhere in the world",
    detailedDescription: "A description with lots more details",
    techStack: ["ESP32", "3D Printing", "Python"],
    githubLink: "https://github.com/your-username/your-repo-2",
    image: "/images/gradient2.jpg",
  },
  {
    title: "Automatic Drink Dispenser",
    description: "A drink dispenser that can mix a variety of drinks automatically",
    detailedDescription: "A description with lots more details",
    techStack: ["Arduino", "Woodworking", "Stepper motors", "Pumps"],
    githubLink: "https://github.com/your-username/your-repo-3",
    image: "/images/gradient2.jpg",
  }
];