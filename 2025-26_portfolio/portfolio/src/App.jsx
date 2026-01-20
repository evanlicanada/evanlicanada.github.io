import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Intro from './components/Intro';
import About from './components/About';
import ExperienceSection from './components/ExperienceSection';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ProjectPage from './project_details/projectPage'; // Your new page
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROUTE 1: Your Main Portfolio Page */}
        <Route path="/" element={
          <>
            <Header />
            <Intro />
            <About />
            <ExperienceSection />
            <Projects />
            <Contact />
          </>
        } />

        {/* ROUTE 2: Your Specific Project Page */}
        {/* <Route path="/project-page" element={<ProjectPage />} /> */}
        <Route path="/project/:projectId" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;