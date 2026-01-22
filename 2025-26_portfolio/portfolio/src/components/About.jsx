// src/components/About.jsx
import React from 'react';
import './About.css';
import profileImage from '../assets/headshot.jpg'; // We'll add this image soon!

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-image">
        <img src={profileImage} alt="Evan" className="profile-photo" />
      </div>
      <div className="about-content">
        {/* <h2>About Me</h2>
        <p>
          I'm an electrical and software engineering student with a passion for building cool things. From embedded systems to full-stack web development, I love solving problems and creating polished, functional projects. When I'm not coding, you can find me tinkering with electronics, playing a classic video game, or trying to bake the perfect sourdough loaf.
        </p>
        <p>
          I'm currently seeking an internship where I can apply my skills and learn from a team of talented engineers. Let's build something great together!
        </p> */}
        <p>Whether I’m debugging a ROS node, refining a PID controller, or carving down a mountain, I love the challenge of technical precision. I’m an Engineering Physics student at UBC who lives for the 'aha!' moment in robotics and electronics. When I'm not working or tinkering, you’ll find me on the slopes, in the pool, or getting lost in a good book. I’m currently looking for a Summer 2026 internship to dive into the next big project.</p>
      </div>
      
    </section>
  );
};

export default About;