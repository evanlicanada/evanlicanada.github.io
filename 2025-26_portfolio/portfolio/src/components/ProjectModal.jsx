// src/components/ProjectModal.jsx
import React from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  if (!project) {
    return null; // Don't render if no project is selected
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <img src={project.image} alt={project.title} className="modal-image" />
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            
            {/* New wrapper for the text content */}
            <div className="modal-text-container">
                <div className="modal-text">
                <h2>{project.title}</h2>
                <h3>Technologies Used: {project.techStack.join(', ')}</h3>
                <p>{project.description}</p>
                <p>{project.detailedDescription}</p>
                <div className="modal-links">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                        </a>
                        {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            View Live
                        </a>
                        )}
                </div>
                </div>
            </div>
            </div>
      </div>
    </div>
  );
};

export default ProjectModal;

