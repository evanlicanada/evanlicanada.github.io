// src/components/ProjectModal.jsx
import React from 'react';
import './ProjectModal.css';
import { Link } from 'react-router-dom'; // Ensure this is imported

const ProjectModal = ({ project, onClose }) => {
  if (!project) {
    return null; // Don't render if no project is selected
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <img src={project.image} alt={project.title} className="modal-image" />
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            
            {/* New wrapper for the text content */}
            <div className="modal-text-container">
                <div className="modal-text">
                <h2>{project.title}</h2>
                <h3>Technologies Used: {project.techStack.join(', ')}</h3>
                <p>{project.description}</p>
                <p>{project.detailedDescription}</p>
                <div className="modal-links">
                        <Link to={project.githubLink} rel="noopener noreferrer"> More Details </Link> 
                        {project.liveLink && (
                        <a href={project.liveLink} rel="noopener noreferrer">
                            View Live
                        </a>
                        )}
                </div>
                </div>
            </div>
            </div>
    </div>
  );
};

export default ProjectModal;

