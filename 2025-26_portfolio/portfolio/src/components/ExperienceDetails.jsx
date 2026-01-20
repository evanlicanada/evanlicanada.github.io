// src/components/ExperienceDetails.jsx
import React from 'react';
import './ExperienceDetails.css';

const ExperienceDetails = ({ experience, onClose }) => {
  if (!experience) return null;

  return (
    <div className="details-overlay">
      <div className="back-panel"></div>
      <div className="details-panel">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h1>{experience.company}</h1>
        <h2>{experience.title}</h2>
        <p className="timeframe">{experience.timeframe}</p>
        <p>{experience.description}</p>
        <ul>
          {experience.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceDetails;