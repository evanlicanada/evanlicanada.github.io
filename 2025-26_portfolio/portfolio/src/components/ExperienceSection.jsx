// src/components/ExperienceSection.jsx
import React, { useState } from 'react';
import ExperienceCard from './ExperienceCard';
import ExperienceDetails from './ExperienceDetails';
import { experiences } from '../data/experienceData';
import './ExperienceSection.css';

const ExperienceSection = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);

  const handleCardClick = (experience) => {
    setSelectedExperience(experience);
  };

  const handleClose = () => {
    setSelectedExperience(null);
  };

  return (
    <section id="experience" className="experience-section">
      <h2>Relevant Experience</h2>
      <div className="experience-list">
        {experiences.map((exp) => (
          <ExperienceCard 
            key={exp.id} 
            experience={exp} 
            onClick={() => handleCardClick(exp)} 
          />
        ))}
      </div>
      {selectedExperience && (
        <ExperienceDetails experience={selectedExperience} onClose={handleClose} />
      )}
    </section>
  );
};

export default ExperienceSection;