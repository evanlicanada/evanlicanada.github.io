// src/App.jsx
import Header from './components/Header';
import Intro from './components/Intro'; // Import the new component
import About from './components/About';
import ExperienceSection from './components/ExperienceSection';
import Projects from './components/Projects';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Intro /> {/* Placed right after the fixed Header */}
      <About />
      <ExperienceSection />
      <Projects />
      <Contact />
    </>
  );
}

export default App;