export type Language = "en" | "hi";

export interface Translations {
  tagline: string;
  taglineSub: string;
  oneParcel: string;
  oneIdentity: string;
  everyDept: string;
  microcopyHistory: string;
  searchPlaceholder: string;
  searchByVoice: string;
  commandPalette: string;
  switchRole: string;
  roleCitizen: string;
  roleSubRegistrar: string;
  rolePatwari: string;
  rolePlanner: string;
  roleAdmin: string;
  
  // Navigation
  navExplore: string;
  navDashboard: string;
  navConflictRadar: string;
  navDomino: string;
  navSubdivision: string;
  navCalculator: string;
  navServices: string;
  navLandPulse: string;
  navSchemaMapper: string;
  navChangeDetection: string;
  navApiConsole: string;
  navAuditTrail: string;
  navStandards: string;

  // Land Stack Layers
  layerBase: string;
  layerEssential: string;
  layerUseCase: string;
  cadastralBoundary: string;
  rorOwnership: string;
  deedRegistration: string;
  encumbrance: string;
  zoningPermits: string;
  taxCircleRate: string;
  utilities: string;
  hazardRisk: string;
  
  // 3D
  view3DLayers: string;
  collapseLayers: string;
  expandLayers: string;
  switchTo2D: string;
  switchTo3D: string;
  lowPowerMode: string;

  // Status & Badges
  verified: string;
  tamperProof: string;
  disputeRisk: string;
  healthReport: string;
  downloadPdf: string;
  verifyOnChain: string;
  resolveConflict: string;
  
  // Stats
  parcelsIndexed: string;
  departmentsConnected: string;
  conflictsResolved: string;
  avgResolutionTime: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    tagline: "One parcel. One identity. Every department.",
    taglineSub: "National Land Stack Prototype for Unified Land Governance",
    oneParcel: "One parcel.",
    oneIdentity: "One identity.",
    everyDept: "Every department.",
    microcopyHistory: "Every plot has a line of history",
    searchPlaceholder: "Search by ULPIN (e.g. RJ08040001001A), Khasra no, Owner name, or Village...",
    searchByVoice: "Voice Search (Hindi / English)",
    commandPalette: "Command Palette (Ctrl+K)",
    switchRole: "Switch Role",
    roleCitizen: "Citizen / Land Owner",
    roleSubRegistrar: "Sub-Registrar (Deed Registration)",
    rolePatwari: "Revenue Officer (Patwari / Tehsildar)",
    rolePlanner: "Urban Planner (JDA / Town Planning)",
    roleAdmin: "State Administrator (DLRS Rajasthan)",

    navExplore: "Explore Map",
    navDashboard: "Officer Desk",
    navConflictRadar: "Conflict Radar",
    navDomino: "Domino Tracker",
    navSubdivision: "Subdivision Simulator",
    navCalculator: "Stamp Duty & Valuation",
    navServices: "Citizen Services",
    navLandPulse: "Land Pulse (State)",
    navSchemaMapper: "Schema Mapper",
    navChangeDetection: "Change Detection",
    navApiConsole: "Open APIs",
    navAuditTrail: "Audit Trail",
    navStandards: "Standards & Arch",

    layerBase: "Base Layer",
    layerEssential: "Essential Layer",
    layerUseCase: "Use-Case Layer",
    cadastralBoundary: "Cadastral Boundary & ULPIN",
    rorOwnership: "Jamabandi Record of Rights (RoR)",
    deedRegistration: "Sub-Registrar Deed Registry",
    encumbrance: "Bank Mortgages & Encumbrance (CERSAI)",
    zoningPermits: "Master Plan Zoning & Building Permissions",
    taxCircleRate: "Municipal Property Tax & Circle Rates",
    utilities: "Utility Connections (Power & Water)",
    hazardRisk: "River Buffer & Flood Hazard Zones",

    view3DLayers: "Explode 3D Layers",
    collapseLayers: "Collapse Stack",
    expandLayers: "Expand Stack",
    switchTo2D: "Switch to 2D Map",
    switchTo3D: "Switch to 3D Scene",
    lowPowerMode: "Low Power Mode",

    verified: "VERIFIED",
    tamperProof: "Tamper-Evident Digital Record",
    disputeRisk: "Dispute Risk Score",
    healthReport: "Parcel Health Inspection",
    downloadPdf: "Download PDF Certificate",
    verifyOnChain: "Public Verification Link",
    resolveConflict: "Resolve / Notify Department",

    parcelsIndexed: "Parcels Indexed (Pilot)",
    departmentsConnected: "State Departments Integrated",
    conflictsResolved: "Conflicts Detected & Triaged",
    avgResolutionTime: "Average Resolution Cycle",
  },
  hi: {
    tagline: "एक ज़मीन। एक पहचान। सब विभाग।",
    taglineSub: "एकीकृत भूमि अभिशासन हेतु राष्ट्रीय लैंड स्टैक प्रोटोटाइप",
    oneParcel: "एक ज़मीन।",
    oneIdentity: "एक पहचान।",
    everyDept: "सब विभाग।",
    microcopyHistory: "हर ज़मीन की एक मुकम्मल दास्तान और इतिहास रेखा होती है",
    searchPlaceholder: "ULPIN (उदा. RJ08040001001A), खसरा संख्या, खातेदार का नाम या ग्राम द्वारा खोजें...",
    searchByVoice: "आवाज़ से खोजें (हिंदी / अंग्रेज़ी)",
    commandPalette: "कमांड पैलेट (Ctrl+K)",
    switchRole: "भूमिका बदलें",
    roleCitizen: "नागरिक / भूमि स्वामी",
    roleSubRegistrar: "उप-पंजीयक (विलेख पंजीयन)",
    rolePatwari: "राजस्व अधिकारी (पटवारी / तहसीलदार)",
    rolePlanner: "नगर नियोजक (जेडीए / नगर नियोजन)",
    roleAdmin: "राज्य प्रशासक (भू-अभिलेख विभाग राजस्थान)",

    navExplore: "भू-मानचित्र देखें",
    navDashboard: "अधिकारी डेस्क",
    navConflictRadar: "विवाद राडार",
    navDomino: "डोमिनो ट्रैकर",
    navSubdivision: "विभाजन सिमुलेटर",
    navCalculator: "स्टाम्प शुल्क व मूल्यांकन",
    navServices: "नागरिक सेवाएं",
    navLandPulse: "लैंड पल्स (राज्य)",
    navSchemaMapper: "स्कीमा मैपर",
    navChangeDetection: "भू-परिवर्तन पहचान",
    navApiConsole: "ओपन एपीआई",
    navAuditTrail: "ऑडिट ट्रेल",
    navStandards: "मानक व वास्तुकला",

    layerBase: "आधार परत (Base)",
    layerEssential: "आवश्यक परत (Essential)",
    layerUseCase: "अनुप्रयोग परत (Use-Case)",
    cadastralBoundary: "भूकर सीमा व ULPIN",
    rorOwnership: "जमाबंदी अधिकार अभिलेख (RoR)",
    deedRegistration: "उप-पंजीयक बैनामा रजिस्ट्री",
    encumbrance: "बैंक बंधक व ऋण भार (CERSAI)",
    zoningPermits: "मास्टर प्लान ज़ोनिंग व भवन अनुमतियां",
    taxCircleRate: "संपत्ति कर व डीएलसी दरें",
    utilities: "बिजली-पानी जनोपयोगी कनेक्शन",
    hazardRisk: "नदी बफर व बाढ़ आपदा क्षेत्र",

    view3DLayers: "3D परतें अलग करें",
    collapseLayers: "परतें समेटें",
    expandLayers: "परतें फैलाएं",
    switchTo2D: "2D मानचित्र पर जाएं",
    switchTo3D: "3D दृश्य पर जाएं",
    lowPowerMode: "कम ऊर्जा मोड",

    verified: "प्रमाणित",
    tamperProof: "छेड़छाड़-मुक्त डिजिटल अभिलेख",
    disputeRisk: "विवाद जोखिम सूचकांक",
    healthReport: "भू-पार्सल स्वास्थ्य परीक्षण",
    downloadPdf: "पीडीएफ प्रमाणपत्र डाउनलोड",
    verifyOnChain: "सार्वजनिक सत्यापन लिंक",
    resolveConflict: "समाधान करें / विभाग को भेजें",

    parcelsIndexed: "अनुक्रमित भूखंड (पायलट)",
    departmentsConnected: "संबद्ध राजकीय विभाग",
    conflictsResolved: "पहचाने व सुलझाए गए विवाद",
    avgResolutionTime: "औसत समाधान अवधि",
  },
};
