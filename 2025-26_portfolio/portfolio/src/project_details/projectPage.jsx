import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projectsData';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = projects.find(p => p.id === projectId);

  // Handle case where URL doesn't match a project
  if (!project) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Project not found</h1>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>← Back to Portfolio</Link>
      
      <h1 style={{ fontSize: '3rem', margin: '20px 0' }}>{project.title}</h1>

      <div className="project-content">
        {project.sections.map((section, index) => {
          if (section.type === "text") {
            return (
              <p key={index} style={{ lineHeight: '1.6', fontSize: '1.2rem', marginBottom: '30px' }}>
                {section.value}
              </p>
            );
          }
          
          if (section.type === "image") {
            return (
              <figure key={index} style={{ margin: '40px 0' }}>
                <img 
                  src={section.value} 
                  alt={section.alt || "Project visual"} 
                  style={{ width: '100%', borderRadius: '8px' }} 
                />
                {section.alt && (
                  <figcaption style={{ textAlign: 'center', color: '#888', marginTop: '10px' }}>
                    {section.alt}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ProjectDetail;