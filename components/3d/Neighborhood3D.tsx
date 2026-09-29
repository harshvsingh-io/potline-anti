"use client";

import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import {
  Sun,
  Moon,
  AlertTriangle,
  Layers,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  Radio,
  Building2,
} from "lucide-react";

type ColorMode = "zoning" | "tax" | "risk";

const ZONING_COLORS: Record<string, string> = {
  Agricultural: "#326848",
  Residential: "#C89552",
  Commercial: "#2F658C",
  Industrial: "#665C7B",
  "Eco-Sensitive / Flood Buffer": "#B3372A",
};

interface BuildingBlockProps {
  parcel: ParcelData;
  index: number;
  colorMode: ColorMode;
  isRadarPulseOnly?: boolean;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (parcel: ParcelData | null) => void;
  onClick: (parcel: ParcelData) => void;
  isNight: boolean;
}

const BuildingBlock: React.FC<BuildingBlockProps> = ({
  parcel,
  index,
  colorMode,
  isHovered,
  isSelected,
  onHover,
  onClick,
  isNight,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const col = (index % 8) - 3.5;
  const row = Math.floor(index / 8) - 2;
  const posX = col * 3.2;
  const posZ = row * 3.0;

  const hasAnomaly = parcel.inconsistencies.length > 0;

  // Height from max floors
  const maxFloors = parcel.zoning.maxFloors || 1;
  const height = 0.6 + maxFloors * 0.55;

  // Compute color based on active colorMode
  let color = "#C89552";
  if (colorMode === "zoning") {
    color = ZONING_COLORS[parcel.zoning.zoneType] || "#326848";
  } else if (colorMode === "tax") {
    color =
      parcel.tax.paymentStatus === "Paid"
        ? "#326848"
        : parcel.tax.paymentStatus === "Due This Cycle"
        ? "#C9922E"
        : "#B3372A";
  } else if (colorMode === "risk") {
    color =
      parcel.disputeRiskScore > 60
        ? "#B3372A"
        : parcel.disputeRiskScore > 30
        ? "#C9922E"
        : "#326848";
  }

  // Conflict Radar highlight pulse
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current && (hasAnomaly || isHovered || isSelected)) {
      meshRef.current.position.y =
        height / 2 + Math.sin(t * 3.8 + index) * 0.12 + 0.08;
    }
    if (beaconRef.current && hasAnomaly) {
      beaconRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group position={[posX, 0, posZ]}>
      {/* 3D Massing Extrusion */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
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
        onPointerOut={() => onHover(null)}
      >
        <boxGeometry args={[2.4, height, 2.2]} />
        <meshStandardMaterial
          color={
            isSelected
              ? "#F5B041"
              : isHovered
              ? "#F4D03F"
              : hasAnomaly
              ? "#B3372A"
              : color
          }
          roughness={0.65}
          metalness={0.2}
          emissive={
            isSelected
              ? "#805510"
              : isHovered
              ? "#604810"
              : hasAnomaly
              ? "#4A1010"
              : "#000000"
          }
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.35 : 0.2}
        />
      </mesh>

      {/* Ceiling frame */}
      <lineSegments position={[0, height + 0.01, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.42, 0.02, 2.22)]} />
        <lineBasicMaterial
          color={
            isSelected
              ? "#FFFFFF"
              : isHovered
              ? "#1B2621"
              : isNight
              ? "#388062"
              : "#1B2621"
          }
          linewidth={1.5}
        />
      </lineSegments>

      {/* Anomaly warning beacon */}
      {hasAnomaly && (
        <group position={[0, height + 0.6, 0]}>
          <mesh ref={beaconRef}>
            <octahedronGeometry args={[0.3]} />
            <meshBasicMaterial color="#FF4D3D" />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshBasicMaterial color="#B3372A" />
          </mesh>
        </group>
      )}

      {/* Floating 3D label on hover or key parcels */}
      {(isHovered || isSelected) && (
        <Html position={[0, height + 1.1, 0]} center distanceFactor={18}>
          <div className="bg-paper/95 dark:bg-night-card/95 border border-forest px-2.5 py-1 text-[10px] font-mono whitespace-nowrap shadow-xl pointer-events-none">
            <span className="font-bold text-forest">{parcel.khasraNo}</span> •{" "}
            <span>{maxFloors} Flr ({parcel.zoning.zoneType})</span>
          </div>
        </Html>
      )}
    </group>
  );
};

// Animated Radar Pulse Ring in 3D
const ExpandingRadarPulse: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = (state.clock.getElapsedTime() * 0.4) % 1;
    const scale = 1 + t * 24;
    ringRef.current.scale.set(scale, scale, 1);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, 0.6 * (1 - t));
  });

  return (
    <mesh
      ref={ringRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.05, 0]}
    >
      <ringGeometry args={[0.95, 1.05, 64]} />
      <meshBasicMaterial
        color={isNight ? "#00FF99" : "#1F4D3A"}
        transparent={true}
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const Neighborhood3D: React.FC<{
  initialHighlightAnomalies?: boolean;
}> = ({ initialHighlightAnomalies = false }) => {
  const router = useRouter();
  const [colorMode, setColorMode] = useState<ColorMode>("zoning");
  const [isNight, setIsNight] = useState(false);
  const [hoveredParcel, setHoveredParcel] = useState<ParcelData | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<ParcelData | null>(null);

  const activeParcel = selectedParcel || hoveredParcel;

  const handleOpen360 = (ulpin: string) => {
    router.push(`/parcel/${ulpin}`);
  };

  return (
    <div className="relative w-full h-[580px] bg-gradient-to-b from-[#EAE4D8] to-[#DDD4C3] dark:from-[#121B17] dark:to-[#0A100E] border border-hairline overflow-hidden select-none shadow-xl">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [14, 18, 20], fov: 36 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={isNight ? 0.35 : 1.3} />
        <directionalLight
          position={isNight ? [-10, 20, -10] : [20, 30, 20]}
          intensity={isNight ? 0.6 : 1.8}
          color={isNight ? "#8899AA" : "#FFFFFF"}
          castShadow
        />

        {/* Ground grid */}
        <gridHelper
          args={[
            36,
            36,
            isNight ? "#2E4F3E" : "#1F4D3A",
            isNight ? "#1C2D25" : "#D4CCC0",
          ]}
        />

        <ExpandingRadarPulse isNight={isNight} />

        {PARCELS_DATA.map((p, idx) => (
          <BuildingBlock
            key={p.ulpin}
            parcel={p}
            index={idx}
            colorMode={colorMode}
            isRadarPulseOnly={initialHighlightAnomalies}
            isHovered={hoveredParcel?.ulpin === p.ulpin}
            isSelected={selectedParcel?.ulpin === p.ulpin}
            onHover={setHoveredParcel}
            onClick={setSelectedParcel}
            isNight={isNight}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={8}
          maxDistance={42}
          autoRotate={!activeParcel}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Floating Mode Controls Dock */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline p-1 shadow-sm">
          <button
            onClick={() => setColorMode("zoning")}
            className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors ${
              colorMode === "zoning"
                ? "bg-forest text-paper font-bold"
                : "text-ink-muted hover:text-ink dark:hover:text-paper"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Master Plan Zoning</span>
          </button>
          <button
            onClick={() => setColorMode("tax")}
            className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors ${
              colorMode === "tax"
                ? "bg-forest text-paper font-bold"
                : "text-ink-muted hover:text-ink dark:hover:text-paper"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Tax Compliance</span>
          </button>
          <button
            onClick={() => setColorMode("risk")}
            className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 transition-colors ${
              colorMode === "risk"
                ? "bg-forest text-paper font-bold"
                : "text-ink-muted hover:text-ink dark:hover:text-paper"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Dispute Risk</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="pointer-events-auto flex items-center gap-2 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline p-1 font-mono text-xs shadow-sm">
          <button
            onClick={() => setIsNight(!isNight)}
            className="p-1.5 text-ink-muted hover:text-ink dark:hover:text-paper"
            title="Toggle lighting"
          >
            {isNight ? (
              <Moon className="w-3.5 h-3.5 text-ochre" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-forest" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Parcel Inspector HUD Drawer */}
      {activeParcel && (
        <div className="absolute bottom-12 left-3 right-3 sm:right-auto sm:w-[380px] z-20 hud-glass p-3.5 shadow-2xl border-l-4 border-l-forest transition-all font-mono">
          <div className="flex items-start justify-between gap-2 border-b border-hairline pb-2 mb-2">
            <div>
              <div className="text-[10px] text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-forest" />
                <span>Urban Massing Analysis</span>
              </div>
              <div className="font-serif text-base font-bold text-ink dark:text-paper">
                {activeParcel.khasraNo} • {activeParcel.zoning.zoneType}
              </div>
            </div>
            <span
              className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                activeParcel.inconsistencies.length > 0
                  ? "bg-surveyRed text-white"
                  : "bg-forest text-paper"
              }`}
            >
              {activeParcel.inconsistencies.length > 0
                ? "Dispute Flagged"
                : "Compliant"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] mb-2.5">
            <div className="bg-paper-light/60 dark:bg-night-card/60 p-1.5 border border-hairline">
              <span className="text-ink-muted block text-[9px]">MAX PERMITTED FLOORS</span>
              <span className="font-bold text-forest">
                {activeParcel.zoning.maxFloors} Floors (FAR: {activeParcel.zoning.maxFAR})
              </span>
            </div>
            <div className="bg-paper-light/60 dark:bg-night-card/60 p-1.5 border border-hairline">
              <span className="text-ink-muted block text-[9px]">TAX COMPLIANCE</span>
              <span
                className={`font-bold ${
                  activeParcel.tax.paymentStatus === "Paid"
                    ? "text-forest"
                    : "text-ochre"
                }`}
              >
                {activeParcel.tax.paymentStatus}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleOpen360(activeParcel.ulpin)}
            className="w-full py-2 bg-forest hover:bg-forest-hover text-paper text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>View Full 360° Cadastre Dossier</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline p-2 text-[10px] font-mono flex flex-wrap items-center gap-3 shadow-sm">
        {colorMode === "zoning" && (
          <>
            <span className="flex items-center gap-1 font-bold text-forest">
              <span className="w-2 h-2 inline-block bg-[#326848]" /> Agricultural
            </span>
            <span className="flex items-center gap-1 font-bold text-ochre">
              <span className="w-2 h-2 inline-block bg-[#C89552]" /> Residential
            </span>
            <span className="flex items-center gap-1 font-bold text-[#2F658C]">
              <span className="w-2 h-2 inline-block bg-[#2F658C]" /> Commercial
            </span>
            <span className="flex items-center gap-1 font-bold text-[#665C7B]">
              <span className="w-2 h-2 inline-block bg-[#665C7B]" /> Industrial
            </span>
          </>
        )}
        {colorMode === "tax" && (
          <>
            <span className="flex items-center gap-1 font-bold text-forest">
              <span className="w-2 h-2 inline-block bg-[#326848]" /> Paid
            </span>
            <span className="flex items-center gap-1 font-bold text-ochre">
              <span className="w-2 h-2 inline-block bg-[#C9922E]" /> Due This Cycle
            </span>
            <span className="flex items-center gap-1 font-bold text-surveyRed">
              <span className="w-2 h-2 inline-block bg-[#B3372A]" /> Default / Overdue
            </span>
          </>
        )}
        {colorMode === "risk" && (
          <>
            <span className="flex items-center gap-1 font-bold text-forest">
              <span className="w-2 h-2 inline-block bg-[#326848]" /> Low Risk (&lt;30)
            </span>
            <span className="flex items-center gap-1 font-bold text-ochre">
              <span className="w-2 h-2 inline-block bg-[#C9922E]" /> Moderate Risk (30-60)
            </span>
            <span className="flex items-center gap-1 font-bold text-surveyRed">
              <span className="w-2 h-2 inline-block bg-[#B3372A]" /> High Risk / Dispute (&gt;60)
            </span>
          </>
        )}
      </div>

      <div className="absolute bottom-3 right-3 z-10 bg-paper/90 dark:bg-night-surface/90 backdrop-blur-md border border-hairline px-2.5 py-1 text-[10px] font-mono text-ink-muted shadow-sm">
        3D Urban Heights & FAR Compliance
      </div>
    </div>
  );
};
