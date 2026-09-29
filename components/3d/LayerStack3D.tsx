"use client";

import React, { useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { X, Sliders, Info, Layers, Building, Landmark, AlertTriangle, ShieldCheck } from "lucide-react";
import { ParcelData } from "@/data/parcels";
import { useApp } from "../providers/AppProvider";

interface LayerPlateProps {
  level: number;
  expansionFactor: number;
  label: string;
  department: string;
  color: string;
  description: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  childrenDetails: string[];
}

const LayerPlate: React.FC<LayerPlateProps> = ({
  level,
  expansionFactor,
  label,
  department,
  color,
  isHovered,
  onHover,
  onLeave,
  childrenDetails,
}) => {
  // Height spacing based on expansionFactor (0 to 1)
  const yPos = level * (0.6 + expansionFactor * 2.2);

  return (
    <group position={[0, yPos, 0]}>
      {/* Translucent survey plate */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerOut={() => {
          onLeave();
        }}
      >
        <boxGeometry args={[7.2, 0.08, 5.2]} />
        <meshStandardMaterial
          color={isHovered ? "#FFF8EE" : color}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={isHovered ? 0.9 : 0.6}
        />
      </mesh>

      {/* Perimeter boundary hairline with corner tick marks */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(7.22, 0.09, 5.22)]} />
        <lineBasicMaterial color={isHovered ? "#B3372A" : "#1B2621"} linewidth={2} />
      </lineSegments>

      {/* 4 Corner Brass Standoff Pins */}
      {[
        [-3.4, 0, -2.4],
        [3.4, 0, -2.4],
        [-3.4, 0, 2.4],
        [3.4, 0, 2.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
          <meshStandardMaterial color={isHovered ? "#B3372A" : "#C9922E"} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Surface Cadastral Vectors on plate */}
      <group position={[0, 0.05, 0]}>
        <gridHelper args={[6.8, 8, isHovered ? "#B3372A" : color, "#B8B0A2"]} />
      </group>

      {/* Floating 3D Text Label on edge */}
      <Text
        position={[-3.3, 0.28, 2.3]}
        fontSize={0.27}
        color={isHovered ? "#1B2621" : "#1B2621"}
        anchorX="left"
        anchorY="middle"
      >
        {`${level}. ${label}`}
      </Text>
    </group>
  );
};

interface LayerStack3DModalProps {
  parcel: ParcelData;
  isOpen: boolean;
  onClose: () => void;
}

export const LayerStack3DModal: React.FC<LayerStack3DModalProps> = ({
  parcel,
  isOpen,
  onClose,
}) => {
  const { lang } = useApp();
  const [expansion, setExpansion] = useState(0.8); // 0 to 1
  const [activePlateIndex, setActivePlateIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const layersConfig = [
    {
      level: 1,
      name: "BASE LAYER: Cadastral Boundary & ULPIN",
      nameHi: "आधार परत: भूकर सीमा व ULPIN",
      department: "Survey & Settlement Department",
      color: "#355E3B",
      description: "ISO 19152 LADM georeferenced boundary polygon, ETS survey pins, coordinate centroid.",
      details: [
        `ULPIN: ${parcel.ulpin}`,
        `Survey / Khasra: ${parcel.khasraNo}`,
        `Area: ${parcel.areaSqM} m² (${parcel.areaOriginal})`,
        `Centroid: ${parcel.centroid[0].toFixed(5)}, ${parcel.centroid[1].toFixed(5)}`,
      ],
    },
    {
      level: 2,
      name: "ESSENTIAL LAYER: Jamabandi RoR (Ownership)",
      nameHi: "आवश्यक परत: जमाबंदी अधिकार अभिलेख",
      department: "Department of Revenue (Board of Revenue)",
      color: "#B8860B",
      description: "Recorded Khatedar legal title holders, coparcenary shares, inheritance succession, mutation numbers.",
      details: [
        `Owner: ${parcel.owners[0]?.name}`,
        `Father: ${parcel.owners[0]?.fatherName}`,
        `Share: ${parcel.owners[0]?.sharePct}%`,
        `Mutation No: ${parcel.owners[0]?.mutationNumber} (${parcel.owners[0]?.mutationDate})`,
      ],
    },
    {
      level: 3,
      name: "ESSENTIAL LAYER: Sub-Registrar Deeds",
      nameHi: "आवश्यक परत: उप-पंजीयक विलेख बैनामा",
      department: "Registration & Stamps Department",
      color: "#5F9EA0",
      description: "Deed transactions, registered conveyances, stamp duty valuations, execution dates.",
      details: [
        `Latest Deed: ${parcel.latestDeed.deedNo}`,
        `Registered Date: ${parcel.latestDeed.regDate}`,
        `Buyer: ${parcel.latestDeed.buyerName}`,
        `Consideration Value: ₹${parcel.latestDeed.declaredValue.toLocaleString("en-IN")}`,
      ],
    },
    {
      level: 4,
      name: "ESSENTIAL LAYER: Encumbrance & Mortgages",
      nameHi: "आवश्यक परत: बैंक बंधक व ऋण भार",
      department: "CERSAI / Scheduled Commercial Banks",
      color: "#8B4513",
      description: "Equitable mortgages, court attachments, government charges, commercial bank collateral liens.",
      details: [
        `Encumbrance Status: ${parcel.encumbrances.length > 0 ? "Active Lien Found" : "Nil Encumbrance"}`,
        parcel.encumbrances[0] ? `Bank: ${parcel.encumbrances[0].bankName}` : "Clear Title Certificate",
        parcel.encumbrances[0] ? `Loan Amount: ₹${parcel.encumbrances[0].loanAmount.toLocaleString("en-IN")}` : "No Bank Charges",
      ],
    },
    {
      level: 5,
      name: "ESSENTIAL LAYER: Master Plan Zoning & Permits",
      nameHi: "आवश्यक परत: मास्टर प्लान ज़ोनिंग व अनुमतियां",
      department: "Jaipur Development Authority (Town Planning)",
      color: "#4682B4",
      description: "Statutory Master Plan 2025 zoning code, permissible FAR, maximum building height, municipal building permits.",
      details: [
        `Zone Code: ${parcel.zoning.masterPlanCode}`,
        `Classification: ${parcel.zoning.zoneType}`,
        `Permit Status: ${parcel.zoning.permitStatus} (${parcel.zoning.buildingPermitNo || "None"})`,
        `Max FAR: ${parcel.zoning.maxFAR}`,
      ],
    },
    {
      level: 6,
      name: "USE-CASE LAYER: Municipal Property Taxes",
      nameHi: "अनुप्रयोग परत: नगरपालिका संपत्ति कर",
      department: "Jaipur Municipal Corporation (Revenue Cell)",
      color: "#808000",
      description: "Annual municipal tax assessment, circle rate value benchmarks, arrears and payment compliance status.",
      details: [
        `Tax ID: ${parcel.tax.taxId}`,
        `Annual Assessment: ₹${parcel.tax.annualDemand}`,
        `Total Dues: ₹${parcel.tax.totalDue.toLocaleString("en-IN")}`,
        `Payment Status: ${parcel.tax.paymentStatus}`,
      ],
    },
    {
      level: 7,
      name: "USE-CASE LAYER: Utilities & Hazard Restrictions",
      nameHi: "अनुप्रयोग परत: बिजली-पानी व बाढ़ आपदा बफर",
      department: "Discom (JVVNL) / PHED / Disaster Management",
      color: parcel.floodZoneIntersect ? "#B3372A" : "#2E8B57",
      description: "Utility consumer billing synchronization, Dravyavati river flood setback buffer, eco-sensitive restrictions.",
      details: [
        `Power Meter (JVVNL): ${parcel.utilities.electricityId}`,
        `Water Account (PHED): ${parcel.utilities.waterId}`,
        `Flood Zone Intersect: ${parcel.floodZoneIntersect ? "CRITICAL RISK (Within 100-yr HFL)" : "Clear (Outside Buffer)"}`,
      ],
    },
  ];

  const activePlate = activePlateIndex !== null ? layersConfig[activePlateIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-6xl h-[88vh] bg-paper dark:bg-night-surface border border-hairline shadow-2xl flex flex-col overflow-hidden rounded-none">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-hairline bg-paper-light dark:bg-night-card flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-forest text-paper text-[10px] font-mono uppercase tracking-wider font-bold">
                Signature DPI Architecture
              </span>
              <span className="font-mono text-xs text-ink-muted">
                Parcel ULPIN: <strong className="text-ink dark:text-paper">{parcel.ulpin}</strong>
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink dark:text-paper mt-0.5">
              {lang === "hi" ? "3D लैंड स्टैक परत विस्फोटन" : "3D Exploded Layer Stack View"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Slider to collapse and expand stack */}
            <div className="flex items-center gap-2 bg-paper dark:bg-night border border-hairline px-3 py-1.5">
              <Sliders className="w-3.5 h-3.5 text-forest" />
              <span className="text-[11px] font-mono uppercase text-ink-muted">
                {lang === "hi" ? "विस्फोटन" : "Stack Height"}:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={expansion}
                onChange={(e) => setExpansion(parseFloat(e.target.value))}
                className="w-28 accent-forest cursor-pointer"
              />
              <span className="text-[11px] font-mono text-ink dark:text-paper w-8 text-right">
                {Math.round(expansion * 100)}%
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 border border-hairline text-ink-muted hover:text-ink dark:hover:text-paper hover:bg-paper-light dark:hover:bg-night"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 3D Canvas + Interactive Layer Inspector Panel */}
        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          
          {/* 3D Scene */}
          <div className="flex-1 h-full min-h-[400px] relative bg-[#E6DFD3] dark:bg-[#0E1612]">
            <Canvas camera={{ position: [9, 11, 14], fov: 38 }}>
              <ambientLight intensity={1.4} />
              <directionalLight position={[10, 20, 15]} intensity={1.5} />
              <directionalLight position={[-10, 10, -10]} intensity={0.6} />

              {/* Central Pillar */}
              <mesh position={[0, (layersConfig.length * (0.6 + expansion * 2.2)) / 2, 0]}>
                <cylinderGeometry args={[0.04, 0.04, layersConfig.length * (0.6 + expansion * 2.2) + 1, 16]} />
                <meshStandardMaterial color="#B3372A" opacity={0.3} transparent />
              </mesh>

              {layersConfig.map((layer, idx) => (
                <LayerPlate
                  key={layer.level}
                  level={layer.level}
                  expansionFactor={expansion}
                  label={lang === "hi" ? layer.nameHi : layer.name}
                  department={layer.department}
                  color={layer.color}
                  description={layer.description}
                  isHovered={activePlateIndex === idx}
                  onHover={() => setActivePlateIndex(idx)}
                  onLeave={() => {}}
                  childrenDetails={layer.details}
                />
              ))}

              <OrbitControls
                enableZoom={true}
                enablePan={true}
                maxPolarAngle={Math.PI / 2.05}
                minDistance={6}
                maxDistance={30}
              />
            </Canvas>

            <div className="absolute bottom-3 left-3 bg-paper/90 dark:bg-night-surface/90 border border-hairline p-2 text-[10px] font-mono text-ink-muted">
              Use Left Mouse to Orbit • Right Mouse to Pan • Scroll to Zoom
            </div>
          </div>

          {/* Right Inspector Panel */}
          <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-hairline bg-paper-light dark:bg-night-card p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-forest" />
                <h3 className="font-serif font-bold text-lg text-ink dark:text-paper">
                  {lang === "hi" ? "परत का विवरण" : "Departmental Layer Profile"}
                </h3>
              </div>

              {activePlate ? (
                <div className="space-y-4">
                  <div className="p-3 border border-hairline bg-paper dark:bg-night-surface">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold block mb-1">
                      Level {activePlate.level} Tier
                    </span>
                    <h4 className="font-serif text-base font-bold text-ink dark:text-paper leading-snug">
                      {lang === "hi" ? activePlate.nameHi : activePlate.name}
                    </h4>
                    <div className="mt-2 text-xs font-mono text-ink-muted">
                      <span className="text-ink dark:text-paper font-semibold">Origin Department: </span>
                      {activePlate.department}
                    </div>
                    <p className="text-xs text-ink-light dark:text-paper/80 mt-2 leading-relaxed">
                      {activePlate.description}
                    </p>
                  </div>

                  <div className="p-3 border border-hairline bg-paper dark:bg-night-surface space-y-1.5 font-mono text-xs">
                    <div className="text-[10px] uppercase tracking-wider text-ink-muted mb-2 font-bold">
                      Live Parcel Attributes:
                    </div>
                    {activePlate.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-ink dark:text-paper py-0.5 border-b border-hairline last:border-none">
                        <span className="text-forest font-bold">•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-hairline text-ink-muted text-xs font-mono">
                  <Info className="w-6 h-6 mx-auto mb-2 text-forest/60" />
                  Hover over any floating translucent plate to inspect its provenance, originating government department, and real-time attributes.
                </div>
              )}
            </div>

            {/* Microcopy footer */}
            <div className="mt-6 pt-4 border-t border-hairline text-[11px] font-mono text-ink-muted">
              <span className="text-forest font-bold">Land Stack Principle: </span>
              Each department maintains authority over its layer, while ULPIN guarantees exact multi-tier spatial alignment without duplicated databases.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
