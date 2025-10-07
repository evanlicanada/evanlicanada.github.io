// src/data/experienceData.js
export const experiences = [
  {
    id: 1,
    company: "Inpsoros",
    title: "Engineering Intern",
    timeframe: "Jan 2025 - Apr 2025",
    backgroundImage: "/images/plant_in_soil.jpg", // We'll put these in public/images
    description: "Worked in a small team to maintain and improve an optical plant phenotyping system used for agricultural research.",
    details: [
      "Managed and executed a flexible engineering role as part of a three-person team, taking ownership of system maintenance, data collection, and system software + hardware development tasks",
      "Reduced system scan times by 20% while increasing scan quality and system reliability",
      "Integrated several optical scanning systems using the various manufacture-provided Python and C++ APIs, significantly increasing future ease of use and development",
      "Designed and installed a light-impermeable, Arduino controlled active air cooling system, allowing internal system temperatures to be adjusted and maintained for more consistent data readings",
      "Modified system GUI using PyQt5, including functions such as notifications, image thresholding, and other features",
    ],
  },
  {
    id: 2,
    company: "UBC Supermileage",
    title: "Electrical Team",
    timeframe: "Sep 2023 - Aug 2025",
    backgroundImage: "/images/supermileage.jpg",
    description: "Another brief summary of your role or responsibilities.",
    details: [
      "Developed firmware using STM32cubeIDE to control a new battery management system for the Urban Concept, managing data from charge and state-of-charge sensors to optimize battery usage",
      "Designed and assembled a compact steering PCB using KiCAD, incorporating driver control interfaces for critical systems such as the emergency shut off and starter motor",
      " Streamlined the prototype vehicle’s electrical layout by soldering, crimping, and organizing dozens of components to facilitate quick assembly and disassembly in testing and maintenance.",
    ],
  },
  // Add more objects for each work experience
];