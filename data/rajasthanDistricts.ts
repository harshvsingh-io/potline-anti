export interface StateDistrictStat {
  district: string;
  districtHi: string;
  totalParcels: number;
  ulpinAssigned: number;
  coveragePct: number;
  pendingMutations: number;
  conflictsDetected: number;
  conflictsResolved: number;
  avgResolutionDays: number;
  disputeHotspotSeverity: "low" | "medium" | "high";
  coordinates: [number, number]; // [lat, lng]
}

export const RAJASTHAN_DISTRICT_STATS: StateDistrictStat[] = [
  {
    district: "Jaipur",
    districtHi: "जयपुर",
    totalParcels: 842100,
    ulpinAssigned: 816837,
    coveragePct: 97.0,
    pendingMutations: 1240,
    conflictsDetected: 342,
    conflictsResolved: 298,
    avgResolutionDays: 14,
    disputeHotspotSeverity: "high",
    coordinates: [26.9124, 75.7873],
  },
  {
    district: "Jodhpur",
    districtHi: "जोधपुर",
    totalParcels: 612400,
    ulpinAssigned: 569532,
    coveragePct: 93.0,
    pendingMutations: 890,
    conflictsDetected: 184,
    conflictsResolved: 156,
    avgResolutionDays: 18,
    disputeHotspotSeverity: "medium",
    coordinates: [26.2389, 73.0243],
  },
  {
    district: "Udaipur",
    districtHi: "उदयपुर",
    totalParcels: 480200,
    ulpinAssigned: 427378,
    coveragePct: 89.0,
    pendingMutations: 640,
    conflictsDetected: 142,
    conflictsResolved: 120,
    avgResolutionDays: 21,
    disputeHotspotSeverity: "medium",
    coordinates: [24.5854, 73.7125],
  },
  {
    district: "Kota",
    districtHi: "कोटा",
    totalParcels: 395100,
    ulpinAssigned: 379296,
    coveragePct: 96.0,
    pendingMutations: 410,
    conflictsDetected: 98,
    conflictsResolved: 89,
    avgResolutionDays: 11,
    disputeHotspotSeverity: "low",
    coordinates: [25.2138, 75.8648],
  },
  {
    district: "Ajmer",
    districtHi: "अजमेर",
    totalParcels: 510800,
    ulpinAssigned: 485260,
    coveragePct: 95.0,
    pendingMutations: 720,
    conflictsDetected: 165,
    conflictsResolved: 148,
    avgResolutionDays: 16,
    disputeHotspotSeverity: "medium",
    coordinates: [26.4499, 74.6399],
  },
  {
    district: "Bikaner",
    districtHi: "बीकानेर",
    totalParcels: 420900,
    ulpinAssigned: 374601,
    coveragePct: 89.0,
    pendingMutations: 580,
    conflictsDetected: 112,
    conflictsResolved: 95,
    avgResolutionDays: 19,
    disputeHotspotSeverity: "low",
    coordinates: [28.0229, 73.3119],
  },
  {
    district: "Alwar",
    districtHi: "अलवर",
    totalParcels: 590000,
    ulpinAssigned: 542800,
    coveragePct: 92.0,
    pendingMutations: 930,
    conflictsDetected: 240,
    conflictsResolved: 205,
    avgResolutionDays: 17,
    disputeHotspotSeverity: "high",
    coordinates: [27.5530, 76.6346],
  },
  {
    district: "Bharatpur",
    districtHi: "भरतपुर",
    totalParcels: 378000,
    ulpinAssigned: 336420,
    coveragePct: 89.0,
    pendingMutations: 510,
    conflictsDetected: 130,
    conflictsResolved: 110,
    avgResolutionDays: 20,
    disputeHotspotSeverity: "medium",
    coordinates: [27.2152, 77.4930],
  },
];
