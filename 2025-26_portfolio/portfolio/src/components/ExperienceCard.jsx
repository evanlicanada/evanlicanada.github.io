// src/components/ExperienceCard.jsx
import React from 'react';
import './ExperienceCard.css';

const ExperienceCard = ({ experience, onClick }) => {
  return (
    <div 
      className="experience-card" 
      style={{ backgroundImage: `url(${experience.backgroundImage})` }}
      onClick={onClick}
    >
      <div className="overlay">
        <h3 className="company-name">{experience.company}</h3>
        <p className="job-title">{experience.title}</p>
        <div className="arrow-icon">→</div>
      </div>
    </div>
  );
};

export default ExperienceCard;