export interface OwnerRecord {
  name: string;
  hindiName: string;
  fatherName: string;
  sharePct: number;
  aadharMasked: string;
  phoneMasked: string;
  mutationNumber: string;
  mutationDate: string;
  tenureType: string;
}

export interface DeedRecord {
  deedNo: string;
  regDate: string;
  sro: string; // Sub-Registrar Office
  sellerName: string;
  buyerName: string;
  declaredValue: number; // in INR
  circleRateValue: number; // in INR
  stampDutyPaid: number; // in INR
  registrationFee: number; // in INR
  deedType: string;
}

export interface EncumbranceRecord {
  id: string;
  bankName: string;
  loanAmount: number;
  mortgageType: string;
  cersaiRegNumber: string;
  status: "Active" | "Discharged" | "Undisclosed";
  registeredInSro: boolean;
  date: string;
}

export interface ZoningRecord {
  masterPlanCode: string;
  zoneType: "Agricultural" | "Residential" | "Commercial" | "Industrial" | "Eco-Sensitive / Flood Buffer";
  maxFloors: number;
  maxFAR: number;
  buildingPermitNo: string | null;
  permitStatus: "Approved" | "Unauthorized" | "Pending" | "None";
  permitDate: string | null;
}

export interface TaxRecord {
  taxId: string;
  assessmentYear: string;
  annualDemand: number;
  totalDue: number;
  paymentStatus: "Paid" | "Unpaid 3+ Years" | "Due This Cycle";
  lastPaidDate: string | null;
  receiptNo: string | null;
}

export interface UtilityRecord {
  electricityId: string;
  electricityConsumer: string;
  waterId: string;
  waterConsumer: string;
  status: "Active" | "Mismatched Name" | "Pending Transfer";
}

export interface RiskFactor {
  factor: string;
  score: number;
  explanation: string;
  severity: "critical" | "warning" | "advisory";
  department: string;
}

export interface HealthCheck {
  id: string;
  title: string;
  titleHi: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  detailHi: string;
  department: string;
}

export interface ParcelData {
  ulpin: string;
  khasraNo: string;
  surveyNo: string;
  village: string;
  villageHi: string;
  tehsil: string;
  district: string;
  state: string;
  areaSqM: number;
  areaOriginal: string; // e.g., "1 Bigha 4 Biswa"
  areaRoRSqM: number; // For area mismatch checks
  landUse: "Agricultural" | "Residential" | "Commercial" | "Restricted" | "Industrial";
  coordinates: [number, number][]; // [longitude, latitude] for GeoJSON polygon
  centroid: [number, number]; // [lat, lng]
  elevationMeters: number;
  disputeRiskScore: number; // 0 - 100
  disputeRiskFactors?: RiskFactor[];
  riskFactors?: RiskFactor[];
  healthChecks: HealthCheck[];
  inconsistencies: string[];
  
  // Layer details
  owners: OwnerRecord[];
  latestDeed: DeedRecord;
  encumbrances: EncumbranceRecord[];
  zoning: ZoningRecord;
  tax: TaxRecord;
  utilities: UtilityRecord;
  circleRatePerSqM: number;
  roadWidthMeters: number;
  floodZoneIntersect: boolean;
  encroachmentFlag: boolean;
  historyTimeline: {
    date: string;
    department: string;
    event: string;
    eventHi: string;
    actor: string;
    docRef?: string;
  }[];
}

// Center of pilot around Jaipur: Lat 26.8320, Lng 75.7950
const BASE_LAT = 26.8320;
const BASE_LNG = 75.7950;

// Helper to generate a realistic quadrilateral / polygon
function makePolygon(
  col: number,
  row: number,
  skewX = 0,
  skewY = 0
): [number, number][] {
  const stepX = 0.0035;
  const stepY = 0.0028;
  const x0 = BASE_LNG + col * stepX + skewX;
  const y0 = BASE_LAT + row * stepY + skewY;
  const width = stepX * 0.88;
  const height = stepY * 0.86;

  // Closed loop: [lng, lat]
  return [
    [x0, y0],
    [x0 + width + (col % 2) * 0.0003, y0 - 0.0001],
    [x0 + width * 0.95, y0 + height + (row % 2) * 0.0002],
    [x0 - (col % 3) * 0.0002, y0 + height * 0.96],
    [x0, y0],
  ];
}

// 40 Parcels: 20 Rural (Sanganer Khasra) + 20 Urban (Jaipur Ward 14)
export const PARCELS_DATA: ParcelData[] = [
  // --- INCONSISTENCY 1: RoR owner differs from registered buyer (Pending / Delayed Mutation) ---
  {
    ulpin: "RJ08040001001A",
    khasraNo: "142/1",
    surveyNo: "SNG-RUR-142",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 2529,
    areaOriginal: "1 Bigha 0 Biswa",
    areaRoRSqM: 2529,
    landUse: "Agricultural",
    coordinates: makePolygon(0, 0),
    centroid: [BASE_LAT + 0.0014, BASE_LNG + 0.0017],
    elevationMeters: 392,
    disputeRiskScore: 78,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: 9,
    circleRatePerSqM: 4200,
    inconsistencies: ["RoR Jamabandi owner differs from registered sale deed buyer (unmutated sale)"],
    riskFactors: [
      {
        factor: "Unmutated Sale Deed",
        score: 45,
        explanation: "Sub-Registrar recorded sale deed to Vikramaditya Meena in 2022, but Revenue RoR still reflects original vendor Ram Charan Sharma.",
        severity: "critical",
        department: "Revenue / Registration",
      },
      {
        factor: "Mutation Latency > 180 Days",
        score: 33,
        explanation: "Automatic registry-to-revenue mutation feed was pending or rejected at Patwari desk.",
        severity: "warning",
        department: "Revenue",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "fail", detail: "Registered buyer Vikramaditya Meena not updated in Jamabandi RoR.", detailHi: "पंजीकृत क्रेता का नाम जमाबंदी में दर्ज नहीं हुआ।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "No bank encumbrance on title.", detailHi: "शीर्षक पर कोई बैंक बंधक नहीं।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "No stay orders in Revenue Court Management System.", detailHi: "राजस्व न्यायालय में कोई स्थगन आदेश नहीं।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: "Conforms to Agricultural Green Belt.", detailHi: "कृषि ग्रीन बेल्ट के अनुरूप।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Lagaan cleared for current Samvat year.", detailHi: "चालू संवत वर्ष तक लगान चुकता।", department: "Revenue" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "pass", detail: "Border coordinates match neighboring ETS survey pins.", detailHi: "सीमा निर्देशांक पड़ोसी सर्वेक्षण से मेल खाते हैं।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Outside Dravyavati river setback buffer.", detailHi: "द्रव्यवती नदी बफर से बाहर।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "GIS calculated area matches RoR within 0.2%.", detailHi: "जीआईएस क्षेत्रफल जमाबंदी से 0.2% के भीतर मेल खाता है।", department: "Survey" },
    ],
    owners: [
      {
        name: "Ram Charan Sharma",
        hindiName: "राम चरण शर्मा",
        fatherName: "Kalyan Sahay",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-8921",
        phoneMasked: "+91 98290-XXXXX",
        mutationNumber: "M-2016-891",
        mutationDate: "2016-04-12",
        tenureType: "Khatedari (Agricultural)",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2022-09412",
      regDate: "2022-08-14",
      sro: "Sub-Registrar Sanganer II",
      sellerName: "Ram Charan Sharma",
      buyerName: "Vikramaditya Meena",
      declaredValue: 8500000,
      circleRateValue: 10621800,
      stampDutyPaid: 637308,
      registrationFee: 106218,
      deedType: "Sale Deed (Vikray Patra)",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "AG-1",
      zoneType: "Agricultural",
      maxFloors: 1,
      maxFAR: 0.1,
      buildingPermitNo: null,
      permitStatus: "None",
      permitDate: null,
    },
    tax: {
      taxId: "TAX-SNG-001001",
      assessmentYear: "2024-25",
      annualDemand: 180,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-03-28",
      receiptNo: "REC-REV-2024-883",
    },
    utilities: {
      electricityId: "JVVNL-AGR-40192",
      electricityConsumer: "Ram Charan Sharma",
      waterId: "PHED-TUB-102",
      waterConsumer: "Ram Charan Sharma",
      status: "Active",
    },
    historyTimeline: [
      { date: "2016-04-12", department: "Revenue", event: "Ancestral inheritance mutation sanctioned to Ram Charan Sharma", eventHi: "पैतृक विरासत नामांतरण स्वीकृत", actor: "Tehsildar Sanganer", docRef: "Jamabandi 2073 Samvat" },
      { date: "2022-08-14", department: "Registration", event: "Sale deed executed in favor of Vikramaditya Meena (Pending RoR mutation)", eventHi: "विक्रमादित्य मीणा के पक्ष में विक्रय पत्र पंजीकृत (नामांतरण लंबित)", actor: "Sub-Registrar Sanganer II", docRef: "Deed RJ-SRO-2022-09412" },
      { date: "2024-03-28", department: "Revenue", event: "Annual Lagaan revenue tax paid", eventHi: "वार्षिक लगान राजस्व कर जमा", actor: "Citizen Portal", docRef: "REC-REV-2024-883" },
    ],
  },

  // --- INCONSISTENCY 2: Commercial Building Permit on Agricultural-Zoned Parcel ---
  {
    ulpin: "RJ08040001002A",
    khasraNo: "142/2",
    surveyNo: "SNG-RUR-143",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 3200,
    areaOriginal: "1 Bigha 5 Biswa",
    areaRoRSqM: 3200,
    landUse: "Commercial",
    coordinates: makePolygon(1, 0),
    centroid: [BASE_LAT + 0.0014, BASE_LNG + 0.0017 + 0.0035],
    elevationMeters: 391,
    disputeRiskScore: 84,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: 18,
    circleRatePerSqM: 8500,
    inconsistencies: ["Commercial warehouse building permit issued without CLU (Change of Land Use) from Agriculture"],
    riskFactors: [
      {
        factor: "Unauthorized Master Plan Violation",
        score: 50,
        explanation: "Building permission granted by Gram Panchayat for G+2 Commercial Godown, whereas Master Plan 2025 reserves this parcel for Primary Agricultural use.",
        severity: "critical",
        department: "Town Planning / Local Body",
      },
      {
        factor: "Missing 90-A Conversion",
        score: 34,
        explanation: "No Section 90-A Rajasthan Land Revenue Act conversion certificate found on record.",
        severity: "critical",
        department: "Revenue",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "RoR matches registered owner.", detailHi: "जमाबंदी पंजीकृत स्वामी से मेल खाती है।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "Clean title.", detailHi: "शीर्षक स्पष्ट है।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "No litigation flag.", detailHi: "कोई मुकदमा नहीं।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "fail", detail: "Commercial building permit violates Agricultural Master Plan zoning.", detailHi: "वाणिज्यिक भवन अनुमति कृषि ज़ोनिंग का उल्लंघन करती है।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Up to date.", detailHi: "अद्यतन।", department: "Municipal" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "pass", detail: "Boundary pinned.", detailHi: "सीमा तय।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Safe zone.", detailHi: "सुरक्षित क्षेत्र।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "Matched.", detailHi: "सटीक।", department: "Survey" },
    ],
    owners: [
      {
        name: "Shyam Sundar Agarwal",
        hindiName: "श्याम सुंदर अग्रवाल",
        fatherName: "Brij Mohan Agarwal",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-4109",
        phoneMasked: "+91 94140-XXXXX",
        mutationNumber: "M-2018-301",
        mutationDate: "2018-11-20",
        tenureType: "Khatedari (Agricultural)",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2018-05114",
      regDate: "2018-10-05",
      sro: "Sub-Registrar Sanganer II",
      sellerName: "Hanuman Prasad",
      buyerName: "Shyam Sundar Agarwal",
      declaredValue: 12000000,
      circleRateValue: 13600000,
      stampDutyPaid: 816000,
      registrationFee: 136000,
      deedType: "Sale Deed",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "AG-1 (Rural)",
      zoneType: "Agricultural",
      maxFloors: 1,
      maxFAR: 0.1,
      buildingPermitNo: "GP-BP-2023-881",
      permitStatus: "Unauthorized",
      permitDate: "2023-05-18",
    },
    tax: {
      taxId: "TAX-SNG-001002",
      assessmentYear: "2024-25",
      annualDemand: 450,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-04-02",
      receiptNo: "REC-REV-2024-991",
    },
    utilities: {
      electricityId: "JVVNL-COM-91823",
      electricityConsumer: "Shyam Sundar Agarwal",
      waterId: "PHED-SNG-2019",
      waterConsumer: "Shyam Sundar Agarwal",
      status: "Active",
    },
    historyTimeline: [
      { date: "2018-10-05", department: "Registration", event: "Registered sale deed executed", eventHi: "पंजीकृत विक्रय पत्र निष्पादित", actor: "Sub-Registrar Sanganer II" },
      { date: "2018-11-20", department: "Revenue", event: "Mutation sanctioned in Jamabandi", eventHi: "जमाबंदी में नामांतरण स्वीकृत", actor: "Patwari Halka" },
      { date: "2023-05-18", department: "Town Planning", event: "Commercial warehouse permit illegally issued without Section 90-A conversion", eventHi: "धारा 90-ए रूपांतरण के बिना वाणिज्यिक गोदाम अनुमति जारी", actor: "Gram Panchayat Secretary" },
    ],
  },

  // --- INCONSISTENCY 3: Active Bank Mortgage Missing in Sub-Registrar Encumbrance Certificate (Hidden Lien) ---
  {
    ulpin: "RJ08040001003A",
    khasraNo: "143/1",
    surveyNo: "SNG-RUR-144",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 1800,
    areaOriginal: "0 Bigha 14 Biswa",
    areaRoRSqM: 1800,
    landUse: "Residential",
    coordinates: makePolygon(2, 0),
    centroid: [BASE_LAT + 0.0014, BASE_LNG + 0.0017 + 0.0070],
    elevationMeters: 390,
    disputeRiskScore: 72,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: 12,
    circleRatePerSqM: 11000,
    inconsistencies: ["Bank equitable mortgage registered on CERSAI but omitted from Sub-Registrar Encumbrance Certificate (Form 15)"],
    riskFactors: [
      {
        factor: "Undisclosed CERSAI Bank Lien",
        score: 48,
        explanation: "State Bank of India holds Rs 45,00,000 equitable mortgage against title deeds, not recorded in Sub-Registrar Book-1 register.",
        severity: "critical",
        department: "Banking / CERSAI",
      },
      {
        factor: "Risk of Double Financing / Fraudulent Sale",
        score: 24,
        explanation: "Prospective purchaser requesting an Encumbrance Certificate from SRO would receive a false 'Nil Encumbrance' certificate.",
        severity: "warning",
        department: "Registration",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "Matches owner.", detailHi: "स्वामी से मेल।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "fail", detail: "Unrecorded bank mortgage with SBI (₹45 Lakhs) flagged via CERSAI API.", detailHi: "सीईआरएसएआई के माध्यम से एसबीआई बंधक (₹45 लाख) अघोषित पाया गया।", department: "Banking" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "Clear.", detailHi: "स्पष्ट।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: "Residential compliant.", detailHi: "आवासीय अनुरूप।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Paid.", detailHi: "चुकता।", department: "Municipal" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "pass", detail: "Undisputed.", detailHi: "निर्विरोध।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Outside buffer.", detailHi: "बफर से बाहर।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "Exact.", detailHi: "सटीक।", department: "Survey" },
    ],
    owners: [
      {
        name: "Mukesh Chand Choudhary",
        hindiName: "मुकेश चंद चौधरी",
        fatherName: "Gopal Choudhary",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-9934",
        phoneMasked: "+91 97850-XXXXX",
        mutationNumber: "M-2020-119",
        mutationDate: "2020-02-17",
        tenureType: "Freehold Residential",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2020-01124",
      regDate: "2020-01-10",
      sro: "Sub-Registrar Sanganer II",
      sellerName: "Kishore Kumar",
      buyerName: "Mukesh Chand Choudhary",
      declaredValue: 9800000,
      circleRateValue: 9800000,
      stampDutyPaid: 588000,
      registrationFee: 98000,
      deedType: "Sale Deed",
    },
    encumbrances: [
      {
        id: "ENC-SBI-2021-081",
        bankName: "State Bank of India (Sanganer Branch)",
        loanAmount: 4500000,
        mortgageType: "Equitable Mortgage by Deposit of Title Deeds",
        cersaiRegNumber: "CERSAI-2021-49102847",
        status: "Undisclosed",
        registeredInSro: false,
        date: "2021-09-14",
      },
    ],
    zoning: {
      masterPlanCode: "R-2",
      zoneType: "Residential",
      maxFloors: 3,
      maxFAR: 1.5,
      buildingPermitNo: "JDA-BP-2021-441",
      permitStatus: "Approved",
      permitDate: "2021-11-04",
    },
    tax: {
      taxId: "TAX-SNG-001003",
      assessmentYear: "2024-25",
      annualDemand: 1250,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-02-15",
      receiptNo: "REC-MUN-2024-102",
    },
    utilities: {
      electricityId: "JVVNL-DOM-10928",
      electricityConsumer: "Mukesh Chand Choudhary",
      waterId: "PHED-SNG-3312",
      waterConsumer: "Mukesh Chand Choudhary",
      status: "Active",
    },
    historyTimeline: [
      { date: "2020-01-10", department: "Registration", event: "Sale deed registered at SRO Sanganer II", eventHi: "उप-पंजीयक कार्यालय में विक्रय पत्र पंजीकृत", actor: "Sub-Registrar" },
      { date: "2021-09-14", department: "Banking", event: "Equitable Mortgage created by SBI; CERSAI entry filed (SRO notice omitted)", eventHi: "एसबीआई द्वारा बंधक दर्ज; सीईआरएसएआई प्रविष्टि दर्ज (उप-पंजीयक सूचना छूटी)", actor: "SBI Sanganer" },
    ],
  },

  // --- INCONSISTENCY 4: Overlapping Cadastral Boundaries with Neighbor Parcel ---
  {
    ulpin: "RJ08040001004A",
    khasraNo: "144/1",
    surveyNo: "SNG-RUR-145",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 2100,
    areaOriginal: "0 Bigha 16 Biswa",
    areaRoRSqM: 2100,
    landUse: "Residential",
    // Intentionally overlapping slightly with polygon (3,0)
    coordinates: makePolygon(3, 0, 0.0004, 0),
    centroid: [BASE_LAT + 0.0014, BASE_LNG + 0.0017 + 0.0105],
    elevationMeters: 389,
    disputeRiskScore: 91,
    floodZoneIntersect: false,
    encroachmentFlag: true,
    roadWidthMeters: 9,
    circleRatePerSqM: 9500,
    inconsistencies: ["Cadastral boundary overlaps 124 sq meters with adjacent parcel RJ08040001005A"],
    riskFactors: [
      {
        factor: "Spatial Cadastral Collision",
        score: 55,
        explanation: "Turf.js boundary validation detected an illegal 124 sq m polygon intersection with Khasra 144/2.",
        severity: "critical",
        department: "Survey / Settlement",
      },
      {
        factor: "Boundary Dispute on Ground",
        score: 36,
        explanation: "Physical boundary wall alignment contested; ongoing Demarcation (Seemagyan) appeal pending.",
        severity: "critical",
        department: "Revenue (Tehsildar)",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "Owner matches.", detailHi: "स्वामी मेल खाता है।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "Clean.", detailHi: "स्पष्ट।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "warn", detail: "Pending Seemagyan demarcation dispute at SDM court.", detailHi: "एसडीएम न्यायालय में सीमाज्ञान सीमा विवाद विचाराधीन।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: "Residential.", detailHi: "आवासीय।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Paid.", detailHi: "चुकता।", department: "Municipal" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "fail", detail: "Overlap detected with parcel RJ08040001005A (124 m² overlap).", detailHi: "पार्सल RJ08040001005A के साथ 124 वर्गमीटर अतिक्रमण अतिव्यापन।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Clean.", detailHi: "सुरक्षित।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "warn", detail: "Overlapping area causes double-counting in village total.", detailHi: "अतिव्यापी क्षेत्रफल से ग्राम योग में दोहरापन।", department: "Survey" },
    ],
    owners: [
      {
        name: "Devendra Singh Rathore",
        hindiName: "देवेन्द्र सिंह राठौड़",
        fatherName: "Bhairon Singh",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-1120",
        phoneMasked: "+91 99820-XXXXX",
        mutationNumber: "M-2015-408",
        mutationDate: "2015-06-11",
        tenureType: "Khatedari Converted",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2015-08129",
      regDate: "2015-05-18",
      sro: "Sub-Registrar Sanganer I",
      sellerName: "Govind Ram",
      buyerName: "Devendra Singh Rathore",
      declaredValue: 6500000,
      circleRateValue: 7100000,
      stampDutyPaid: 426000,
      registrationFee: 71000,
      deedType: "Sale Deed",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "R-1",
      zoneType: "Residential",
      maxFloors: 2,
      maxFAR: 1.2,
      buildingPermitNo: "JDA-BP-2016-12",
      permitStatus: "Approved",
      permitDate: "2016-01-14",
    },
    tax: {
      taxId: "TAX-SNG-001004",
      assessmentYear: "2024-25",
      annualDemand: 1600,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-03-01",
      receiptNo: "REC-MUN-2024-441",
    },
    utilities: {
      electricityId: "JVVNL-DOM-55120",
      electricityConsumer: "Devendra Singh Rathore",
      waterId: "PHED-SNG-6712",
      waterConsumer: "Devendra Singh Rathore",
      status: "Active",
    },
    historyTimeline: [
      { date: "2015-05-18", department: "Registration", event: "Sale deed registered", eventHi: "विक्रय पत्र पंजीकृत", actor: "Sub-Registrar Sanganer I" },
      { date: "2023-11-09", department: "Survey", event: "ETS resurvey flagged 124 sq m overlap with adjacent Khasra 144/2", eventHi: "ईटीएस पुनर्सर्वेक्षण में खसरा 144/2 के साथ 124 वर्गमीटर ओवरलैप चिन्हित", actor: "Settlement Officer Jaipur" },
    ],
  },

  // --- INCONSISTENCY 5: Property Tax Unpaid for 3 Consecutive Years ---
  {
    ulpin: "RJ08040001005A",
    khasraNo: "144/2",
    surveyNo: "SNG-RUR-146",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 1950,
    areaOriginal: "0 Bigha 15 Biswa",
    areaRoRSqM: 1950,
    landUse: "Commercial",
    coordinates: makePolygon(3, 1),
    centroid: [BASE_LAT + 0.0014 + 0.0028, BASE_LNG + 0.0017 + 0.0105],
    elevationMeters: 388,
    disputeRiskScore: 64,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: 12,
    circleRatePerSqM: 14000,
    inconsistencies: ["Property tax unpaid for 3 consecutive financial years (2021-22, 2022-23, 2023-24) totaling ₹78,400"],
    riskFactors: [
      {
        factor: "Long-standing Municipal Tax Default",
        score: 40,
        explanation: "Municipal Corporation Jaipur Greater has issued a statutory demand notice under Section 130 Rajasthan Municipalities Act.",
        severity: "warning",
        department: "Municipal Corporation",
      },
      {
        factor: "Municipal Attachment Risk",
        score: 24,
        explanation: "Risk of property attachment warrant if dues are not settled before next financial close.",
        severity: "warning",
        department: "Municipal Corporation",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "Owner matches.", detailHi: "स्वामी मेल खाता है।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "Clean.", detailHi: "स्पष्ट।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "No dispute.", detailHi: "कोई विवाद नहीं।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: "Conforms.", detailHi: "अनुरूप।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "fail", detail: "Tax unpaid for 3+ years. Arrears: ₹78,400 + interest penalty.", detailHi: "3+ वर्षों से कर बकाया। कुल देनदारी: ₹78,400 + ब्याज दंड।", department: "Municipal" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "warn", detail: "Neighboring boundary claim pending resolution.", detailHi: "पड़ोसी सीमा दावा समाधान लंबित।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Clear.", detailHi: "सुरक्षित।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "Matched.", detailHi: "सटीक।", department: "Survey" },
    ],
    owners: [
      {
        name: "Mahesh Kumar Soni",
        hindiName: "महेश कुमार सोनी",
        fatherName: "Kishori Lal Soni",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-3341",
        phoneMasked: "+91 98292-XXXXX",
        mutationNumber: "M-2017-712",
        mutationDate: "2017-09-02",
        tenureType: "Commercial Freehold",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2017-06214",
      regDate: "2017-08-11",
      sro: "Sub-Registrar Sanganer I",
      sellerName: "Panna Lal Soni",
      buyerName: "Mahesh Kumar Soni",
      declaredValue: 14500000,
      circleRateValue: 15600000,
      stampDutyPaid: 936000,
      registrationFee: 156000,
      deedType: "Gift Deed (Daan Patra)",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "C-2",
      zoneType: "Commercial",
      maxFloors: 4,
      maxFAR: 2.0,
      buildingPermitNo: "JMC-BP-2019-90",
      permitStatus: "Approved",
      permitDate: "2019-03-10",
    },
    tax: {
      taxId: "TAX-JMC-09142",
      assessmentYear: "2024-25",
      annualDemand: 24000,
      totalDue: 78400,
      paymentStatus: "Unpaid 3+ Years",
      lastPaidDate: "2021-02-18",
      receiptNo: null,
    },
    utilities: {
      electricityId: "JVVNL-COM-44102",
      electricityConsumer: "Mahesh Kumar Soni",
      waterId: "PHED-SNG-8812",
      waterConsumer: "Mahesh Kumar Soni",
      status: "Active",
    },
    historyTimeline: [
      { date: "2017-08-11", department: "Registration", event: "Family gift deed executed", eventHi: "पारिवारिक दान पत्र निष्पादित", actor: "Sub-Registrar Sanganer I" },
      { date: "2021-02-18", department: "Municipal", event: "Last property tax payment received (FY 2020-21)", eventHi: "अंतिम संपत्ति कर भुगतान प्राप्त (वित्त वर्ष 2020-21)", actor: "JMC Counter" },
      { date: "2024-01-10", department: "Municipal", event: "Statutory default notice served under Section 130", eventHi: "धारा 130 के अंतर्गत वैधानिक चूक नोटिस तामील", actor: "Revenue Inspector JMC" },
    ],
  },

  // --- INCONSISTENCY 6: Parcel Partly Inside Flood Zone / Eco Buffer ---
  {
    ulpin: "RJ08040001006A",
    khasraNo: "145/1",
    surveyNo: "SNG-RUR-147",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 3800,
    areaOriginal: "1 Bigha 10 Biswa",
    areaRoRSqM: 3800,
    landUse: "Restricted",
    coordinates: makePolygon(4, 0),
    centroid: [BASE_LAT + 0.0014, BASE_LNG + 0.0017 + 0.0140],
    elevationMeters: 382, // lower elevation near riverbed
    disputeRiskScore: 88,
    floodZoneIntersect: true,
    encroachmentFlag: false,
    roadWidthMeters: 6,
    circleRatePerSqM: 3800,
    inconsistencies: ["Parcel intersects with the 100-year High Flood Level (HFL) setback of Dravyavati River"],
    riskFactors: [
      {
        factor: "Eco-Sensitive Watercourse Setback Violation",
        score: 52,
        explanation: "National Green Tribunal (NGT) order mandates a 30m no-construction green buffer on river banks; 42% of parcel area falls inside this buffer.",
        severity: "critical",
        department: "Disaster Mgmt / NGT",
      },
      {
        factor: "Building Ban In Force",
        score: 36,
        explanation: "Any residential construction permission on this plot is legally void ab initio under Rajasthan High Court PIL directions.",
        severity: "critical",
        department: "Town Planning",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "Clean owner title.", detailHi: "स्पष्ट स्वामित्व।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "No encumbrance.", detailHi: "कोई भार नहीं।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "No title suit.", detailHi: "कोई मुकदमा नहीं।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "warn", detail: "Zoned as Eco-Sensitive Riverfront buffer.", detailHi: "पर्यावरण-संवेदनशील रिवरफ्रंट बफर के रूप में चिह्नित।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Paid.", detailHi: "चुकता।", department: "Revenue" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "pass", detail: "Undisputed.", detailHi: "निर्विरोध।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "fail", detail: "Intersecting 100-year HFL zone. Construction strictly prohibited.", detailHi: "100-वर्षीय एचएफएल बाढ़ क्षेत्र से ग्रसित। निर्माण पूर्णतः प्रतिबंधित।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "Area verified.", detailHi: "क्षेत्रफल सत्यापित।", department: "Survey" },
    ],
    owners: [
      {
        name: "Gajendra Singh Shekhawat",
        hindiName: "गजेन्द्र सिंह शेखावत",
        fatherName: "Bhanwar Singh",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-7781",
        phoneMasked: "+91 94142-XXXXX",
        mutationNumber: "M-2012-094",
        mutationDate: "2012-04-18",
        tenureType: "Khatedari Agricultural",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2012-02194",
      regDate: "2012-03-29",
      sro: "Sub-Registrar Sanganer I",
      sellerName: "Prabhu Dayal",
      buyerName: "Gajendra Singh Shekhawat",
      declaredValue: 5100000,
      circleRateValue: 5100000,
      stampDutyPaid: 306000,
      registrationFee: 51000,
      deedType: "Sale Deed",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "ECO-1",
      zoneType: "Eco-Sensitive / Flood Buffer",
      maxFloors: 0,
      maxFAR: 0.0,
      buildingPermitNo: null,
      permitStatus: "None",
      permitDate: null,
    },
    tax: {
      taxId: "TAX-SNG-001006",
      assessmentYear: "2024-25",
      annualDemand: 220,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-03-12",
      receiptNo: "REC-REV-2024-331",
    },
    utilities: {
      electricityId: "JVVNL-AGR-10029",
      electricityConsumer: "Gajendra Singh Shekhawat",
      waterId: "PHED-SNG-0012",
      waterConsumer: "Gajendra Singh Shekhawat",
      status: "Active",
    },
    historyTimeline: [
      { date: "2012-03-29", department: "Registration", event: "Sale deed registered", eventHi: "विक्रय पत्र पंजीकृत", actor: "Sub-Registrar Sanganer I" },
      { date: "2019-08-20", department: "Disaster Mgmt", event: "Dravyavati River flood mitigation GIS mapping designated 30m buffer boundary", eventHi: "द्रव्यवती नदी बाढ़ नियंत्रण जीआईएस मानचित्रण में 30 मी बफर सीमा तय", actor: "Irrigation & Disaster Dept" },
    ],
  },

  // --- INCONSISTENCY 7: Area Mismatch between RoR Jamabandi & Cadastral Map > 5% ---
  {
    ulpin: "RJ08040001007A",
    khasraNo: "145/2",
    surveyNo: "SNG-RUR-148",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 2600, // Digitized GIS area
    areaOriginal: "1 Bigha 5 Biswa",
    areaRoRSqM: 3162, // Jamabandi records 3,162 sq m -> 17.8% discrepancy
    landUse: "Agricultural",
    coordinates: makePolygon(4, 1),
    centroid: [BASE_LAT + 0.0014 + 0.0028, BASE_LNG + 0.0017 + 0.0140],
    elevationMeters: 393,
    disputeRiskScore: 75,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: 8,
    circleRatePerSqM: 4500,
    inconsistencies: ["Severe area discrepancy: RoR Jamabandi records 3,162 m² while GIS cadastral vector polygon measures only 2,600 m² (17.8% deficit)"],
    riskFactors: [
      {
        factor: "Paper-to-Ground Area Deficit (>5%)",
        score: 45,
        explanation: "562 sq meters of land recorded in paper jamabandi does not exist within the digitized boundary polygon.",
        severity: "critical",
        department: "Revenue / Survey",
      },
      {
        factor: "Potential Encroachment or Measurement Error",
        score: 30,
        explanation: "Discrepancy exceeds permissible 2% survey tolerance; resurvey required before registry transactions.",
        severity: "warning",
        department: "Survey",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "Matches.", detailHi: "मेल।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "Clean.", detailHi: "स्पष्ट।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "None.", detailHi: "कोई नहीं।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: "Agricultural.", detailHi: "कृषि।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Paid.", detailHi: "चुकता।", department: "Revenue" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "warn", detail: "Boundary dimensions suspect due to area shortfall.", detailHi: "क्षेत्रफल कमी के कारण सीमा माप संदेहास्पद।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Outside buffer.", detailHi: "बफर से बाहर।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "fail", detail: "GIS polygon is 17.8% smaller than RoR paper record (2,600 m² vs 3,162 m²).", detailHi: "जीआईएस बहुभुज जमाबंदी से 17.8% छोटा है (2,600 मी² बनाम 3,162 मी²)।", department: "Survey" },
    ],
    owners: [
      {
        name: "Bhagwan Sahay Gurjar",
        hindiName: "भगवान सहाय गुर्जर",
        fatherName: "Ramswaroop Gurjar",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-6519",
        phoneMasked: "+91 94133-XXXXX",
        mutationNumber: "M-2014-220",
        mutationDate: "2014-07-21",
        tenureType: "Khatedari Agricultural",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2014-03112",
      regDate: "2014-06-30",
      sro: "Sub-Registrar Sanganer I",
      sellerName: "Suraj Mal Gurjar",
      buyerName: "Bhagwan Sahay Gurjar",
      declaredValue: 4500000,
      circleRateValue: 4800000,
      stampDutyPaid: 288000,
      registrationFee: 48000,
      deedType: "Sale Deed",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "AG-1",
      zoneType: "Agricultural",
      maxFloors: 1,
      maxFAR: 0.1,
      buildingPermitNo: null,
      permitStatus: "None",
      permitDate: null,
    },
    tax: {
      taxId: "TAX-SNG-001007",
      assessmentYear: "2024-25",
      annualDemand: 190,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-03-10",
      receiptNo: "REC-REV-2024-912",
    },
    utilities: {
      electricityId: "JVVNL-AGR-88129",
      electricityConsumer: "Bhagwan Sahay Gurjar",
      waterId: "PHED-SNG-4122",
      waterConsumer: "Bhagwan Sahay Gurjar",
      status: "Active",
    },
    historyTimeline: [
      { date: "2014-06-30", department: "Registration", event: "Sale deed registered for 1 Bigha 5 Biswa", eventHi: "1 बीघा 5 बिस्वा का विक्रय पत्र पंजीकृत", actor: "Sub-Registrar Sanganer I" },
      { date: "2023-12-05", department: "Survey", event: "Drone cadastral mapping calculated actual polygon area as 2,600 m² (17.8% shortfall)", eventHi: "ड्रोन भू-मानचित्रण में वास्तविक क्षेत्रफल 2,600 वर्गमी निकला (17.8% कमी)", actor: "Survey of India / DLRS" },
    ],
  },

  // --- INCONSISTENCY 8: Active Civil Court Stay Order / Injunction on Title ---
  {
    ulpin: "RJ08040001008A",
    khasraNo: "146/1",
    surveyNo: "SNG-RUR-149",
    village: "Sanganer (Rural)",
    villageHi: "सांगानेर (ग्रामीण)",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: 2000,
    areaOriginal: "0 Bigha 16 Biswa",
    areaRoRSqM: 2000,
    landUse: "Residential",
    coordinates: makePolygon(0, 1),
    centroid: [BASE_LAT + 0.0014 + 0.0028, BASE_LNG + 0.0017],
    elevationMeters: 394,
    disputeRiskScore: 89,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: 12,
    circleRatePerSqM: 10500,
    inconsistencies: ["Active interim stay injunction from Civil Court (Junior Division) restraining alienations and construction"],
    riskFactors: [
      {
        factor: "Civil Court Interim Injunction",
        score: 55,
        explanation: "Civil Suit No. 248/2023 filed by coparcener alleging ancestral coparcenary rights; Court granted status-quo order.",
        severity: "critical",
        department: "Judiciary / Revenue Court",
      },
      {
        factor: "Prohibition on Registry Transactions",
        score: 34,
        explanation: "Sub-Registrar flagged parcel against registerable deeds under Section 22-A Registration Act.",
        severity: "critical",
        department: "Registration",
      },
    ],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "warn", detail: "Title contested by co-heirs in partition suit.", detailHi: "बंटवारे के मुकदमे में सह-वारिसों द्वारा स्वामित्व विवादित।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "Clean.", detailHi: "स्पष्ट।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "fail", detail: "Active status-quo stay injunction ordered by Civil Judge (JD) Sanganer.", detailHi: "सिविल जज (क.ख.) सांगानेर द्वारा यथास्थिति का स्थगन आदेश प्रभावी।", department: "Judiciary" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: "Residential.", detailHi: "आवासीय।", department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Paid.", detailHi: "चुकता।", department: "Municipal" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "pass", detail: "Boundary marked.", detailHi: "सीमा चिन्हित।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Clear.", detailHi: "सुरक्षित।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "Exact.", detailHi: "सटीक।", department: "Survey" },
    ],
    owners: [
      {
        name: "Rajendra Prasad Saini",
        hindiName: "राजेन्द्र प्रसाद सैनी",
        fatherName: "Bodu Ram Saini",
        sharePct: 100,
        aadharMasked: "XXXX-XXXX-5520",
        phoneMasked: "+91 94145-XXXXX",
        mutationNumber: "M-2019-142",
        mutationDate: "2019-05-14",
        tenureType: "Khatedari Residential",
      },
    ],
    latestDeed: {
      deedNo: "RJ-SRO-2019-04190",
      regDate: "2019-04-20",
      sro: "Sub-Registrar Sanganer II",
      sellerName: "Chhagan Lal Saini",
      buyerName: "Rajendra Prasad Saini",
      declaredValue: 8000000,
      circleRateValue: 8400000,
      stampDutyPaid: 504000,
      registrationFee: 84000,
      deedType: "Release Deed (Haq-Tyag)",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: "R-1",
      zoneType: "Residential",
      maxFloors: 3,
      maxFAR: 1.33,
      buildingPermitNo: null,
      permitStatus: "None",
      permitDate: null,
    },
    tax: {
      taxId: "TAX-SNG-001008",
      assessmentYear: "2024-25",
      annualDemand: 1100,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-02-11",
      receiptNo: "REC-MUN-2024-551",
    },
    utilities: {
      electricityId: "JVVNL-DOM-39912",
      electricityConsumer: "Rajendra Prasad Saini",
      waterId: "PHED-SNG-1920",
      waterConsumer: "Rajendra Prasad Saini",
      status: "Active",
    },
    historyTimeline: [
      { date: "2019-04-20", department: "Registration", event: "Release deed executed by family member", eventHi: "परिवार सदस्य द्वारा हक-त्याग पत्र निष्पादित", actor: "Sub-Registrar Sanganer II" },
      { date: "2023-09-18", department: "Revenue", event: "Civil Suit No. 248/2023 instituted by nephew claiming unpartitioned Hindu Undivided Family right", eventHi: "अविभाजित हिंदू परिवार अधिकार का दावा करते हुए दीवानी वाद संख्या 248/2023 दायर", actor: "Civil Court Sanganer" },
      { date: "2023-10-04", department: "Revenue", event: "Interim Status Quo Injunction issued; entry endorsed in Jamabandi remarks column", eventHi: "अंतरिम यथास्थिति स्थगन आदेश जारी; जमाबंदी कैफियत में दर्ज", actor: "Civil Judge" },
    ],
  },
];

// Generate the remaining 32 parcels procedurally with realistic variation across 5 land-use types
const names = [
  ["Suresh Kumar Verma", "सुरेश कुमार वर्मा", "Kailash Chand"],
  ["Anita Devi Sharma", "अनीता देवी शर्मा", "Gopal Sharma"],
  ["Narendra Singh Tanwar", "नरेंद्र सिंह तंवर", "Bhawani Singh"],
  ["Mohammad Imran Khan", "मोहम्मद इमरान खान", "Abdul Razzaq"],
  ["Pooja Kumari Jain", "पूजा कुमारी जैन", "Mahaveer Prasad Jain"],
  ["Dharmendra Yadav", "धर्मेन्द्र यादव", "Hira Lal Yadav"],
  ["Sunita Rawat", "सुनीता रावत", "Balbir Singh Rawat"],
  ["Kailash Narayan Meena", "कैलाश नारायण मीणा", "Kanaram Meena"],
  ["Rameshwar Lal Jat", "रामेश्वर लाल जाट", "Bodu Ram Jat"],
  ["Priyanka Mathur", "प्रियंका माथुर", "Anand Swaroop Mathur"],
  ["Hemant Khandelwal", "हेमंत खंडेलवाल", "Dinesh Chand Khandelwal"],
  ["Geeta Bai Saini", "गीता बाई सैनी", "Kishore Kumar Saini"],
  ["Arun Kumar Joshi", "अरुण कुमार जोशी", "Brahma Nand Joshi"],
  ["Seema Pareek", "सीमा पारीक", "Om Prakash Pareek"],
  ["Vishnu Sharma", "विष्णु शर्मा", "Laxmi Narayan Sharma"],
  ["Manish Goyal", "मनीष गोयल", "Subhash Goyal"],
];

const landUseTypes: ("Agricultural" | "Residential" | "Commercial" | "Restricted" | "Industrial")[] = [
  "Residential",
  "Residential",
  "Commercial",
  "Agricultural",
  "Industrial",
  "Residential",
  "Agricultural",
  "Commercial",
];

for (let i = 9; i <= 40; i++) {
  const pad = i.toString().padStart(3, "0");
  const col = (i - 1) % 6;
  const row = Math.floor((i - 1) / 6);
  const nameData = names[(i - 1) % names.length];
  const landUse = landUseTypes[(i - 1) % landUseTypes.length];
  const isUrban = i > 20;
  const area = isUrban ? 250 + (i * 25) % 600 : 1500 + (i * 70) % 2500;
  const circleRate = isUrban ? 18000 + (i * 500) % 15000 : 3500 + (i * 300) % 4000;
  const roadWidth = isUrban ? 12 : (i % 2 === 0 ? 9 : 6);
  
  // Healthy parcel score: 0 to 18
  const riskScore = (i * 7) % 19;

  PARCELS_DATA.push({
    ulpin: `RJ08040001${pad}A`,
    khasraNo: isUrban ? `Ward 14 / Plot ${i + 10}` : `14${Math.floor(i / 2)}/${(i % 3) + 1}`,
    surveyNo: isUrban ? `JMC-URB-${i + 200}` : `SNG-RUR-${i + 140}`,
    village: isUrban ? "Jaipur Ward 14 (Mansarovar Ext)" : "Sanganer (Rural)",
    villageHi: isUrban ? "जयपुर वार्ड 14 (मानसरोवर विस्तार)" : "सांगानेर (ग्रामीण)",
    tehsil: isUrban ? "Jaipur Metropolitan" : "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    areaSqM: area,
    areaOriginal: isUrban ? `${Math.round(area * 1.196)} Sq Yards` : `${Math.floor(area / 2529)} Bigha ${Math.round((area % 2529) / 126)} Biswa`,
    areaRoRSqM: area,
    landUse: landUse,
    coordinates: makePolygon(col, row),
    centroid: [BASE_LAT + row * 0.0028 + 0.0014, BASE_LNG + col * 0.0035 + 0.0017],
    elevationMeters: 390 + (i % 7),
    disputeRiskScore: riskScore,
    floodZoneIntersect: false,
    encroachmentFlag: false,
    roadWidthMeters: roadWidth,
    circleRatePerSqM: circleRate,
    inconsistencies: [],
    riskFactors: riskScore > 10 ? [
      {
        factor: "Low Risk Registry Age",
        score: riskScore,
        explanation: "Property has undergone regular mutation and title succession without disputes.",
        severity: "advisory",
        department: "Registration",
      }
    ] : [],
    healthChecks: [
      { id: "c1", title: "Ownership Consistency", titleHi: "स्वामित्व सुसंगतता", status: "pass", detail: "RoR matches registered deed.", detailHi: "जमाबंदी पंजीकृत विक्रय पत्र से मेल खाती है।", department: "Revenue" },
      { id: "c2", title: "Mortgage / Lien Status", titleHi: "बंधक / ग्रहणाधिकार", status: "pass", detail: "No encumbrance reported.", detailHi: "कोई बंधक नहीं।", department: "Registration" },
      { id: "c3", title: "Court Dispute Injunction", titleHi: "न्यायालय विवाद", status: "pass", detail: "Clean title record in revenue judicial court.", detailHi: "राजस्व न्यायालय में निष्कलंक रिकॉर्ड।", department: "Revenue Court" },
      { id: "c4", title: "Zoning & Use Conformance", titleHi: "ज़ोनिंग अनुरूपता", status: "pass", detail: `Complies with Master Plan ${landUse} zone.`, detailHi: `मास्टर प्लान ${landUse} ज़ोन के पूर्णतः अनुकूल।`, department: "Town Planning" },
      { id: "c5", title: "Property / Land Tax Status", titleHi: "भू-राजस्व कर स्थिति", status: "pass", detail: "Property tax dues fully settled.", detailHi: "संपत्ति कर पूर्णतः चुकता।", department: "Municipal" },
      { id: "c6", title: "Cadastral Boundary Undisputed", titleHi: "सीमा निर्विवाद", status: "pass", detail: "Survey coordinates verified on ground ETS pins.", detailHi: "सर्वेक्षण निर्देशांक ईटीएस पिन से सत्यापित।", department: "Survey" },
      { id: "c7", title: "Hazard & Restriction Zone", titleHi: "बाढ़ / निषिद्ध क्षेत्र", status: "pass", detail: "Outside all river buffers and reserved zones.", detailHi: "नदी बफर और आरक्षित क्षेत्रों से बाहर।", department: "Disaster Mgmt" },
      { id: "c8", title: "Area Measurement Fidelity", titleHi: "क्षेत्रफल सटीकता", status: "pass", detail: "Digitized vector area matches legal title within 0.3%.", detailHi: "डिजिटल क्षेत्रफल विधिक विलेख से 0.3% के भीतर मेल खाता है।", department: "Survey" },
    ],
    owners: [
      {
        name: nameData[0],
        hindiName: nameData[1],
        fatherName: nameData[2],
        sharePct: 100,
        aadharMasked: `XXXX-XXXX-${(2000 + i).toString()}`,
        phoneMasked: `+91 9829${i % 10}-XXXXX`,
        mutationNumber: `M-2021-${100 + i}`,
        mutationDate: `2021-0${(i % 8) + 1}-15`,
        tenureType: isUrban ? "Freehold Residential" : "Khatedari Agricultural",
      },
    ],
    latestDeed: {
      deedNo: `RJ-SRO-2021-${5000 + i}`,
      regDate: `2021-0${(i % 8) + 1}-02`,
      sro: isUrban ? "Sub-Registrar Jaipur VI" : "Sub-Registrar Sanganer I",
      sellerName: "Previous Legal Owner",
      buyerName: nameData[0],
      declaredValue: area * circleRate,
      circleRateValue: area * circleRate,
      stampDutyPaid: Math.round(area * circleRate * 0.06),
      registrationFee: Math.round(area * circleRate * 0.01),
      deedType: "Sale Deed (Vikray Patra)",
    },
    encumbrances: [],
    zoning: {
      masterPlanCode: isUrban ? "R-2 (Urban)" : "AG-1",
      zoneType: landUse === "Industrial" ? "Industrial" : landUse === "Commercial" ? "Commercial" : landUse === "Residential" ? "Residential" : "Agricultural",
      maxFloors: isUrban ? 4 : 2,
      maxFAR: isUrban ? 2.0 : 0.5,
      buildingPermitNo: isUrban ? `JDA-BP-2022-${100 + i}` : null,
      permitStatus: isUrban ? "Approved" : "None",
      permitDate: isUrban ? "2022-03-14" : null,
    },
    tax: {
      taxId: `TAX-${isUrban ? "JMC" : "SNG"}-${pad}`,
      assessmentYear: "2024-25",
      annualDemand: isUrban ? 3200 : 350,
      totalDue: 0,
      paymentStatus: "Paid",
      lastPaidDate: "2024-03-25",
      receiptNo: `REC-TX-${202400 + i}`,
    },
    utilities: {
      electricityId: `JVVNL-${pad}918`,
      electricityConsumer: nameData[0],
      waterId: `PHED-${pad}012`,
      waterConsumer: nameData[0],
      status: "Active",
    },
    historyTimeline: [
      {
        date: `2021-0${(i % 8) + 1}-02`,
        department: "Registration",
        event: `Registered sale deed in favor of ${nameData[0]}`,
        eventHi: `${nameData[1]} के पक्ष में पंजीकृत विक्रय पत्र`,
        actor: isUrban ? "Sub-Registrar Jaipur VI" : "Sub-Registrar Sanganer I",
        docRef: `RJ-SRO-2021-${5000 + i}`,
      },
      {
        date: `2021-0${(i % 8) + 1}-15`,
        department: "Revenue",
        event: "Mutation sanctioned in Jamabandi RoR",
        eventHi: "जमाबंदी में नामांतरण स्वीकृत",
        actor: "Patwari Halka",
        docRef: `M-2021-${100 + i}`,
      },
      {
        date: "2024-03-25",
        department: "Municipal",
        event: "Annual property tax assessment paid online",
        eventHi: "वार्षिक संपत्ति कर का ऑनलाइन भुगतान",
        actor: "e-Mitra Citizen Portal",
        docRef: `REC-TX-${202400 + i}`,
      },
    ],
  });
}
