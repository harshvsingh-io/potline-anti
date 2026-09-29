import { ParcelData } from "@/data/parcels";

const CACHE_KEY = "plotline_offline_parcels";

export function saveParcelToOfflineCache(parcel: ParcelData) {
  if (typeof window === "undefined") return;
  try {
    const existingStr = localStorage.getItem(CACHE_KEY);
    const existing: ParcelData[] = existingStr ? JSON.parse(existingStr) : [];
    const filtered = existing.filter((p) => p.ulpin !== parcel.ulpin);
    filtered.unshift(parcel);
    // Keep last 15 viewed parcels for offline access
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered.slice(0, 15)));
  } catch (err) {
    console.error("Failed to write to offline cache", err);
  }
}

export function getOfflineCachedParcels(): ParcelData[] {
  if (typeof window === "undefined") return [];
  try {
    const existingStr = localStorage.getItem(CACHE_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}
