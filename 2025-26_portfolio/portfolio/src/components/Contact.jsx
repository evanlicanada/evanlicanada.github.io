// src/components/Contact.jsx
import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>Let's Connect!</h2>
      <p>I'm always open to discussing new opportunities. Feel free to reach out to me via my professional networks.</p>
      <div className="contact-links">
        <a href="https://www.linkedin.com/in/evan-li-canada/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/evanlicanada" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="evanlicanada@gmail.com">evanlicanada@gmail.com</a>
      </div>
    </section>
  );
};

export default Contact;