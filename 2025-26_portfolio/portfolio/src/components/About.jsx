// src/components/About.jsx
import React from 'react';
import './About.css';
import profileImage from '../assets/headshot.jpg'; // We'll add this image soon!

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        {/* <h2>About Me</h2>
        <p>
          I'm an electrical and software engineering student with a passion for building cool things. From embedded systems to full-stack web development, I love solving problems and creating polished, functional projects. When I'm not coding, you can find me tinkering with electronics, playing a classic video game, or trying to bake the perfect sourdough loaf.
        </p>
        <p>
          I'm currently seeking an internship where I can apply my skills and learn from a team of talented engineers. Let's build something great together!
        </p> */}
        <p>I love working on embedded systems, robotics, electronics and all sorts of other projects (take a look below)! I'm currently looking for an internship starting in Summer 2026.</p>
        <p>Outside of engineering, I love playing sports - my favourite are skiing, swimming and fencing. I also really enjoy getting lost in a story, book or movie, and playing /messing around with everything from Lego to video games to ny little brother!</p>
      </div>
      <div className="about-image">
        <img src={profileImage} alt="Evan" className="profile-photo" />
      </div>
    </section>
  );
};

export default About;