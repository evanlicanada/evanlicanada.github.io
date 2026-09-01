import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  starName: string;
  coord: [number, number, number];
  color: string;
  status: string;
  category: string;
  summary: string;
  specs: Array<{ label: string; val: string }>;
  tech: string[];
  coverImage?: string;
  github?: string;
  schematicUrl?: string;
}

export interface StarNodeData {
  id: string;
  name: string;
  subname?: string;
  pos: [number, number, number];
  color: string;
  category: string;
  status: string;
  desc?: string;
  slug?: string;
  coverImage?: string;
}

interface Props {
  projects?: ProjectItem[];
  onSelectStar?: (star: StarNodeData) => void;
  activeStarId?: string | null;
}

export default function StarMapCanvas({ projects = [], onSelectStar, activeStarId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredStar, setHoveredStar] = useState<StarNodeData | null>(null);
  const [starScreenCoords, setStarScreenCoords] = useState<{ [id: string]: { x: number; y: number; visible: boolean } }>({});
  
  // Animation & Control Refs
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);

  // Build full star systems list from Dynamic Projects + Sol Origin
  const starSystems: StarNodeData[] = [
    {
      id: 'sol',
      name: 'SOL // EARTH',
      subname: 'UBC ENGPHYS ORIGIN',
      pos: [0, 0, 0],
      color: '#00E5FF',
      category: 'ORIGIN // PROFILE',
      status: 'ACTIVE',
      desc: 'Evan — UBC Engineering Physics student specializing in hardware, embedded systems, and instrumentation.'
    },
    ...projects.map(p => ({
      id: p.id,
      name: p.starName,
      subname: p.title.toUpperCase().substring(0, 24) + (p.title.length > 24 ? '...' : ''),
      pos: p.coord,
      color: p.color,
      category: p.category,
      status: p.status,
      desc: p.summary,
      slug: p.slug,
      coverImage: p.coverImage
    }))
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080D, 0.015);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 7, 13);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 50;
    controls.minDistance = 2;
    controls.target.set(0, 0, -4);
    controlsRef.current = controls;

    // 1. Galactic Reference Grid Plane
    const gridSize = 45;
    const gridDivisions = 45;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00E5FF, 0x1E293B);
    gridHelper.position.y = -4;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // 2. Realistic Starfield Background
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 160;
      starPositions[i + 1] = (Math.random() - 0.5) * 160;
      starPositions[i + 2] = (Math.random() - 0.5) * 160;

      const r = Math.random();
      if (r > 0.8) {
        starColors[i] = 1.0; starColors[i + 1] = 0.6; starColors[i + 2] = 0.2;
      } else if (r > 0.5) {
        starColors[i] = 0.2; starColors[i + 1] = 0.8; starColors[i + 2] = 1.0;
      } else {
        starColors[i] = 0.9; starColors[i + 1] = 0.95; starColors[i + 2] = 1.0;
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 3. Trajectory Curve (Sol -> Flagship Project e.g. Tau Ceti)
    const flagshipPos = starSystems.find(s => s.id === 'avionics-capstone' || s.name.includes('TAU'))?.pos || [-7, 2, -8];
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-2, 1.5, -2.5),
      new THREE.Vector3(-4.5, 3.0, -5.0),
      new THREE.Vector3(...flagshipPos)
    ]);
    const curvePoints = curve.getPoints(80);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineDashedMaterial({
      color: 0xFF9900,
      linewidth: 2,
      scale: 1,
      dashSize: 0.4,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.8
    });
    const trajectoryLine = new THREE.Line(curveGeo, curveMat);
    trajectoryLine.computeLineDistances();
    scene.add(trajectoryLine);

    // 4. Interactive Dynamic Star Nodes + Drop Lines
    const starMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: StarNodeData }[] = [];
    const starGroup = new THREE.Group();
    scene.add(starGroup);

    starSystems.forEach((star) => {
      const pos = new THREE.Vector3(...star.pos);
      const color = new THREE.Color(star.color);

      // Vertical Drop Line to Ground Plane (y = -4)
      const dropLineGeo = new THREE.BufferGeometry().setFromPoints([
        pos,
        new THREE.Vector3(pos.x, -4, pos.z)
      ]);
      const dropLineMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35
      });
      const dropLine = new THREE.Line(dropLineGeo, dropLineMat);
      starGroup.add(dropLine);

      // Footprint marker on the grid
      const footGeo = new THREE.RingGeometry(0.12, 0.2, 16);
      footGeo.rotateX(-Math.PI / 2);
      const footMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const footMesh = new THREE.Mesh(footGeo, footMat);
      footMesh.position.set(pos.x, -3.98, pos.z);
      starGroup.add(footMesh);

      // Core Star Sphere
      const sphereGeo = new THREE.SphereGeometry(0.2, 24, 24);
      const sphereMat = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.copy(pos);
      sphere.userData = { starData: star };
      starGroup.add(sphere);

      // Outer Target Reticle / Halo
      const haloGeo = new THREE.RingGeometry(0.35, 0.42, 24);
      const haloMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      starGroup.add(halo);

      starMeshes.push({ mesh: sphere, halo, data: star });
    });

    // 5. Raycaster for click & hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(starMeshes.map(s => s.mesh));

      if (intersects.length > 0) {
        const star = intersects[0].object.userData.starData as StarNodeData;
        setHoveredStar(star);
        container.style.cursor = 'pointer';
      } else {
        setHoveredStar(null);
        container.style.cursor = 'grab';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(starMeshes.map(s => s.mesh));

      if (intersects.length > 0) {
        const star = intersects[0].object.userData.starData as StarNodeData;
        onSelectStar?.(star);
        targetCamPos.current = new THREE.Vector3(star.pos[0] + 3, star.pos[1] + 2, star.pos[2] + 4);
        targetLookAt.current = new THREE.Vector3(...star.pos);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const tempV = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      if (targetCamPos.current && targetLookAt.current) {
        camera.position.lerp(targetCamPos.current, 0.05);
        controls.target.lerp(targetLookAt.current, 0.05);
        if (camera.position.distanceTo(targetCamPos.current) < 0.1) {
          targetCamPos.current = null;
          targetLookAt.current = null;
        }
      }

      controls.update();

      // Pulse halos
      starMeshes.forEach(({ halo, mesh, data }, index) => {
        halo.quaternion.copy(camera.quaternion);
        const scale = 1 + Math.sin(elapsedTime * 3 + index) * 0.12;
        halo.scale.set(scale, scale, scale);
        mesh.position.y = data.pos[1] + Math.sin(elapsedTime * 1.5 + data.pos[0]) * 0.08;
        halo.position.y = mesh.position.y;
      });

      // Calculate 2D Screen Projections for HTML HUD Labels
      const coords: { [id: string]: { x: number; y: number; visible: boolean } } = {};
      const widthHalf = container.clientWidth / 2;
      const heightHalf = container.clientHeight / 2;

      starSystems.forEach(star => {
        tempV.set(...star.pos);
        tempV.project(camera);
        const isBehind = tempV.z > 1;
        coords[star.id] = {
          x: (tempV.x * widthHalf) + widthHalf,
          y: -(tempV.y * heightHalf) + heightHalf,
          visible: !isBehind && tempV.z < 1
        };
      });
      setStarScreenCoords(coords);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [projects, onSelectStar]);

  const setCameraView = (view: 'SOL' | 'TRAJECTORY' | 'FLAGSHIP' | 'GALACTIC') => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (view === 'SOL') {
      targetCamPos.current = new THREE.Vector3(4, 2.5, 5);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
    } else if (view === 'FLAGSHIP') {
      const flagship = starSystems.find(s => s.id === 'avionics-capstone' || s.name.includes('TAU')) || starSystems[1];
      targetCamPos.current = new THREE.Vector3(flagship.pos[0] + 3, flagship.pos[1] + 2, flagship.pos[2] + 4);
      targetLookAt.current = new THREE.Vector3(...flagship.pos);
    } else if (view === 'TRAJECTORY') {
      targetCamPos.current = new THREE.Vector3(-1, 8, 2);
      targetLookAt.current = new THREE.Vector3(-3.5, 1, -4);
    } else if (view === 'GALACTIC') {
      targetCamPos.current = new THREE.Vector3(12, 14, 18);
      targetLookAt.current = new THREE.Vector3(0, -1, -4);
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating 2D HUD Labels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {starSystems.map(star => {
          const sc = starScreenCoords[star.id];
          if (!sc || !sc.visible) return null;

          const isHovered = hoveredStar?.id === star.id;
          const isCurrentActive = activeStarId === star.id;

          return (
            <div
              key={star.id}
              style={{
                transform: `translate(${sc.x}px, ${sc.y}px)`,
                position: 'absolute',
                top: 0,
                left: 0
              }}
              className="transition-opacity duration-150"
            >
              <div 
                onClick={() => onSelectStar?.(star)}
                className={`pointer-events-auto cursor-pointer -translate-x-1/2 -translate-y-1/2 px-2 py-1 flex flex-col items-center group ${
                  isHovered || isCurrentActive ? 'scale-110 z-30' : 'opacity-85 hover:opacity-100'
                } transition-all duration-200`}
              >
                {/* Target Reticle */}
                <div 
                  className={`w-6 h-6 border ${
                    isHovered ? 'border-nasa-cyan bg-nasa-cyan/20 animate-pulse' : 'border-white/40'
                  } rounded-none flex items-center justify-center mb-1 transition-colors`}
                  style={{ borderColor: star.color }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: star.color }} />
                </div>

                {/* Star Label & Coordinates */}
                <div className="bg-nasa-bg/90 backdrop-blur-sm border border-white/15 px-2 py-0.5 text-center flex flex-col items-center">
                  <span className="text-[11px] font-display tracking-widest uppercase font-bold text-white group-hover:text-nasa-cyan transition-colors">
                    {star.name}
                  </span>
                  {star.subname && (
                    <span className="text-[8px] text-nasa-white/60 tracking-wider font-mono">
                      {star.subname}
                    </span>
                  )}
                  <span className="text-[7px] text-nasa-amber/80 font-mono tracking-tighter">
                    [{star.pos.map(p => p.toFixed(1)).join(', ')}]
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Camera Navigation Preset Controls */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-wrap gap-2 pointer-events-auto">
        <button
          onClick={() => setCameraView('SOL')}
          className="px-3 py-1.5 bg-nasa-bg/90 border border-nasa-cyan/40 hover:border-nasa-cyan text-nasa-cyan text-[10px] font-display tracking-widest uppercase hover:bg-nasa-cyan/20 transition-all"
        >
          [ SOL SYSTEM ]
        </button>
        <button
          onClick={() => setCameraView('TRAJECTORY')}
          className="px-3 py-1.5 bg-nasa-bg/90 border border-nasa-amber/40 hover:border-nasa-amber text-nasa-amber text-[10px] font-display tracking-widest uppercase hover:bg-nasa-amber/20 transition-all"
        >
          [ TRAJECTORY ]
        </button>
        <button
          onClick={() => setCameraView('FLAGSHIP')}
          className="px-3 py-1.5 bg-nasa-bg/90 border border-nasa-red/40 hover:border-nasa-red text-nasa-red text-[10px] font-display tracking-widest uppercase hover:bg-nasa-red/20 transition-all"
        >
          [ FLAGSHIP PAYLOAD ]
        </button>
        <button
          onClick={() => setCameraView('GALACTIC')}
          className="px-3 py-1.5 bg-nasa-bg/90 border border-white/30 hover:border-white text-white/80 text-[10px] font-display tracking-widest uppercase hover:bg-white/10 transition-all"
        >
          [ GALACTIC ]
        </button>
      </div>
    </div>
  );
}
