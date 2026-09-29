"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PARCELS_DATA, ParcelData } from "@/data/parcels";
import { Layers, Eye, ShieldAlert } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dynamic import of React Leaflet components to avoid SSR window errors
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((m) => m.Polygon), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });

interface ParcelMap2DProps {
  selectedUlpin?: string;
  onSelectParcel?: (parcel: ParcelData) => void;
  height?: string;
  showAllParcels?: boolean;
}

export const ParcelMap2D: React.FC<ParcelMap2DProps> = ({
  selectedUlpin,
  onSelectParcel,
  height = "520px",
  showAllParcels = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    baseCadastral: true,
    floodBuffer: true,
    riskHotspots: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full bg-paper-dark dark:bg-night-surface border border-hairline flex items-center justify-center font-mono text-xs text-ink-muted"
        style={{ height }}
      >
        Initializing Leaflet Cartographic Engine...
      </div>
    );
  }

  // Selected parcel or default to first parcel
  const activeParcel = PARCELS_DATA.find((p) => p.ulpin === selectedUlpin) || PARCELS_DATA[0];
  const center: [number, number] = activeParcel.centroid;

  return (
    <div className="relative w-full border border-hairline overflow-hidden" style={{ height }}>
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ background: "#EAE4D7" }}
      >
        {/* Cartographic Light OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Survey of India Datum'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="filter-carto"
        />

        {/* 40 Parcel Polygons */}
        {showAllParcels &&
          PARCELS_DATA.map((parcel) => {
            const isSelected = parcel.ulpin === selectedUlpin;
            const hasAnomaly = parcel.inconsistencies.length > 0;
            // Coordinates in Leaflet format: [lat, lng]
            const leafletCoords: [number, number][] = parcel.coordinates.map((c) => [c[1], c[0]]);

            let fillColor = "#1F4D3A";
            if (parcel.landUse === "Commercial") fillColor = "#3C6E8F";
            else if (parcel.landUse === "Residential") fillColor = "#C49A5B";
            else if (parcel.landUse === "Restricted" || parcel.floodZoneIntersect) fillColor = "#B3372A";

            if (activeLayers.riskHotspots && hasAnomaly) {
              fillColor = "#B3372A";
            }

            return (
              <Polygon
                key={parcel.ulpin}
                positions={leafletCoords}
                pathOptions={{
                  color: isSelected ? "#B3372A" : hasAnomaly ? "#B3372A" : "#1B2621",
                  weight: isSelected ? 3 : 1.2,
                  dashArray: hasAnomaly ? "4, 4" : undefined,
                  fillColor: fillColor,
                  fillOpacity: isSelected ? 0.65 : 0.35,
                }}
                eventHandlers={{
                  click: () => {
                    if (onSelectParcel) onSelectParcel(parcel);
                  },
                }}
              >
                <Popup>
                  <div className="p-1 font-mono text-xs text-ink">
                    <div className="font-bold text-forest">{parcel.ulpin}</div>
                    <div className="text-[11px] font-semibold">{parcel.khasraNo} ({parcel.village})</div>
                    <div className="text-[10px] text-ink-muted">
                      Owner: {parcel.owners[0]?.name}
                    </div>
                    <div className="text-[10px] text-ink-muted">
                      Area: {parcel.areaSqM} m² ({parcel.areaOriginal})
                    </div>
                    {hasAnomaly && (
                      <div className="mt-1 text-[10px] text-surveyRed font-bold">
                        ⚠ {parcel.inconsistencies[0]}
                      </div>
                    )}
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Centroid Survey Pin for Selected Parcel */}
        {activeParcel && (
          <CircleMarker
            center={activeParcel.centroid}
            radius={5}
            pathOptions={{
              color: "#B3372A",
              fillColor: "#FFFFFF",
              fillOpacity: 1,
              weight: 2,
            }}
          />
        )}
      </MapContainer>

      {/* Floating Layer Controls Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-paper/95 dark:bg-night-surface/95 border border-hairline p-2 text-xs font-mono shadow-md space-y-1.5">
        <div className="flex items-center gap-1.5 text-forest font-bold text-[10px] uppercase tracking-wider pb-1 border-b border-hairline">
          <Layers className="w-3 h-3" />
          <span>GIS Layers</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-ink dark:text-paper text-[11px]">
          <input
            type="checkbox"
            checked={activeLayers.baseCadastral}
            onChange={(e) =>
              setActiveLayers({ ...activeLayers, baseCadastral: e.target.checked })
            }
            className="accent-forest"
          />
          <span>Cadastral Vectors</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-ink dark:text-paper text-[11px]">
          <input
            type="checkbox"
            checked={activeLayers.riskHotspots}
            onChange={(e) =>
              setActiveLayers({ ...activeLayers, riskHotspots: e.target.checked })
            }
            className="accent-surveyRed"
          />
          <span>Anomaly Radar</span>
        </label>
      </div>

      {/* Coordinate HUD in bottom left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-paper/90 dark:bg-night-surface/90 border border-hairline px-2.5 py-1 text-[10px] font-mono text-ink-muted">
        Datum: WGS84 • Lat: {activeParcel.centroid[0].toFixed(5)}°N • Lng: {activeParcel.centroid[1].toFixed(5)}°E
      </div>
    </div>
  );
};
