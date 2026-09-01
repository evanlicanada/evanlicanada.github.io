import React, { useState, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Crosshair, 
  Cpu, 
  Satellite, 
  Radio, 
  X, 
  Layers, 
  ChevronRight, 
  Zap,
  Compass,
  Download,
  Github,
  Linkedin,
  Mail,
  Activity,
  Sparkles
} from 'lucide-react';
import StarMapCanvas, { type StarNodeData, type ProjectItem } from './starmap/StarMapCanvas';

interface Props {
  initialProjects?: ProjectItem[];
}

export default function MainApp({ initialProjects = [] }: Props) {
  const [projects] = useState<ProjectItem[]>(initialProjects);
  const [viewMode, setViewMode] = useState<'dossier' | 'starmap'>('dossier');
  const [selectedStar, setSelectedStar] = useState<StarNodeData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [time, setTime] = useState('');

  // Live UTC Clock
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(d.toISOString().replace('T', ' // ').substring(0, 19) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut (~) for terminal, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setTerminalOpen(false);
        setSelectedStar(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter categories extracted from live project data
  const availableCategories = ['ALL', ...Array.from(new Set(projects.map(p => p.category.split('/')[0].trim())))];

  const filteredProjects = activeFilter === 'ALL' 
    ? projects 
    : projects.filter(p => p.category.toUpperCase().includes(activeFilter.toUpperCase()));

  const handleSelectStar = (star: StarNodeData) => {
    setSelectedStar(star);
  };

  const activeProject = selectedStar?.slug 
    ? projects.find(p => p.slug === selectedStar.slug) 
    : null;

  return (
    <div className="relative min-h-screen bg-nasa-bg text-nasa-white font-mono selection:bg-nasa-cyan/30">
      {/* ========================================================================= */}
      {/* 1. TOP TELEMETRY NAVBAR (Sticky & Recruiter-Clear)                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-nasa-bg/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Left Identity */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-nasa-cyan animate-pulse" />
              <span className="font-display font-bold tracking-wider text-sm md:text-base text-white">
                EVAN <span className="text-nasa-cyan font-normal">// UBC ENGPHYS</span>
              </span>
            </div>
            <span className="text-[10px] text-nasa-white/60 tracking-tight hidden sm:inline">
              HARDWARE • EMBEDDED • AVIONICS
            </span>
          </div>
        </div>

        {/* Center Quick Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs text-nasa-white/70">
          <a href="#about" className="hover:text-nasa-cyan transition-colors">[01 // ABOUT]</a>
          <a href="#projects" className="hover:text-nasa-cyan transition-colors">[02 // PROJECTS]</a>
          <a href="#experience" className="hover:text-nasa-cyan transition-colors">[03 // EXPERIENCE]</a>
          <a href="#skills" className="hover:text-nasa-cyan transition-colors">[04 // SKILLS]</a>
          <a href="#contact" className="hover:text-nasa-cyan transition-colors">[05 // CONTACT]</a>
        </nav>

        {/* Right Actions: 3D Toggle, Terminal, Resume */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* 3D Star Map View Mode Switcher Button */}
          <button
            onClick={() => setViewMode(viewMode === 'starmap' ? 'dossier' : 'starmap')}
            className={`px-3 py-1.5 text-xs font-display tracking-wider flex items-center gap-1.5 transition-all border ${
              viewMode === 'starmap'
                ? 'bg-nasa-cyan text-nasa-bg border-nasa-cyan font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-nasa-cyan/10 hover:bg-nasa-cyan/20 text-nasa-cyan border-nasa-cyan/40'
            }`}
          >
            <Compass size={14} className={viewMode === 'starmap' ? 'animate-spin' : ''} />
            <span>{viewMode === 'starmap' ? '✕ EXIT 3D MAP' : '🌌 3D STAR MAP'}</span>
          </button>

          {/* Secret Terminal Toggle */}
          <button
            onClick={() => setTerminalOpen(true)}
            className="hidden sm:flex p-1.5 bg-black/40 border border-white/10 hover:border-nasa-cyan text-nasa-white/60 hover:text-nasa-cyan transition-all text-xs items-center gap-1"
            title="Open Console [~]"
          >
            <TerminalIcon size={14} />
          </button>

          {/* Resume PDF Link */}
          <a
            href="/resume.pdf"
            target="_blank"
            className="px-2.5 py-1.5 bg-nasa-amber/10 border border-nasa-amber/40 hover:border-nasa-amber text-nasa-amber text-xs font-display tracking-wider flex items-center gap-1 transition-all"
          >
            <Download size={13} />
            <span className="hidden sm:inline">RESUME</span>
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FULLSCREEN 3D STAR MAP OVERLAY (When View Mode is 'starmap')           */}
      {/* ========================================================================= */}
      {viewMode === 'starmap' && (
        <div className="fixed inset-0 top-[53px] z-30 bg-nasa-bg animate-in fade-in duration-300">
          <StarMapCanvas 
            projects={projects}
            onSelectStar={handleSelectStar} 
            activeStarId={selectedStar?.id} 
          />
          
          {/* Top Banner inside 3D View */}
          <div className="absolute top-4 left-4 md:left-8 z-30 pointer-events-none flex flex-col gap-1 bg-nasa-bg/80 p-3 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-nasa-cyan font-display tracking-widest uppercase flex items-center gap-2">
              <Activity size={14} className="animate-pulse" />
              <span>INTERACTIVE STELLAR NAVIGATION CHART // GAIA DR3</span>
            </div>
            <div className="text-[10px] text-nasa-white/70">
              {projects.length} PROJECTS MAPPED IN 3D SPACE • CLICK ANY NODE TO INSPECT • DRAG TO ROTATE
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RECRUITER & ENGINEER DOSSIER VIEW (Default Accessible Document Flow)   */}
      {/* ========================================================================= */}
      {viewMode === 'dossier' && (
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-20">
          {/* HERO SECTION */}
          <section id="about" className="space-y-6 pt-4 border-b border-white/10 pb-12 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-nasa-cyan/5 border border-nasa-cyan/20 p-4 corner-bracket-tl">
              <div className="flex items-center gap-2 text-xs text-nasa-cyan">
                <span className="w-2 h-2 rounded-full bg-nasa-green animate-pulse" />
                <span>SYSTEM TELEMETRY: NOMINAL // OPEN FOR HARDWARE CO-OP & INTERNSHIPS</span>
              </div>
              <div className="text-[11px] text-nasa-white/60 font-mono">
                {time}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-nasa-amber font-display tracking-widest uppercase">
                // MISSION PROFILE: HARDWARE & EMBEDDED SYSTEMS
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-none">
                Evan
              </h1>
              <p className="text-lg md:text-xl text-nasa-cyan font-mono font-medium">
                Engineering Physics (B.A.Sc.) @ University of British Columbia (UBC)
              </p>
              <p className="text-sm md:text-base text-nasa-white/80 leading-relaxed max-w-3xl font-mono">
                Bridging rigorous physics fundamentals with high-reliability hardware engineering. 
                Experienced in PCB design (KiCAD), bare-metal firmware (STM32/C++), PyTorch, 
                and real-time control instrumentation. I love taking on challenges at the intersection 
                of electrical, software, and mechanical systems.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="#projects" 
                className="px-5 py-2.5 bg-nasa-cyan text-nasa-bg font-display font-bold text-xs tracking-wider uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                EXPLORE PAYLOAD PROJECTS &darr;
              </a>
              <button 
                onClick={() => setViewMode('starmap')} 
                className="px-5 py-2.5 bg-nasa-bg border border-nasa-cyan text-nasa-cyan font-display text-xs tracking-wider uppercase hover:bg-nasa-cyan/15 transition-all flex items-center gap-2"
              >
                <Compass size={14} />
                <span>LAUNCH 3D STELLAR MAP</span>
              </button>
              <a 
                href="/resume.pdf" 
                target="_blank"
                className="px-5 py-2.5 bg-nasa-bg border border-white/20 text-nasa-white/90 hover:border-white font-display text-xs tracking-wider uppercase hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Download size={14} />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
            </div>

            {/* Quick Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-black/40 border border-white/10 p-3">
                <div className="text-[10px] text-nasa-white/50">EDUCATION</div>
                <div className="text-xs text-nasa-white font-bold mt-0.5">UBC Engineering Physics</div>
                <div className="text-[10px] text-nasa-cyan">Class of 2027 • 4.2/4.33 GPA</div>
              </div>
              <div className="bg-black/40 border border-white/10 p-3">
                <div className="text-[10px] text-nasa-white/50">HARDWARE CORE</div>
                <div className="text-xs text-nasa-white font-bold mt-0.5">PCB & Power Electronics</div>
                <div className="text-[10px] text-nasa-amber">KiCAD / High Current / BLDC</div>
              </div>
              <div className="bg-black/40 border border-white/10 p-3">
                <div className="text-[10px] text-nasa-white/50">SOFTWARE & AI</div>
                <div className="text-xs text-nasa-white font-bold mt-0.5">PyTorch / ROS2 / Python</div>
                <div className="text-[10px] text-nasa-cyan">React / Linux / Data Pipeline</div>
              </div>
              <div className="bg-black/40 border border-white/10 p-3">
                <div className="text-[10px] text-nasa-white/50">EMBEDDED SYSTEMS</div>
                <div className="text-xs text-nasa-white font-bold mt-0.5">STM32 / ESP32 / C++</div>
                <div className="text-[10px] text-nasa-green">UART / I2C / SPI / CAN</div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* PROJECTS SECTION ("PAYLOAD MANIFEST")                                     */}
          {/* ========================================================================= */}
          <section id="projects" className="space-y-6 scroll-mt-20">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-xs text-nasa-amber font-display tracking-widest uppercase flex items-center gap-1.5">
                  <Satellite size={14} />
                  <span>SECTION 02</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide mt-1">
                  Featured Engineering Projects
                </h2>
              </div>

              {/* Dynamic Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 border border-white/10 text-xs">
                {availableCategories.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 transition-all ${
                      activeFilter === filter
                        ? 'bg-nasa-cyan text-nasa-bg font-bold'
                        : 'text-nasa-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <a 
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="bg-black/40 border border-white/10 hover:border-nasa-cyan/70 hover:bg-black/60 transition-all flex flex-col justify-between group relative corner-bracket-tl overflow-hidden cursor-pointer"
                >
                  <div>
                    {/* Cover Image Preview */}
                    {project.coverImage ? (
                      <div className="w-full h-44 overflow-hidden relative border-b border-white/10 bg-nasa-bg">
                        <img 
                          src={project.coverImage} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-nasa-bg via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-nasa-cyan/40 text-[9px] font-mono text-nasa-cyan uppercase tracking-wider">
                          {project.category}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-2 bg-gradient-to-r from-nasa-cyan/40 via-nasa-amber/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                    )}

                    <div className="p-5 space-y-4">
                      {/* Card Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          {!project.coverImage && (
                            <span className="text-[10px] font-mono text-nasa-cyan tracking-wider uppercase block mb-1">
                              {project.category}
                            </span>
                          )}
                          <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-nasa-cyan transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-mono px-2 py-0.5 border" style={{ color: project.color, borderColor: `${project.color}50` }}>
                            [{project.status}]
                          </span>
                          <span className="text-[9px] text-nasa-white/50 font-mono mt-1">
                            SYS: {project.starName}
                          </span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-nasa-white/80 leading-relaxed font-mono line-clamp-3">
                        {project.summary}
                      </p>

                      {/* Hardware Specs Table Preview */}
                      {project.specs.length > 0 && (
                        <div className="bg-nasa-bg/80 border border-white/5 p-3 space-y-1.5 text-xs">
                          <div className="text-[9px] text-nasa-amber font-bold tracking-wider uppercase border-b border-white/5 pb-1">
                            KEY AVIONICS & SPECIFICATIONS
                          </div>
                          {project.specs.map((spec, i) => (
                            <div key={i} className="flex justify-between text-[11px] py-0.5">
                              <span className="text-nasa-white/50">{spec.label}</span>
                              <span className="text-nasa-cyan font-mono text-right truncate ml-2">{spec.val}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Badges */}
                      {project.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.tech.map((t) => (
                            <span key={t} className="text-[10px] bg-white/5 border border-white/10 text-nasa-white/80 px-2 py-0.5 font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-3 border-t border-white/10 mt-2 bg-white/[0.02] flex items-center justify-between text-xs text-nasa-cyan group-hover:text-white font-display tracking-wider uppercase transition-colors">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Crosshair size={13} className="text-nasa-cyan group-hover:rotate-90 transition-transform duration-300" />
                      ACCESS FULL PROJECT BRIEF
                    </span>
                    <ChevronRight size={14} className="text-nasa-cyan group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* EXPERIENCE & FLIGHT LOG SECTION                                           */}
          {/* ========================================================================= */}
          <section id="experience" className="space-y-6 scroll-mt-20">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs text-nasa-amber font-display tracking-widest uppercase flex items-center gap-1.5">
                <Layers size={14} />
                <span>SECTION 03</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide mt-1">
                Experience & Background
              </h2>
            </div>

            <div className="space-y-6 border-l-2 border-nasa-cyan/30 pl-4 md:pl-6 ml-2">
              {/* Robotics Developer */}
              <div className="relative space-y-2 bg-black/30 border border-white/10 p-5 corner-bracket-tl">
                <div className="w-3 h-3 bg-nasa-cyan rounded-full absolute -left-[23px] md:-left-[31px] top-6 ring-4 ring-nasa-bg" />
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <h3 className="text-base font-display font-bold text-white">
                    Robotics Developer — UBC ECE & Quanser
                  </h3>
                  <span className="text-xs text-nasa-cyan font-mono">May 2026 — Dec 2026</span>
                </div>
                <div className="text-xs text-nasa-amber font-mono">ROS2 / Python / Quanser QArms</div>
                <p className="text-xs sm:text-sm text-nasa-white/80 leading-relaxed">
                  Developed comprehensive robotics labs (kinematics, visual servoing) for 400-level UBC engineering courses.
                  Integrated ROS2 with proprietary Quanser hardware via Windows-to-Docker socket bridging and Python SDKs.
                  Authored lab documents, answer keys, and codebase templates.
                </p>
              </div>

              {/* ProtoCloud Research Assistant */}
              <div className="relative space-y-2 bg-black/30 border border-white/10 p-5 corner-bracket-tl">
                <div className="w-3 h-3 bg-nasa-amber rounded-full absolute -left-[23px] md:-left-[31px] top-6 ring-4 ring-nasa-bg" />
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <h3 className="text-base font-display font-bold text-white">
                    ProtoCloud Research Assistant — Dr. Jiarui Ding
                  </h3>
                  <span className="text-xs text-nasa-amber font-mono">Jan 2026 — Apr 2026</span>
                </div>
                <div className="text-xs text-nasa-white/60 font-mono">Vancouver, BC • Spatial Transcriptomics & VAE</div>
                <p className="text-xs sm:text-sm text-nasa-white/80 leading-relaxed">
                  Engineered data preprocessing pipelines for 5GB+ spatial transcriptomic datasets (CSV/.h5ad).
                  Integrated hierarchical cross-entropy loss into a variational autoencoder (ProtoCloud) and
                  resolved device data allocation crashes in PyTorch using register buffers.
                </p>
              </div>

              {/* Data and Software Intern */}
              <div className="relative space-y-2 bg-black/30 border border-white/10 p-5 corner-bracket-tl">
                <div className="w-3 h-3 bg-nasa-green rounded-full absolute -left-[23px] md:-left-[31px] top-6 ring-4 ring-nasa-bg" />
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <h3 className="text-base font-display font-bold text-white">
                    Data and Software Intern — Insporos Technologies Inc.
                  </h3>
                  <span className="text-xs text-nasa-green font-mono">Jan 2025 — Apr 2025</span>
                </div>
                <div className="text-xs text-nasa-white/60 font-mono">Machine Learning Hardware / Instrumentation</div>
                <p className="text-xs sm:text-sm text-nasa-white/80 leading-relaxed">
                  Optimized a seed-scanning ML hardware prototype, reducing scan times by 20 minutes per batch.
                  Designed a smart HVAC enclosure cooling system and diagnosed IR sensor drift.
                  Developed a new Python API bridge to communicate with complex proprietary 3D sensors via Raspberry Pi.
                </p>
              </div>

              {/* UBC Supermileage */}
              <div className="relative space-y-2 bg-black/30 border border-white/10 p-5 corner-bracket-tl">
                <div className="w-3 h-3 bg-nasa-white rounded-full absolute -left-[23px] md:-left-[31px] top-6 ring-4 ring-nasa-bg" />
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <h3 className="text-base font-display font-bold text-white">
                    Electrical Team Member — UBC Supermileage
                  </h3>
                  <span className="text-xs text-nasa-white/60 font-mono">Sept 2023 — Sept 2025</span>
                </div>
                <div className="text-xs text-nasa-white/60 font-mono">Automotive PCB Design / Embedded Systems</div>
                <p className="text-xs sm:text-sm text-nasa-white/80 leading-relaxed">
                  Developed C++ firmware using STM32CubeIDE for a custom Battery Management System (BMS).
                  Designed, routed, and hand-soldered a compact steering control PCB using KiCAD,
                  incorporating high-power traces for safety-critical emergency shut-offs and motor control.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* AVIONICS & SKILLS SECTION                                                 */}
          {/* ========================================================================= */}
          <section id="skills" className="space-y-6 scroll-mt-20">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs text-nasa-cyan font-display tracking-widest uppercase flex items-center gap-1.5">
                <Cpu size={14} />
                <span>SECTION 04</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide mt-1">
                Skills & Hardware Tooling
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-white/10 p-5 space-y-3">
                <div className="text-xs text-nasa-cyan font-display font-bold tracking-wider uppercase flex items-center gap-2">
                  <Zap size={14} /> SOFTWARE & COMPUTE
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'C/C++', 'Java', 'Python', 'JavaScript', 
                    'Linux', 'Bash', 'SQL', 
                    'PlatformIO', 'React', 'Git',
                    'PyTorch', 'TensorFlow', 'ROS', 'Assembly'
                  ].map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 text-nasa-white/90">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 p-5 space-y-3">
                <div className="text-xs text-nasa-amber font-display font-bold tracking-wider uppercase flex items-center gap-2">
                  <Cpu size={14} /> HARDWARE & ELECTRICAL
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'PCB Design', 'KiCAD', 'Soldering',
                    'STM32', 'Microcontrollers',
                    'Digital & Analog Circuits',
                    'FPGA', 'VHDL'
                  ].map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 text-nasa-white/90">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 p-5 space-y-3">
                <div className="text-xs text-nasa-green font-display font-bold tracking-wider uppercase flex items-center gap-2">
                  <Activity size={14} /> LAB TEST & DIAGNOSTICS
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Digital Oscilloscope', 
                    'Logic Analyzer', 
                    'Multimeter', 
                    'STM32 Debugger (ST-LINK)',
                    'Serial / UART Telemetry',
                    'Bilingual (English/Chinese)'
                  ].map(s => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 text-nasa-white/90">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* COMMS & CONTACT SECTION                                                   */}
          {/* ========================================================================= */}
          <section id="contact" className="space-y-6 pt-6 border-t border-white/10 pb-16 scroll-mt-20">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs text-nasa-amber font-display tracking-widest uppercase flex items-center gap-1.5">
                <Radio size={14} />
                <span>SECTION 05</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide mt-1">
                Initiate Contact
              </h2>
            </div>

            <div className="bg-black/40 border border-nasa-cyan/30 p-6 md:p-8 space-y-6 corner-bracket-tl corner-bracket-br">
              <p className="text-sm text-nasa-white/80 leading-relaxed max-w-2xl">
                I am actively seeking **hardware engineering, embedded firmware, and robotics internships & co-op positions**. 
                Whether you have an inquiry about a project or want to discuss technical roles, feel free to reach out directly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <a
                  href="mailto:eli45@student.ubc.ca"
                  className="p-4 bg-nasa-cyan/10 hover:bg-nasa-cyan/20 border border-nasa-cyan/40 text-nasa-cyan text-xs font-display tracking-wider uppercase transition-all flex items-center gap-3"
                >
                  <Mail size={16} />
                  <div>
                    <div className="text-[9px] text-nasa-white/50">EMAIL TRANSMISSION</div>
                    <div className="font-bold">SEND MESSAGE &gt;</div>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/evan-li-canada"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white text-nasa-white text-xs font-display tracking-wider uppercase transition-all flex items-center gap-3"
                >
                  <Linkedin size={16} />
                  <div>
                    <div className="text-[9px] text-nasa-white/50">LINKEDIN PROFILE</div>
                    <div className="font-bold">CONNECT &gt;</div>
                  </div>
                </a>

                <a
                  href="https://github.com/evanlicanada"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white text-nasa-white text-xs font-display tracking-wider uppercase transition-all flex items-center gap-3"
                >
                  <Github size={16} />
                  <div>
                    <div className="text-[9px] text-nasa-white/50">GITHUB REPOSITORIES</div>
                    <div className="font-bold">VIEW SOURCE &gt;</div>
                  </div>
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 4. SLIDE-OUT DOSSIER DRAWER (Dynamic project data)                        */}
      {/* ========================================================================= */}
      {selectedStar && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-nasa-bg/95 backdrop-blur-xl border-l border-nasa-cyan/40 z-50 transition-all duration-300 overflow-y-auto pointer-events-auto flex flex-col shadow-2xl animate-in slide-in-from-right-4">
          <div className="sticky top-0 p-4 border-b border-nasa-cyan/20 bg-nasa-bg/95 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <Crosshair size={18} className="text-nasa-cyan" />
              <h2 className="text-nasa-cyan font-display tracking-widest text-sm uppercase">
                DOSSIER // {selectedStar.name}
              </h2>
            </div>
            <button 
              onClick={() => setSelectedStar(null)} 
              className="text-nasa-white/60 hover:text-nasa-red transition-colors p-1 border border-white/10 hover:border-nasa-red/50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 text-sm font-mono leading-relaxed text-nasa-white/80 space-y-6 flex-1">
            {selectedStar.coverImage && (
              <div className="w-full h-44 overflow-hidden border border-white/10 relative">
                <img 
                  src={selectedStar.coverImage} 
                  alt={selectedStar.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nasa-bg/80 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 bg-nasa-cyan/5 border border-nasa-cyan/20 p-3 text-xs">
              <div>
                <div className="text-[9px] text-nasa-white/50">DESIGNATION</div>
                <div className="text-nasa-cyan font-bold">{selectedStar.name}</div>
              </div>
              <div>
                <div className="text-[9px] text-nasa-white/50">STATUS</div>
                <div className="text-nasa-amber font-bold">{selectedStar.status}</div>
              </div>
              <div>
                <div className="text-[9px] text-nasa-white/50">COORDINATES</div>
                <div className="text-nasa-white/90">[{selectedStar.pos.join(', ')}]</div>
              </div>
            </div>

            <div className="border border-white/10 p-4 bg-black/40 space-y-3">
              <div className="flex items-center gap-2 text-nasa-cyan text-xs font-display tracking-wider border-b border-white/10 pb-2">
                <Zap size={14} /> TECHNICAL OVERVIEW
              </div>
              <p className="text-xs text-nasa-white/80">{selectedStar.desc}</p>

              {activeProject && activeProject.specs.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                  <div className="text-[10px] text-nasa-amber font-bold uppercase">AVIONICS SPECIFICATIONS</div>
                  {activeProject.specs.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-nasa-white/50">{s.label}</span>
                      <span className="text-nasa-cyan font-mono">{s.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedStar.slug && (
              <a 
                href={`/projects/${selectedStar.slug}`}
                className="block w-full py-2.5 bg-nasa-cyan/20 border border-nasa-cyan hover:bg-nasa-cyan/30 text-nasa-cyan text-center text-xs font-display tracking-widest uppercase transition-all"
              >
                OPEN FULL PROJECT WRITEUP &gt;
              </a>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SECRET TERMINAL MODAL (Hot-key ~)                                      */}
      {/* ========================================================================= */}
      {terminalOpen && (
        <div className="fixed inset-0 bg-nasa-bg/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-black border border-nasa-cyan/60 hud-bracket-tl hud-bracket-br shadow-2xl flex flex-col h-[450px]">
            <div className="p-2 border-b border-nasa-cyan/30 bg-nasa-cyan/10 flex justify-between items-center">
              <div className="flex items-center gap-2 text-nasa-cyan text-xs font-display tracking-wider">
                <TerminalIcon size={14} /> FLIGHT CONSOLE // ROOT ACCESS
              </div>
              <button onClick={() => setTerminalOpen(false)} className="text-nasa-white/60 hover:text-nasa-red text-xs px-2">
                [ESC / CLOSE]
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-nasa-cyan/90 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-nasa-amber">
                  <span>&gt;</span>
                  <span className="font-bold">system --status</span>
                </div>
                <div className="text-nasa-white/80 pl-4 border-l border-nasa-cyan/20">
                  {projects.length} PAYLOADS ACTIVE // UBC ENGPHYS TELEMETRY LINK ESTABLISHED.
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-nasa-amber">
                  <span>&gt;</span>
                  <span className="font-bold">help</span>
                </div>
                <div className="text-nasa-white/80 pl-4 border-l border-nasa-cyan/20 whitespace-pre-wrap">
                  AVAILABLE DIRECTIVES:
                  - ping rocky : Project Hail Mary Eridian acoustic comms
                  - engphys    : UBC Engineering Physics curriculum
                  - 3d         : Toggle 3D stellar chart
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-nasa-cyan/30 flex items-center gap-2 bg-nasa-bg">
              <span className="text-nasa-amber font-bold">&gt;</span>
              <input
                type="text"
                placeholder="Type 'ping rocky' or 'help'..."
                className="flex-1 bg-transparent border-none outline-none text-nasa-cyan text-xs font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim().toLowerCase();
                    if (val === 'ping rocky') {
                      alert('🎵 [SIGNAL DECRYPTED]: "Amaze! Amaze! Amaze! Good proud! Fist my bump!" 🤝');
                    } else if (val === '3d') {
                      setViewMode('starmap');
                      setTerminalOpen(false);
                    }
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
