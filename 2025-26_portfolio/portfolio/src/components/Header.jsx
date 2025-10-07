// src/components/Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="name">Evan Li</h1>
      <nav>
        <ul>
          <li><a href="#intro" className="silly-link">Home</a></li> {/* New link */}
          <li><a href="#about" className="silly-link">About</a></li>
          <li><a href="#experience" className="silly-link">Experience</a></li>
          <li><a href="#projects" className="silly-link">Projects</a></li>
          <li><a href="#contact" className="silly-link">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;