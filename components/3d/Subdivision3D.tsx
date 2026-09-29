"use client";

import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { SplitResult } from "@/lib/turfUtils";

interface Subdivision3DProps {
  splitResult: SplitResult;
  baseUlpin: string;
}

export const Subdivision3D: React.FC<Subdivision3DProps> = ({ splitResult, baseUlpin }) => {
  const { parcelA, parcelB, splitRatioPct } = splitResult;

  // Compute block widths proportional to ratio
  const totalWidth = 8;
  const widthA = totalWidth * (splitRatioPct / 100);
  const widthB = totalWidth * ((100 - splitRatioPct) / 100);

  // Position them with a small physical severance gap (0.3)
  const posA_X = -(totalWidth / 2) + widthA / 2;
  const posB_X = posA_X + widthA / 2 + 0.3 + widthB / 2;

  return (
    <div className="relative w-full h-[360px] bg-[#E5DFD2] dark:bg-[#121B17] border border-hairline overflow-hidden select-none">
      <Canvas camera={{ position: [0, 8, 12], fov: 42 }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[10, 15, 10]} intensity={1.6} castShadow />

        {/* Ground grid */}
        <gridHelper args={[16, 16, "#1F4D3A", "#D0C8B8"]} />

        {/* Plot A Extruded Block */}
        <group position={[posA_X, 0.7, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[widthA, 1.4, 4.5]} />
            <meshStandardMaterial
              color={parcelA.isCompliant ? "#437A58" : "#B3372A"}
              roughness={0.6}
            />
          </mesh>
          <lineSegments position={[0, 0.71, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(widthA + 0.02, 0.02, 4.52)]} />
            <lineBasicMaterial color="#1B2621" linewidth={2} />
          </lineSegments>
          <Text
            position={[0, 0.9, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.32}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`${baseUlpin}/1 (${parcelA.areaSqM} m²)`}
          </Text>
        </group>

        {/* Plot B Extruded Block */}
        <group position={[posB_X, 0.7, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[widthB, 1.4, 4.5]} />
            <meshStandardMaterial
              color={parcelB.isCompliant ? "#C49A5B" : "#B3372A"}
              roughness={0.6}
            />
          </mesh>
          <lineSegments position={[0, 0.71, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(widthB + 0.02, 0.02, 4.52)]} />
            <lineBasicMaterial color="#1B2621" linewidth={2} />
          </lineSegments>
          <Text
            position={[0, 0.9, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.32}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`${baseUlpin}/2 (${parcelB.areaSqM} m²)`}
          </Text>
        </group>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={6}
          maxDistance={20}
        />
      </Canvas>

      <div className="absolute bottom-2 left-2 bg-paper/90 dark:bg-night-surface/90 border border-hairline px-2.5 py-1 text-[10px] font-mono text-ink-muted">
        3D Procedural Severance Preview • {splitRatioPct}% / {100 - splitRatioPct}% Ratio
      </div>
    </div>
  );
};
