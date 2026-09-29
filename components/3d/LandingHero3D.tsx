"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import {
  Compass,
  Layers,
  Sun,
  Moon,
  RefreshCw,
  Sparkles,
  MapPin,
  ShieldAlert,
  Radio,
  Eye,
  Crosshair,
  ArrowUpRight,
  Zap,
} from "lucide-react";

// Land-use palette with rich cartographic shades
const LAND_USE_COLORS: Record<string, string> = {
  Agricultural: "#326848",
  Residential: "#C89552",
  Commercial: "#2F658C",
  Restricted: "#B3372A",
  Industrial: "#5B5173",
};

interface TerrainProps {
  wireframe: boolean;
  themeMode: "day" | "sunset" | "night";
}

// Procedural Topographic Contoured Landscape with Terraced Elevation
const ContouredTerrain: React.FC<TerrainProps> = ({ wireframe, themeMode }) => {
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(42, 36, 100, 90);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Multi-frequency harmonic elevation
      let z =
        Math.sin(x * 0.18) * Math.cos(y * 0.2) * 1.5 +
        Math.sin(x * 0.42 + 1.2) * 0.6 +
        Math.cos(y * 0.38 - 0.8) * 0.45;

      // Diagonal river depression
      const riverDist = Math.abs(x * 0.65 - y * 0.55);
      if (riverDist < 3.2) {
        z -= (3.2 - riverDist) * 0.75;
      }

      // Contour terracing quantizer for architectural stepped look
      const steppedZ = Math.floor(z * 3.2) / 3.2;
      pos.setZ(i, steppedZ * 0.48);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const terrainColor =
    themeMode === "night"
      ? "#0F1A15"
      : themeMode === "sunset"
      ? "#DFCEB8"
      : "#E5DFD3";

  const contourColor =
    themeMode === "night"
      ? "#1E4233"
      : themeMode === "sunset"
      ? "#BFA890"
      : "#BEB5A5";

  return (
    <group position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Solid Terrain Surface */}
      <mesh geometry={terrainGeo} receiveShadow>
        <meshStandardMaterial
          color={terrainColor}
          roughness={0.88}
          metalness={0.05}
          wireframe={wireframe}
          flatShading={true}
        />
      </mesh>

      {/* Contour line grid overlay */}
      {!wireframe && (
        <mesh position={[0, 0, 0.02]} geometry={terrainGeo}>
          <meshBasicMaterial
            color={contourColor}
            wireframe={true}
            transparent={true}
            opacity={0.38}
          />
        </mesh>
      )}

      {/* River Bed Ribbon */}
      <mesh position={[-2, 1, 0.04]} rotation={[0, 0, 0.7]}>
        <planeGeometry args={[3.2, 46]} />
        <meshStandardMaterial
          color={themeMode === "night" ? "#1A3644" : "#689AB8"}
          roughness={0.2}
          metalness={0.6}
          transparent={true}
          opacity={0.75}
        />
      </mesh>

      {/* Primary Road Ribbon */}
      <mesh position={[1, 0, 0.05]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[1.6, 44]} />
        <meshStandardMaterial
          color={themeMode === "night" ? "#19221E" : "#8A8376"}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

// Moving LiDAR Laser Scanner Beam
const LidarScannerBeam: React.FC<{ active: boolean; themeMode: string }> = ({
  active,
  themeMode,
}) => {
  const beamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!active || !beamRef.current) return;
    const t = state.clock.getElapsedTime();
    const scanZ = Math.sin(t * 0.75) * 14;
    beamRef.current.position.z = scanZ;
  });

  if (!active) return null;

  const beamColor = themeMode === "night" ? "#00FF99" : "#1F4D3A";

  return (
    <group ref={beamRef} position={[0, 1.8, 0]}>
      {/* Horizontal laser line plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 0.25]} />
        <meshBasicMaterial
          color={beamColor}
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Downward light curtain */}
      <mesh position={[0, -1.2, 0]}>
        <planeGeometry args={[36, 2.4]} />
        <meshBasicMaterial
          color={beamColor}
          transparent={true}
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

interface ParcelBlockProps {
  parcel: ParcelData;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (parcel: ParcelData | null) => void;
  onClick: (parcel: ParcelData) => void;
  themeMode: "day" | "sunset" | "night";
}

const ParcelBlock: React.FC<ParcelBlockProps> = ({
  parcel,
  index,
  isSelected,
  isHovered,
  onHover,
  onClick,
  themeMode,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const hasAnomaly = parcel.inconsistencies.length > 0;

  // Grid coordinates mapped across the terrain
  const col = (index % 8) - 3.5;
  const row = Math.floor(index / 8) - 2;
  const posX = col * 3.6 + ((row % 2) * 0.7);
  const posZ = row * 3.4 + ((col % 2) * 0.5);

  // Height based on land use and floors
  const baseHeight =
    parcel.landUse === "Commercial"
      ? 1.6
      : parcel.landUse === "Residential"
      ? 1.1
      : parcel.landUse === "Industrial"
      ? 1.3
      : 0.45;

  const height = isSelected ? baseHeight * 1.45 : isHovered ? baseHeight * 1.25 : baseHeight;

  // Dimensions
  const sizeX = 2.1 + (parcel.areaSqM % 600) / 1000;
  const sizeZ = 2.0 + (parcel.areaSqM % 500) / 1000;

  // Natural terrain elevation
  const terrainElev = Math.sin(posX * 0.18) * Math.cos(posZ * 0.2) * 0.65;
  const posY = terrainElev + height / 2;

  const baseColor = hasAnomaly
    ? "#B3372A"
    : LAND_USE_COLORS[parcel.landUse] || "#326848";

  // Pulse animation for anomalies & hovered parcels
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current && (hasAnomaly || isHovered || isSelected)) {
      meshRef.current.position.y = posY + Math.sin(t * 3.5 + index) * 0.12;
    }
    if (ringRef.current && hasAnomaly) {
      const s = 1 + (Math.sin(t * 4.5) + 1) * 0.35;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[posX, 0, posZ]}>
      {/* Cadastral Land Parcel Solid Body */}
      <mesh
        ref={meshRef}
        position={[0, posY, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick(parcel);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(parcel);
        }}
        onPointerOut={() => {
          onHover(null);
        }}
      >
        <boxGeometry args={[sizeX, height, sizeZ]} />
        <meshStandardMaterial
          color={isSelected ? "#F5B041" : isHovered ? "#F4D03F" : baseColor}
          roughness={0.5}
          metalness={0.25}
          emissive={isSelected ? "#7A5010" : isHovered ? "#504010" : hasAnomaly ? "#501210" : "#000000"}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0.3}
        />
      </mesh>

      {/* Architectural Hairline Edges */}
      <lineSegments position={[0, posY + height / 2 + 0.02, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(sizeX + 0.02, 0.02, sizeZ + 0.02)]} />
        <lineBasicMaterial
          color={
            isSelected
              ? "#FFFFFF"
              : isHovered
              ? "#1B2621"
              : themeMode === "night"
              ? "#388062"
              : "#1B2621"
          }
          linewidth={1.5}
        />
      </lineSegments>

      {/* Geodetic Corner Survey Markers */}
      <mesh position={[sizeX / 2, posY + height / 2 + 0.05, sizeZ / 2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={themeMode === "night" ? "#00FF99" : "#C9922E"} />
      </mesh>
      <mesh position={[-sizeX / 2, posY + height / 2 + 0.05, -sizeZ / 2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={themeMode === "night" ? "#00FF99" : "#C9922E"} />
      </mesh>

      {/* Pulsing Beacon Ring for Inconsistency Flag */}
      {hasAnomaly && (
        <group position={[0, posY + height / 2 + 0.08, 0]}>
          <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.55, 24]} />
            <meshBasicMaterial color="#B3372A" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <octahedronGeometry args={[0.22]} />
            <meshBasicMaterial color="#FF4D3D" />
          </mesh>
        </group>
      )}

      {/* Floating 3D HUD Tag for Flagged / Hovered Parcels */}
      {(isHovered || isSelected || index === 0 || index === 3) && (
        <Html
          position={[0, posY + height / 2 + 0.9, 0]}
          center
          distanceFactor={19}
          zIndexRange={[100, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClick(parcel);
            }}
            className={`cursor-pointer px-3 py-1.5 border shadow-2xl font-mono whitespace-nowrap transition-all duration-200 pointer-events-auto select-none ${
              hasAnomaly
                ? "bg-[#B3372A] text-white border-[#FF6B5E] ring-2 ring-surveyRed/40"
                : "bg-paper/95 dark:bg-night-card/95 text-ink dark:text-paper border-hairline hover:border-forest"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider">
              {hasAnomaly ? (
                <ShieldAlert className="w-3 h-3 text-white animate-pulse" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-forest" />
              )}
              <span>{parcel.ulpin}</span>
            </div>
            <div className="text-[11px] font-bold mt-0.5 truncate max-w-[150px]">
              {parcel.khasraNo} • {parcel.landUse}
            </div>
            <div className="text-[9px] opacity-80 flex items-center justify-between gap-2 mt-0.5">
              <span>{parcel.areaSqM.toLocaleString()} m²</span>
              <span className="underline font-bold">Inspect →</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Smooth Camera Controller
interface CameraManagerProps {
  targetPosition: [number, number, number] | null;
  autoRotate: boolean;
}

const CameraManager: React.FC<CameraManagerProps> = ({ targetPosition }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (targetPosition) {
      camera.position.lerp(
        new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]),
        0.05
      );
    }
  });

  return null;
};

export const LandingHero3D: React.FC = () => {
  const router = useRouter();
  const [selectedParcel, setSelectedParcel] = useState<ParcelData | null>(null);
  const [hoveredParcel, setHoveredParcel] = useState<ParcelData | null>(null);
  const [wireframe, setWireframe] = useState(false);
  const [themeMode, setThemeMode] = useState<"day" | "sunset" | "night">("day");
  const [lidarScanActive, setLidarScanActive] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<[number, number, number] | null>(null);
  const controlsRef = useRef<any>(null);

  const activeParcel = selectedParcel || hoveredParcel;

  const handleSelectParcel = (parcel: ParcelData) => {
    setSelectedParcel(parcel);
  };

  const handleOpen360 = (ulpin: string) => {
    router.push(`/parcel/${ulpin}`);
  };

  // Camera Presets
  const flyToAnomaly = () => {
    setCameraPreset([-3.5, 9, 6]);
    setAutoRotate(false);
    const anomalyParcel = PARCELS_DATA.find((p) => p.inconsistencies.length > 0);
    if (anomalyParcel) setSelectedParcel(anomalyParcel);
  };

  const flyToOrtho = () => {
    setCameraPreset([0, 30, 0.5]);
    setAutoRotate(false);
  };

  const flyToIso = () => {
    setCameraPreset([16, 20, 22]);
    setAutoRotate(true);
  };

  const handleResetCamera = () => {
    setCameraPreset([0, 19, 24]);
    setAutoRotate(true);
    setSelectedParcel(null);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[580px] bg-gradient-to-b from-[#E7E0D3] to-[#D8CFC0] dark:from-[#0E1713] dark:to-[#080D0B] border border-hairline overflow-hidden select-none shadow-xl">
      
      {/* Top HUD Telemetry Ribbon */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline px-3.5 py-1.5 font-mono text-xs text-ink dark:text-paper shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse" />
          <span className="font-bold text-[11px] uppercase tracking-wider">
            3D Cadastral Digital Twin • Sanganer Pilot
          </span>
          <span className="text-ink-faint">|</span>
          <span className="text-[10px] text-ink-muted">40 Vectors Loaded</span>
        </div>

        {/* Right 3D Viewport Controls Dock */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline p-1 font-mono text-xs shadow-sm">
          
          {/* Theme switcher */}
          <div className="flex items-center border-r border-hairline pr-1 mr-1 gap-1">
            <button
              onClick={() => setThemeMode("day")}
              className={`p-1.5 transition-colors ${
                themeMode === "day" ? "bg-paper-dark dark:bg-night text-forest font-bold" : "text-ink-muted hover:text-ink"
              }`}
              title="Daylight illumination"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setThemeMode("sunset")}
              className={`p-1.5 transition-colors ${
                themeMode === "sunset" ? "bg-ochre/20 text-ochre font-bold" : "text-ink-muted hover:text-ink"
              }`}
              title="Golden Hour / Sunset"
            >
              <Sparkles className="w-3.5 h-3.5 text-ochre" />
            </button>
            <button
              onClick={() => setThemeMode("night")}
              className={`p-1.5 transition-colors ${
                themeMode === "night" ? "bg-night text-paper font-bold" : "text-ink-muted hover:text-ink"
              }`}
              title="Night / LiDAR Matrix"
            >
              <Moon className="w-3.5 h-3.5 text-ochre" />
            </button>
          </div>

          {/* LiDAR Laser Scan Toggle */}
          <button
            onClick={() => setLidarScanActive(!lidarScanActive)}
            className={`px-2 py-1 text-[10px] uppercase font-bold flex items-center gap-1 transition-colors ${
              lidarScanActive ? "bg-forest text-paper" : "text-ink-muted hover:text-ink"
            }`}
            title="Toggle active LiDAR laser scan sweep"
          >
            <Radio className="w-3 h-3 animate-pulse" />
            <span>LiDAR</span>
          </button>

          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
              wireframe ? "bg-forest text-paper" : "text-ink-muted hover:text-ink"
            }`}
            title="Toggle topographical wireframe mesh"
          >
            Wire
          </button>

          {/* Auto-rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
              autoRotate ? "bg-paper-dark dark:bg-night text-forest" : "text-ink-muted"
            }`}
            title="Toggle camera auto-spin"
          >
            {autoRotate ? "Orbit On" : "Orbit Off"}
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 text-ink-muted hover:text-ink dark:hover:text-paper"
            title="Reset perspective"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Camera Quick-Jump Pills */}
      <div className="absolute top-14 left-3 z-10 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
        <button
          onClick={flyToAnomaly}
          className="px-2.5 py-1 bg-surveyRed text-white font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-surveyRed-hover transition-colors"
        >
          <Crosshair className="w-3 h-3 animate-spin" />
          <span>Target Anomaly</span>
        </button>
        <button
          onClick={flyToIso}
          className="px-2.5 py-1 bg-paper/90 dark:bg-night-surface/90 border border-hairline font-semibold uppercase hover:border-forest text-ink dark:text-paper transition-colors"
        >
          Isometric 45°
        </button>
        <button
          onClick={flyToOrtho}
          className="px-2.5 py-1 bg-paper/90 dark:bg-night-surface/90 border border-hairline font-semibold uppercase hover:border-forest text-ink dark:text-paper transition-colors"
        >
          Satellite Ortho
        </button>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 19, 24], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Dynamic Multi-source Lighting */}
        <ambientLight
          intensity={
            themeMode === "night" ? 0.35 : themeMode === "sunset" ? 0.8 : 1.3
          }
        />
        <directionalLight
          position={
            themeMode === "night"
              ? [-15, 25, -10]
              : themeMode === "sunset"
              ? [28, 14, 16]
              : [20, 32, 18]
          }
          intensity={
            themeMode === "night" ? 0.7 : themeMode === "sunset" ? 1.9 : 1.8
          }
          color={
            themeMode === "night"
              ? "#90A4AE"
              : themeMode === "sunset"
              ? "#FFA760"
              : "#FFF9EE"
          }
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-15, 12, -15]}
          intensity={0.4}
          color={themeMode === "sunset" ? "#B87560" : "#80A090"}
        />

        <CameraManager
          targetPosition={cameraPreset}
          autoRotate={autoRotate}
        />

        <ContouredTerrain wireframe={wireframe} themeMode={themeMode} />

        <LidarScannerBeam active={lidarScanActive} themeMode={themeMode} />

        {PARCELS_DATA.map((parcel, idx) => (
          <ParcelBlock
            key={parcel.ulpin}
            parcel={parcel}
            index={idx}
            isSelected={selectedParcel?.ulpin === parcel.ulpin}
            isHovered={hoveredParcel?.ulpin === parcel.ulpin}
            onHover={setHoveredParcel}
            onClick={handleSelectParcel}
            themeMode={themeMode}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2.12}
          minDistance={8}
          maxDistance={45}
          autoRotate={autoRotate && !hoveredParcel && !selectedParcel}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Floating High-Tech Parcel HUD Drawer (Appears when any parcel is selected/hovered) */}
      {activeParcel && (
        <div className="absolute bottom-12 left-3 right-3 sm:right-auto sm:w-[380px] z-20 hud-glass p-3.5 shadow-2xl border-l-4 border-l-forest transition-all duration-300 font-mono">
          <div className="flex items-start justify-between gap-2 border-b border-hairline pb-2 mb-2">
            <div>
              <div className="text-[10px] text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest animate-ping" />
                <span>Geodetic Vector Live Telemetry</span>
              </div>
              <div className="font-serif text-base font-bold text-ink dark:text-paper leading-tight mt-0.5">
                {activeParcel.khasraNo} • {activeParcel.village}
              </div>
            </div>
            <span
              className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                activeParcel.inconsistencies.length > 0
                  ? "bg-surveyRed text-white"
                  : "bg-forest text-paper"
              }`}
            >
              {activeParcel.inconsistencies.length > 0 ? "Flagged Anomaly" : "Clean Title"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] mb-2.5">
            <div className="bg-paper-light/60 dark:bg-night-card/60 p-1.5 border border-hairline">
              <span className="text-ink-muted block text-[9px]">ULPIN IDENTIFIER</span>
              <span className="font-bold text-forest truncate block">{activeParcel.ulpin}</span>
            </div>
            <div className="bg-paper-light/60 dark:bg-night-card/60 p-1.5 border border-hairline">
              <span className="text-ink-muted block text-[9px]">SURFACE AREA</span>
              <span className="font-bold text-ink dark:text-paper">
                {activeParcel.areaSqM.toLocaleString()} m² ({activeParcel.areaOriginal})
              </span>
            </div>
          </div>

          {/* Department Interop Indicators */}
          <div className="border-t border-hairline pt-2 mb-3">
            <div className="text-[9px] uppercase font-bold text-ink-muted mb-1">
              Cross-Department Interop Status:
            </div>
            <div className="grid grid-cols-4 gap-1 text-[8px] text-center font-bold">
              <div className="p-1 bg-forest/10 border border-forest/30 text-forest">
                REVENUE ✓
              </div>
              <div
                className={`p-1 border ${
                  activeParcel.inconsistencies.some((i) => i.toLowerCase().includes("registrar") || i.toLowerCase().includes("deed"))
                    ? "bg-surveyRed/10 border-surveyRed/40 text-surveyRed"
                    : "bg-forest/10 border-forest/30 text-forest"
                }`}
              >
                REGISTRY {activeParcel.inconsistencies.some((i) => i.toLowerCase().includes("registrar") || i.toLowerCase().includes("deed")) ? "!" : "✓"}
              </div>
              <div className="p-1 bg-forest/10 border border-forest/30 text-forest">
                ZONING ✓
              </div>
              <div
                className={`p-1 border ${
                  activeParcel.tax.paymentStatus !== "Paid"
                    ? "bg-ochre/15 border-ochre/40 text-ochre"
                    : "bg-forest/10 border-forest/30 text-forest"
                }`}
              >
                TAX {activeParcel.tax.paymentStatus !== "Paid" ? "!" : "✓"}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => handleOpen360(activeParcel.ulpin)}
            className="w-full py-2 bg-forest hover:bg-forest-hover text-paper text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Open 360° Cadastre Dossier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Cartographic HUD Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline p-2 text-[10px] font-mono flex flex-wrap items-center gap-3 shadow-sm">
        <span className="flex items-center gap-1.5 font-bold text-forest">
          <span className="w-2.5 h-2.5 inline-block bg-[#326848]" /> Agricultural
        </span>
        <span className="flex items-center gap-1.5 font-bold text-ochre">
          <span className="w-2.5 h-2.5 inline-block bg-[#C89552]" /> Residential
        </span>
        <span className="flex items-center gap-1.5 font-bold text-[#2F658C]">
          <span className="w-2.5 h-2.5 inline-block bg-[#2F658C]" /> Commercial
        </span>
        <span className="flex items-center gap-1.5 font-bold text-surveyRed">
          <span className="w-2.5 h-2.5 inline-block bg-[#B3372A]" /> Conflict Beacon
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline px-2.5 py-1 text-[10px] font-mono text-ink-muted shadow-sm">
        LiDAR: EPSG:4326 • 60 FPS Three.js Engine
      </div>
    </div>
  );
};
