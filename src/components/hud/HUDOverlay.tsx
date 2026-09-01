import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Crosshair, 
  Cpu, 
  Satellite, 
  Radio, 
  X, 
  Volume2, 
  VolumeX, 
  Layers, 
  ExternalLink, 
  ChevronRight, 
  Zap,
  Sparkles
} from 'lucide-react';
import type { StarNodeData } from '../starmap/StarMapCanvas';

// Web Audio API Synthesizer for NASA-punk tactile sound effects
class SoundSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  playBeep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime + (i * 0.06));
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (i * 0.06) + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + (i * 0.06));
        osc.stop(this.ctx.currentTime + (i * 0.06) + 0.2);
      });
    } catch {
      // ignore
    }
  }
}

const synth = new SoundSynth();

// Top HUD Header
const TopHeader = ({ 
  audioMuted, 
  setAudioMuted,
  onOpenTerminal
}: { 
  audioMuted: boolean; 
  setAudioMuted: (m: boolean) => void;
  onOpenTerminal: () => void;
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(d.toISOString().replace('T', ' // ').substring(0, 22) + 'Z');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start pointer-events-none z-40">
      {/* Left Mission Identity */}
      <div className="flex flex-col gap-1 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="text-nasa-cyan text-xs md:text-sm font-display tracking-widest uppercase hud-bracket-tl px-3 py-1.5 bg-nasa-bg/85 border border-nasa-cyan/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nasa-cyan animate-pulse" />
            <span>CONSTELLATION // UBC.ENPH</span>
          </div>
          
          <button 
            onClick={onOpenTerminal}
            className="px-2 py-1.5 bg-nasa-bg/80 border border-white/20 hover:border-nasa-cyan text-nasa-white/70 hover:text-nasa-cyan text-[10px] font-mono tracking-wider flex items-center gap-1 transition-all"
            title="Open Flight Terminal [~]"
          >
            <TerminalIcon size={12} />
            <span className="hidden sm:inline">TERMINAL</span>
          </button>
        </div>
        <div className="text-[10px] text-nasa-white/60 font-mono tracking-wider ml-1">
          UBC ENGINEERING PHYSICS // HARDWARE & EMBEDDED SYSTEMS
        </div>
      </div>

      {/* Right Telemetry & Controls */}
      <div className="flex flex-col items-end gap-1 pointer-events-auto text-right">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              synth.muted = !audioMuted;
              setAudioMuted(!audioMuted);
              if (audioMuted) synth.playBeep();
            }}
            className="p-1.5 bg-nasa-bg/80 border border-white/20 hover:border-nasa-amber text-nasa-white/70 hover:text-nasa-amber transition-all text-[10px]"
            title={audioMuted ? "Unmute Audio Relays" : "Mute Audio Relays"}
          >
            {audioMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-nasa-amber" />}
          </button>

          <div className="text-nasa-amber text-xs md:text-sm font-display tracking-widest uppercase hud-bracket-br px-3 py-1.5 bg-nasa-bg/85 border border-nasa-amber/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nasa-amber animate-ping" />
            SYS: NOMINAL
          </div>
        </div>
        <div className="text-[10px] text-nasa-white/70 font-mono tracking-widest mr-1">
          {time}
        </div>
      </div>
    </header>
  );
};

// Secret Interactive Flight Terminal
const SecretTerminal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([
    { cmd: 'system --status', output: 'ORBITAL ENGINE ONLINE // UBC ENGPHYS TELEMETRY LINK ESTABLISHED.' },
    { cmd: 'help', output: 'AVAILABLE COMMANDS: [help, ping rocky, engphys, astrophage, tau-ceti, clear, exit]' }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    synth.playBeep();
    let res = '';

    switch (cmd) {
      case 'help':
        res = 'COMMANDS:\n  ping rocky   - Intercept Project Hail Mary Eridian comms\n  engphys      - UBC Engineering Physics program telemetry\n  astrophage   - Query solar energy absorption levels\n  tau-ceti     - Capstone avionics payload brief\n  clear        - Clear console history\n  exit         - Close flight console';
        break;
      case 'ping rocky':
      case 'rocky':
        synth.playChime();
        res = '🎵 [SIGNAL DECRYPTED]: "Amaze! Amaze! Amaze! Good proud! Fist my bump!" 🤝\n[40 ERIDANI RELAY LINK: ACTIVE]';
        break;
      case 'engphys':
        res = 'UBC ENGINEERING PHYSICS:\n- Rigorous dual engineering & honours physics curriculum.\n- Focus: Embedded Systems, Electrical Hardware, Mechanical Design, Quantum Mechanics, Machine Learning.';
        break;
      case 'astrophage':
        res = 'CO2 + HEAT -> PETROVA LINE EMISSION. Astrophage breeding chambers at 100% capacity.';
        break;
      case 'tau-ceti':
        res = 'TARGET STAR TAU CETI: Capstone High-Altitude Avionics Telemetry Unit deployed at coordinate [-7.0, 2.0, -8.0].';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        setInput('');
        return;
      default:
        res = `UNKNOWN COMMAND: "${cmd}". Type "help" for a list of telemetry directives.`;
    }

    setHistory(prev => [...prev, { cmd: input, output: res }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-nasa-bg/90 backdrop-blur-md z-50 flex items-center justify-center p-4 pointer-events-auto">
      <div className="w-full max-w-2xl bg-black border border-nasa-cyan/60 hud-bracket-tl hud-bracket-br shadow-2xl flex flex-col h-[450px]">
        {/* Terminal Header */}
        <div className="p-2 border-b border-nasa-cyan/30 bg-nasa-cyan/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-nasa-cyan text-xs font-display tracking-wider">
            <TerminalIcon size={14} /> FLIGHT CONSOLE // ROOT ACCESS
          </div>
          <button onClick={onClose} className="text-nasa-white/60 hover:text-nasa-red text-xs px-2">
            [ESC / CLOSE]
          </button>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-nasa-cyan/90 space-y-3">
          {history.map((h, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-nasa-amber">
                <span>&gt;</span>
                <span className="font-bold">{h.cmd}</span>
              </div>
              <div className="text-nasa-white/80 whitespace-pre-wrap pl-4 border-l border-nasa-cyan/20">
                {h.output}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleCommand} className="p-3 border-t border-nasa-cyan/30 flex items-center gap-2 bg-nasa-bg">
          <span className="text-nasa-amber font-bold">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' or 'ping rocky'..."
            className="flex-1 bg-transparent border-none outline-none text-nasa-cyan text-xs font-mono placeholder:text-nasa-cyan/30"
            autoFocus
          />
          <button type="submit" className="text-[10px] text-nasa-cyan border border-nasa-cyan/40 px-2 py-1 uppercase hover:bg-nasa-cyan/20">
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};

// Bottom Navigation Deck
const NavDeck = ({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string | null; 
  setActiveTab: (t: string | null) => void;
}) => {
  const tabs = [
    { id: 'projects', label: 'PAYLOADS (PROJECTS)', icon: Satellite },
    { id: 'experience', label: 'FLIGHT LOG (EXP)', icon: Layers },
    { id: 'skills', label: 'AVIONICS (SKILLS)', icon: Cpu },
    { id: 'comms', label: 'COMMS RELAY', icon: Radio },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 pointer-events-auto z-40 bg-nasa-bg/85 backdrop-blur-md p-1.5 border border-nasa-cyan/30 hud-bracket-tl hud-bracket-br max-w-[95vw]">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              synth.playClick();
              setActiveTab(isActive ? null : tab.id);
            }}
            className={`px-3 md:px-4 py-2 flex items-center gap-2 text-xs font-display tracking-widest transition-all duration-200 uppercase ${
              isActive 
                ? "bg-nasa-cyan/20 text-nasa-cyan border border-nasa-cyan" 
                : "text-nasa-white/70 hover:text-nasa-cyan hover:bg-nasa-cyan/10 border border-transparent"
            }`}
          >
            <Icon size={14} className={isActive ? "text-nasa-cyan" : "text-nasa-white/60"} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.id.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
};

// Technical Dossier Drawer (Slide-Out Specs Sheet)
const DossierDrawer = ({ 
  isOpen, 
  onClose, 
  activeStar,
  activeTab
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeStar: StarNodeData | null;
  activeTab: string | null;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-nasa-bg/95 backdrop-blur-xl border-l border-nasa-cyan/40 z-50 transition-transform duration-300 overflow-y-auto pointer-events-auto flex flex-col shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-nasa-cyan/20 bg-nasa-bg/95 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Crosshair size={18} className="text-nasa-cyan" />
          <h2 className="text-nasa-cyan font-display tracking-widest text-sm uppercase">
            {activeStar ? `DOSSIER // ${activeStar.name}` : `SECTION // ${activeTab?.toUpperCase()}`}
          </h2>
        </div>
        <button 
          onClick={() => {
            synth.playClick();
            onClose();
          }} 
          className="text-nasa-white/60 hover:text-nasa-red transition-colors p-1 border border-white/10 hover:border-nasa-red/50"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 text-sm font-mono leading-relaxed text-nasa-white/80 space-y-6 flex-1">
        {/* Star Target Details */}
        {activeStar && (
          <div className="space-y-6">
            {/* Telemetry Strip */}
            <div className="grid grid-cols-3 gap-2 bg-nasa-cyan/5 border border-nasa-cyan/20 p-3 text-xs">
              <div>
                <div className="text-[9px] text-nasa-white/50">DESIGNATION</div>
                <div className="text-nasa-cyan font-bold">{activeStar.name}</div>
              </div>
              <div>
                <div className="text-[9px] text-nasa-white/50">STATUS</div>
                <div className="text-nasa-amber font-bold">{activeStar.status}</div>
              </div>
              <div>
                <div className="text-[9px] text-nasa-white/50">COORDINATES</div>
                <div className="text-nasa-white/90">[{activeStar.pos.join(', ')}]</div>
              </div>
            </div>

            {/* Hardware Schematic / Specs Box */}
            <div className="border border-white/10 p-4 bg-black/40 space-y-3">
              <div className="flex items-center gap-2 text-nasa-cyan text-xs font-display tracking-wider border-b border-white/10 pb-2">
                <Zap size={14} /> TECHNICAL SPECIFICATIONS & AVIONICS
              </div>
              
              <p className="text-xs text-nasa-white/80">{activeStar.desc}</p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-nasa-white/50">SUBSYSTEM</span>
                  <span className="text-nasa-cyan font-mono">{activeStar.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-nasa-white/50">DEPLOYMENT TARGET</span>
                  <span className="text-nasa-white">UBC Engineering Physics 2026</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-nasa-white/50">CORE ARCHITECTURE</span>
                  <span className="text-nasa-amber">Altium / STM32 / FreeRTOS / C++</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <a 
                href="/projects/avionics-capstone"
                className="flex-1 py-2.5 bg-nasa-cyan/20 border border-nasa-cyan hover:bg-nasa-cyan/30 text-nasa-cyan text-center text-xs font-display tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              >
                <span>OPEN FULL PAYLOAD BRIEF</span>
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Tab-Based Directory Views */}
        {!activeStar && activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="text-xs text-nasa-amber uppercase tracking-wider">
              [ PAYLOAD MANIFEST // ACTIVE HARDWARE PROJECTS ]
            </div>
            <div className="space-y-3">
              <div className="border border-white/10 hover:border-nasa-cyan/60 p-4 bg-black/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-nasa-cyan font-bold text-xs">01 // HIGH-ALTITUDE AVIONICS UNIT</span>
                  <span className="text-[10px] text-nasa-amber">[DEPLOYED]</span>
                </div>
                <p className="text-xs text-nasa-white/70 mb-2">Custom 4-layer flight computer designed for high-altitude telemetry collection with STM32 and 9-DOF IMU.</p>
                <div className="flex gap-1.5 flex-wrap">
                  {['Altium', 'STM32', 'C++', 'LoRa'].map(t => (
                    <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 border border-white/10 text-nasa-white/80">{t}</span>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 hover:border-nasa-cyan/60 p-4 bg-black/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-nasa-cyan font-bold text-xs">02 // 3-PHASE BLDC MOTOR INVERTER</span>
                  <span className="text-[10px] text-nasa-cyan">[PROTOTYPE]</span>
                </div>
                <p className="text-xs text-nasa-white/70 mb-2">Gate driver inverter board with active current sensing, regenerative braking, and thermal protection.</p>
                <div className="flex gap-1.5 flex-wrap">
                  {['KiCAD', 'Power MOSFETs', 'Embedded C', 'CAN Bus'].map(t => (
                    <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 border border-white/10 text-nasa-white/80">{t}</span>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 hover:border-nasa-cyan/60 p-4 bg-black/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-nasa-cyan font-bold text-xs">03 // REAL-TIME FPGA SIGNAL ENGINE</span>
                  <span className="text-[10px] text-nasa-white/60">[TESTING]</span>
                </div>
                <p className="text-xs text-nasa-white/70 mb-2">Hardware-accelerated DSP pipeline in Verilog for high-speed sensor acquisition and filtering.</p>
                <div className="flex gap-1.5 flex-wrap">
                  {['Verilog', 'Quartus', 'Cyclone IV', 'DSP'].map(t => (
                    <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 border border-white/10 text-nasa-white/80">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!activeStar && activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="text-xs text-nasa-amber uppercase tracking-wider">
              [ FLIGHT LOG // CAREER & EDUCATION MILESTONES ]
            </div>
            <div className="space-y-4 border-l border-nasa-cyan/30 pl-4">
              <div className="relative space-y-1">
                <div className="w-2.5 h-2.5 bg-nasa-cyan rounded-full absolute -left-[21px] top-1" />
                <div className="text-xs font-bold text-nasa-white">UBC Engineering Physics (ENPH)</div>
                <div className="text-[10px] text-nasa-cyan">University of British Columbia // 2022 - 2027 (Expected)</div>
                <p className="text-xs text-nasa-white/70">Focus on Embedded Systems, Hardware Prototyping, Classical & Quantum Mechanics, and Control Theory.</p>
              </div>

              <div className="relative space-y-1">
                <div className="w-2.5 h-2.5 bg-nasa-amber rounded-full absolute -left-[21px] top-1" />
                <div className="text-xs font-bold text-nasa-white">Hardware Engineering Design Teams</div>
                <div className="text-[10px] text-nasa-amber">Robotics & Autonomous Systems</div>
                <p className="text-xs text-nasa-white/70">Designed custom breakout boards, sensor harnesses, and real-time CAN bus telemetry communication.</p>
              </div>
            </div>
          </div>
        )}

        {!activeStar && activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="text-xs text-nasa-cyan uppercase tracking-wider">
              [ AVIONICS MATRIX // HARDWARE & SOFTWARE SKILLS ]
            </div>
            
            <div className="space-y-3">
              <div className="bg-black/30 p-3 border border-white/10">
                <div className="text-xs text-nasa-cyan font-bold mb-2">HARDWARE & EDA TOOLS</div>
                <div className="text-xs text-nasa-white/80 flex flex-wrap gap-1.5">
                  {['Altium Designer', 'KiCad', 'SolidWorks', 'SMD Soldering', 'Oscilloscopes', 'Logic Analyzers', 'Spectrum Analyzers'].map(s => (
                    <span key={s} className="bg-white/5 border border-white/10 px-2 py-0.5 text-[10px]">{s}</span>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 p-3 border border-white/10">
                <div className="text-xs text-nasa-amber font-bold mb-2">EMBEDDED & FIRMWARE</div>
                <div className="text-xs text-nasa-white/80 flex flex-wrap gap-1.5">
                  {['STM32 / ARM Cortex', 'C / C++', 'FreeRTOS', 'I2C / SPI / UART', 'CAN Bus', 'Verilog / FPGA', 'ESP32'].map(s => (
                    <span key={s} className="bg-white/5 border border-white/10 px-2 py-0.5 text-[10px]">{s}</span>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 p-3 border border-white/10">
                <div className="text-xs text-nasa-white font-bold mb-2">COMPUTATION & MODELING</div>
                <div className="text-xs text-nasa-white/80 flex flex-wrap gap-1.5">
                  {['Python (NumPy / SciPy)', 'MATLAB / Simulink', 'Git', 'Linux / RTOS', 'Docker'].map(s => (
                    <span key={s} className="bg-white/5 border border-white/10 px-2 py-0.5 text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!activeStar && activeTab === 'comms' && (
          <div className="space-y-4">
            <div className="text-xs text-nasa-amber uppercase tracking-wider">
              [ COMMS RELAY // DIRECT CONTACT ]
            </div>
            <p className="text-xs text-nasa-white/70">
              Open for hardware engineering internships, embedded systems roles, and research collaborations.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:contact@ubc.ca" 
                className="block p-3 bg-nasa-cyan/10 border border-nasa-cyan/40 hover:border-nasa-cyan text-nasa-cyan text-xs transition-all"
              >
                EMAIL // INCOMING TRANSMISSIONS &gt;
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="block p-3 bg-white/5 border border-white/10 hover:border-white text-nasa-white text-xs transition-all flex justify-between"
              >
                <span>GITHUB // REPOSITORIES</span>
                <ExternalLink size={14} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="block p-3 bg-white/5 border border-white/10 hover:border-white text-nasa-white text-xs transition-all flex justify-between"
              >
                <span>LINKEDIN // PROFESSIONAL DOSSIER</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function HUDOverlay({ 
  selectedStar, 
  onClearSelection 
}: { 
  selectedStar: StarNodeData | null; 
  onClearSelection: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'cyan' | 'apollo' | 'amber'>('cyan');

  // Hotkey listener for Terminal (~)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        synth.playBeep();
        setTerminalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setTerminalOpen(false);
        setActiveTab(null);
        onClearSelection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClearSelection]);

  const isDossierOpen = !!selectedStar || !!activeTab;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top Header */}
      <TopHeader 
        audioMuted={audioMuted} 
        setAudioMuted={setAudioMuted} 
        onOpenTerminal={() => {
          synth.playBeep();
          setTerminalOpen(true);
        }} 
      />

      {/* CRT / Phosphor Display Mode Switcher (Top Right Corner) */}
      <div className="absolute top-20 right-4 pointer-events-auto flex flex-col items-end gap-1.5 z-30 bg-nasa-bg/85 p-2 border border-white/10 backdrop-blur-xs">
        <div className="text-[8px] text-nasa-white/50 tracking-widest uppercase flex items-center gap-1">
          <Sparkles size={10} className="text-nasa-cyan" />
          <span>PHOSPHOR MODE</span>
        </div>
        <div className="flex gap-1.5">
          <button 
            onClick={() => { synth.playClick(); setThemeMode('cyan'); }} 
            className={`w-4 h-4 border ${themeMode === 'cyan' ? 'bg-nasa-cyan border-white' : 'border-nasa-cyan/40 bg-nasa-cyan/20'} transition-all`}
            title="Telemetry Cyan"
          />
          <button 
            onClick={() => { synth.playClick(); setThemeMode('apollo'); }} 
            className={`w-4 h-4 border ${themeMode === 'apollo' ? 'bg-[#33FF00] border-white' : 'border-[#33FF00]/40 bg-[#33FF00]/20'} transition-all`}
            title="Apollo Phosphor Green"
          />
          <button 
            onClick={() => { synth.playClick(); setThemeMode('amber'); }} 
            className={`w-4 h-4 border ${themeMode === 'amber' ? 'bg-nasa-amber border-white' : 'border-nasa-amber/40 bg-nasa-amber/20'} transition-all`}
            title="Flight Amber"
          />
        </div>
      </div>

      {/* Bottom Nav Deck */}
      <NavDeck 
        activeTab={activeTab} 
        setActiveTab={(t) => {
          setActiveTab(t);
          if (t) onClearSelection();
        }} 
      />

      {/* Slide-out Dossier Drawer */}
      <DossierDrawer 
        isOpen={isDossierOpen} 
        onClose={() => {
          setActiveTab(null);
          onClearSelection();
        }}
        activeStar={selectedStar}
        activeTab={activeTab}
      />

      {/* Secret Flight Terminal */}
      <SecretTerminal 
        isOpen={terminalOpen} 
        onClose={() => setTerminalOpen(false)} 
      />
    </div>
  );
}
