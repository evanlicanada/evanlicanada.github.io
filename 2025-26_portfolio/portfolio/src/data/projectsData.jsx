// src/data/projectsData.js

// This array will hold all of your project information.
export const projects = [
  {
    title: "Project 1: Automated Plant Waterer",
    description: "A smart system that uses a Raspberry Pi and soil sensors to automatically water plants and send you updates.",
    // You can add a new property here!
    detailedDescription: "This project was a great introduction to embedded systems. I wrote the Python script to read sensor data and control the water pump, and then used a simple web server to send updates to my phone. The biggest challenge was calibrating the sensors to ensure accurate readings.",
    techStack: ["Python", "Raspberry Pi", "C++"],
    githubLink: "https://github.com/your-username/your-repo-1",
    image: "/images/pikachu_plush.jpg",
  },
  {
    title: "Project 2: Personal Portfolio Website",
    description: "This very website! A modern and minimalist site built with React and Vite to showcase my skills and projects.",
    detailedDescription: "A description with lots more details",
    techStack: ["React", "Vite", "CSS"],
    githubLink: "https://github.com/your-username/your-repo-2",
    image: "/images/pikachu_plush.jpg",
  },
];