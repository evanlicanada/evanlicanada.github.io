import React from 'react';
import './Intro.css';
// FIX: Import the video file directly. The build system (Vite/Webpack) 
// will handle giving this variable the correct public URL path.
import videoSource from '../assets/background-video.mp4'; 

const Intro = () => {
  // We no longer need the 'const videoSource = ...' line here, 
  // as it is defined by the import at the top.
  
  return (
    <section id="intro" className="intro-section">
      
      {/* 1. The HTML5 Video Element */}
      <video 
        autoPlay      // Starts the video automatically
        loop          // Ensures the video plays over and over
        muted         // REQUIRED to allow autoplay in most browsers
        playsInline   // Improves mobile compatibility
        className="background-video"
      >
        {/* Source path now uses the imported variable */}
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. The Content Overlay */}
      <div className="intro-overlay"></div> {/* New overlay for darkening/text visibility */}

      {/* 3. The Text Content (Now above the video and overlay) */}
      <div className="intro-content">
        <p className="greeting">Hi! I'm</p>
        <h1 className="main-name">EVAN</h1>
        <p className="tagline">
          Engineering Physics Student at The University of British Columbia, graduating 2028
        </p>
        <p className="focus-area">
          {/* I love working on embedded systems, robotics, and all sorts of other projects. Outside of engineering, I'm a big fan of skiing, swimming and fencing! */}
        </p>
      </div>
    </section>
  );
};

export default Intro;
