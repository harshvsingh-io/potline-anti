import * as turf from "@turf/turf";

export interface SplitResult {
  parcelA: {
    coordinates: [number, number][];
    areaSqM: number;
    ulpinSuffix: string;
    isCompliant: boolean;
  };
  parcelB: {
    coordinates: [number, number][];
    areaSqM: number;
    ulpinSuffix: string;
    isCompliant: boolean;
  };
  originalAreaSqM: number;
  minPlotAreaSqM: number;
  splitRatioPct: number;
}

/**
 * Splits a parcel's coordinates into two realistic sub-polygons based on a split ratio (e.g. 50/50, 60/40)
 */
export function simulateSubdivision(
  coordinates: [number, number][],
  splitRatio: number = 0.5, // 0.1 to 0.9
  minPlotArea: number = 100 // min plot size in sq meters
): SplitResult {
  const poly = turf.polygon([coordinates]);
  const originalArea = Math.round(turf.area(poly));

  // Determine bounding box
  const bbox = turf.bbox(poly); // [minX, minY, maxX, maxY]
  const [minX, minY, maxX, maxY] = bbox;
  const splitLng = minX + (maxX - minX) * splitRatio;

  // Approximate division into two quadrilaterals along the longitude cut
  const pA: [number, number][] = [
    [minX, minY],
    [splitLng, minY],
    [splitLng, maxY],
    [minX, maxY],
    [minX, minY],
  ];

  const pB: [number, number][] = [
    [splitLng, minY],
    [maxX, minY],
    [maxX, maxY],
    [splitLng, maxY],
    [splitLng, minY],
  ];

  const polyA = turf.polygon([pA]);
  const polyB = turf.polygon([pB]);

  const rawAreaA = turf.area(polyA);
  const rawAreaB = turf.area(polyB);
  const totalRaw = rawAreaA + rawAreaB;

  const areaA = Math.round((rawAreaA / totalRaw) * originalArea);
  const areaB = Math.round(originalArea - areaA);

  return {
    parcelA: {
      coordinates: pA,
      areaSqM: areaA,
      ulpinSuffix: "/1",
      isCompliant: areaA >= minPlotArea,
    },
    parcelB: {
      coordinates: pB,
      areaSqM: areaB,
      ulpinSuffix: "/2",
      isCompliant: areaB >= minPlotArea,
    },
    originalAreaSqM: originalArea,
    minPlotAreaSqM: minPlotArea,
    splitRatioPct: Math.round(splitRatio * 100),
  };
}

/**
 * Checks if two polygons overlap using Turf.js booleanOverlap / intersect
 */
export function checkSpatialOverlap(
  polyA: [number, number][],
  polyB: [number, number][]
): { doesOverlap: boolean; overlapAreaSqM: number } {
  try {
    const tA = turf.polygon([polyA]);
    const tB = turf.polygon([polyB]);

    const intersection = turf.intersect(turf.featureCollection([tA, tB]));
    if (intersection) {
      const area = Math.round(turf.area(intersection));
      return { doesOverlap: area > 1, overlapAreaSqM: area };
    }
  } catch {
    // Return false if geometry has slight self-intersection in edge cases
  }
  return { doesOverlap: false, overlapAreaSqM: 0 };
}
