// src/components/ProjectCard.jsx
import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <img src={project.image} alt={project.title} className="project-image" />
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tech-stack">
          {project.techStack.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
        {/* We can remove the GitHub/Live Demo links from the card */}
        {/* to move them to the modal, keeping the card minimalist */}
      </div>
    </div>
  );
};

export default ProjectCard;