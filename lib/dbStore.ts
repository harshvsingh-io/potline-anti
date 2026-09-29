import { PARCELS_DATA, ParcelData } from "@/data/parcels";

export type UserRole =
  | "citizen"
  | "sub_registrar"
  | "patwari"
  | "urban_planner"
  | "state_admin";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  actionHi: string;
  parcelUlpin: string;
  department: string;
  details: string;
  ipAddress: string;
  hash: string;
}

export interface ServiceRequest {
  id: string;
  ulpin: string;
  serviceType: "Mutation (Namantaran)" | "Certified Copy (Nakal)" | "Boundary Demarcation" | "Dispute Injunction Flag";
  applicantName: string;
  applicantPhone: string;
  applicantAadhar: string;
  submittedAt: string;
  status: "Pending Verification" | "Under Field Inspection" | "Approved" | "Rejected";
  assignedOfficer: string;
  remarks: string;
  documentName?: string;
}

export interface DominoStep {
  step: number;
  department: string;
  title: string;
  titleHi: string;
  status: "completed" | "in_progress" | "pending";
  timestamp: string | null;
  actor: string;
  details: string;
}

// Initial seed audit logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-1001",
    timestamp: "2026-09-29T10:14:22Z",
    actor: "Patwari R.S. Choudhary",
    role: "patwari",
    action: "FIELD_VERIFICATION_COMPLETE",
    actionHi: "क्षेत्रीय सत्यापन पूर्ण",
    parcelUlpin: "RJ08040001001A",
    department: "Revenue",
    details: "Physical boundary corners verified against ETS survey peg 142/A.",
    ipAddress: "10.42.8.19",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "AUD-1002",
    timestamp: "2026-09-29T11:02:15Z",
    actor: "Sub-Registrar V. Sharma",
    role: "sub_registrar",
    action: "DEED_REGISTRATION_ENDORSED",
    actionHi: "पंजीकृत विलेख पृष्ठांकित",
    parcelUlpin: "RJ08040001003A",
    department: "Registration",
    details: "Sale deed registered; automated webhook triggered to Revenue Portal.",
    ipAddress: "10.42.14.88",
    hash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  },
  {
    id: "AUD-1003",
    timestamp: "2026-09-29T11:45:00Z",
    actor: "Urban Planner M. K. Sen",
    role: "urban_planner",
    action: "ZONING_RESTRICTION_FLAGGED",
    actionHi: "ज़ोनिंग प्रतिबंध ध्वजांकित",
    parcelUlpin: "RJ08040001002A",
    department: "Town Planning",
    details: "Flagged unauthorized commercial warehouse application on agricultural land.",
    ipAddress: "10.42.3.4",
    hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
  },
  {
    id: "AUD-1004",
    timestamp: "2026-09-29T12:10:00Z",
    actor: "State Admin (DLRS HQ)",
    role: "state_admin",
    action: "SYSTEM_CADASTRAL_INGESTION",
    actionHi: "प्रणाली भूकर डेटा अंतर्ग्रहण",
    parcelUlpin: "ALL_PARCELS",
    department: "Survey & Land Records",
    details: "Ingested 40 cadastral polygons for Sanganer & Ward 14 pilot.",
    ipAddress: "10.40.1.1",
    hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
  },
];

const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "SRV-2024-001",
    ulpin: "RJ08040001001A",
    serviceType: "Mutation (Namantaran)",
    applicantName: "Vikramaditya Meena",
    applicantPhone: "+91 98290-44122",
    applicantAadhar: "XXXX-XXXX-8921",
    submittedAt: "2024-08-16T09:30:00Z",
    status: "Pending Verification",
    assignedOfficer: "Patwari Halka Sanganer",
    remarks: "Pending buyer name substitution in Jamabandi register post-sale deed.",
    documentName: "Sale_Deed_09412_Signed.pdf",
  },
  {
    id: "SRV-2024-002",
    ulpin: "RJ08040001004A",
    serviceType: "Boundary Demarcation",
    applicantName: "Devendra Singh Rathore",
    applicantPhone: "+91 99820-11200",
    applicantAadhar: "XXXX-XXXX-1120",
    submittedAt: "2024-09-02T14:15:00Z",
    status: "Under Field Inspection",
    assignedOfficer: "Inspector Land Records (ILR)",
    remarks: "Joint demarcation notice issued to adjacent Khasra 144/2 holder.",
    documentName: "Seemagyan_Application.pdf",
  },
  {
    id: "SRV-2024-003",
    ulpin: "RJ08040001009A",
    serviceType: "Certified Copy (Nakal)",
    applicantName: "Suresh Kumar Verma",
    applicantPhone: "+91 98291-55440",
    applicantAadhar: "XXXX-XXXX-2009",
    submittedAt: "2024-09-20T11:00:00Z",
    status: "Approved",
    assignedOfficer: "Record Room Clerk Sanganer",
    remarks: "Digital digitally-signed Jamabandi Nakal issued with QR verification code.",
    documentName: "Certified_Jamabandi_2024.pdf",
  },
];

class LocalDbStore {
  private parcels: ParcelData[] = [];
  private currentRole: UserRole = "citizen";
  private currentLanguage: "en" | "hi" = "en";
  private auditLogs: AuditLogEntry[] = [];
  private serviceRequests: ServiceRequest[] = [];
  private dominoSteps: DominoStep[] = [
    {
      step: 1,
      department: "Sub-Registrar Office",
      title: "Sale Deed Registered & Stamp Duty Paid",
      titleHi: "विक्रय पत्र पंजीकृत एवं स्टाम्प शुल्क जमा",
      status: "completed",
      timestamp: "2026-09-28 11:30 AM",
      actor: "Sub-Registrar Jaipur VI",
      details: "Deed RJ-SRO-2026-1102 registered. Circle rate verified. Post-registration webhook dispatched.",
    },
    {
      step: 2,
      department: "Revenue Department (Patwari)",
      title: "Automated Mutation (Namantaran) in Jamabandi",
      titleHi: "जमाबंदी में स्वतः नामांतरण",
      status: "in_progress",
      timestamp: null,
      actor: "Patwari Desk",
      details: "Rule-based auto-mutation generated; awaiting 15-day public objection period completion.",
    },
    {
      step: 3,
      department: "Municipal Corporation",
      title: "Property Tax Assessment & Transfer",
      titleHi: "संपत्ति कर निर्धारण एवं हस्तांतरण",
      status: "pending",
      timestamp: null,
      actor: "Municipal Tax Assessor",
      details: "Assess municipal rate, update tax ledger with new owner name, and issue digital assessment receipt.",
    },
    {
      step: 4,
      department: "Discom (JVVNL Electricity)",
      title: "Power Connection Consumer Name Update",
      titleHi: "विद्युत उपभोक्ता नाम परिवर्तन",
      status: "pending",
      timestamp: null,
      actor: "JVVNL Billing Substation",
      details: "Transfer electricity meter account without physical NOC requirement.",
    },
    {
      step: 5,
      department: "Public Health (PHED Water)",
      title: "Piped Water Supply Account Transfer",
      titleHi: "पेयजल आपूर्ति खाता हस्तांतरण",
      status: "pending",
      timestamp: null,
      actor: "PHED Assistant Engineer",
      details: "Automated account transfer completed in water billing database.",
    },
  ];

  constructor() {
    this.init();
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private init() {
    if (!this.isBrowser()) {
      this.parcels = [...PARCELS_DATA];
      this.auditLogs = [...INITIAL_AUDIT_LOGS];
      this.serviceRequests = [...INITIAL_SERVICE_REQUESTS];
      return;
    }

    try {
      const storedRole = localStorage.getItem("plotline_role");
      if (storedRole) this.currentRole = storedRole as UserRole;

      const storedLang = localStorage.getItem("plotline_lang");
      if (storedLang) this.currentLanguage = storedLang as "en" | "hi";

      const storedParcels = localStorage.getItem("plotline_parcels");
      if (storedParcels) {
        this.parcels = JSON.parse(storedParcels);
      } else {
        this.parcels = [...PARCELS_DATA];
        localStorage.setItem("plotline_parcels", JSON.stringify(this.parcels));
      }

      const storedLogs = localStorage.getItem("plotline_audit");
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs);
      } else {
        this.auditLogs = [...INITIAL_AUDIT_LOGS];
        localStorage.setItem("plotline_audit", JSON.stringify(this.auditLogs));
      }

      const storedRequests = localStorage.getItem("plotline_services");
      if (storedRequests) {
        this.serviceRequests = JSON.parse(storedRequests);
      } else {
        this.serviceRequests = [...INITIAL_SERVICE_REQUESTS];
        localStorage.setItem("plotline_services", JSON.stringify(this.serviceRequests));
      }
    } catch {
      this.parcels = [...PARCELS_DATA];
      this.auditLogs = [...INITIAL_AUDIT_LOGS];
      this.serviceRequests = [...INITIAL_SERVICE_REQUESTS];
    }
  }

  public getParcels(): ParcelData[] {
    return this.parcels.length > 0 ? this.parcels : PARCELS_DATA;
  }

  public getParcelByUlpin(ulpin: string): ParcelData | undefined {
    return this.getParcels().find((p) => p.ulpin.toUpperCase() === ulpin.toUpperCase());
  }

  public getRole(): UserRole {
    return this.currentRole;
  }

  public setRole(role: UserRole) {
    this.currentRole = role;
    if (this.isBrowser()) {
      localStorage.setItem("plotline_role", role);
    }
  }

  public getLanguage(): "en" | "hi" {
    return this.currentLanguage;
  }

  public setLanguage(lang: "en" | "hi") {
    this.currentLanguage = lang;
    if (this.isBrowser()) {
      localStorage.setItem("plotline_lang", lang);
    }
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs.length > 0 ? this.auditLogs : INITIAL_AUDIT_LOGS;
  }

  public addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp" | "hash">) {
    const id = `AUD-${Date.now().toString().slice(-5)}`;
    const timestamp = new Date().toISOString();
    const hash = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const fullEntry: AuditLogEntry = {
      ...entry,
      id,
      timestamp,
      hash,
    };

    this.auditLogs.unshift(fullEntry);
    if (this.isBrowser()) {
      localStorage.setItem("plotline_audit", JSON.stringify(this.auditLogs));
    }
    return fullEntry;
  }

  public getServiceRequests(): ServiceRequest[] {
    return this.serviceRequests;
  }

  public createServiceRequest(req: Omit<ServiceRequest, "id" | "submittedAt" | "status" | "assignedOfficer">): ServiceRequest {
    const id = `SRV-2024-${(this.serviceRequests.length + 1).toString().padStart(3, "0")}`;
    const newReq: ServiceRequest = {
      ...req,
      id,
      submittedAt: new Date().toISOString(),
      status: "Pending Verification",
      assignedOfficer: "Patwari Halka Sanganer",
    };
    this.serviceRequests.unshift(newReq);
    if (this.isBrowser()) {
      localStorage.setItem("plotline_services", JSON.stringify(this.serviceRequests));
    }

    this.addAuditLog({
      actor: req.applicantName,
      role: "citizen",
      action: "SERVICE_REQUEST_SUBMITTED",
      actionHi: "सेवा आवेदन प्रस्तुत",
      parcelUlpin: req.ulpin,
      department: "Citizen Portal",
      details: `New ${req.serviceType} request created with tracking ID ${id}.`,
      ipAddress: "127.0.0.1 (Web)",
    });

    return newReq;
  }

  public updateServiceRequestStatus(id: string, status: ServiceRequest["status"], remarks: string) {
    const item = this.serviceRequests.find((r) => r.id === id);
    if (item) {
      item.status = status;
      item.remarks = remarks;
      if (this.isBrowser()) {
        localStorage.setItem("plotline_services", JSON.stringify(this.serviceRequests));
      }

      this.addAuditLog({
        actor: `Officer (${this.currentRole})`,
        role: this.currentRole,
        action: `SERVICE_REQUEST_${status.toUpperCase().replace(/\s+/g, "_")}`,
        actionHi: `सेवा आवेदन ${status}`,
        parcelUlpin: item.ulpin,
        department: "Revenue Desk",
        details: `Request ${id} status updated to ${status}. Remarks: ${remarks}`,
        ipAddress: "10.42.0.1",
      });
    }
  }

  public resolveConflict(ulpin: string, actionNote: string) {
    const parcel = this.parcels.find((p) => p.ulpin === ulpin);
    if (parcel) {
      parcel.inconsistencies = [];
      parcel.disputeRiskScore = Math.max(12, parcel.disputeRiskScore - 40);
      parcel.healthChecks = parcel.healthChecks.map((c) => ({
        ...c,
        status: "pass" as const,
      }));

      if (this.isBrowser()) {
        localStorage.setItem("plotline_parcels", JSON.stringify(this.parcels));
      }

      this.addAuditLog({
        actor: `Officer (${this.currentRole})`,
        role: this.currentRole,
        action: "CROSS_LAYER_CONFLICT_RESOLVED",
        actionHi: "अंतर-विभागीय विसंगति का समाधान",
        parcelUlpin: ulpin,
        department: "Revenue / Dispute Triage Desk",
        details: `Discrepancy remediated. Note: ${actionNote}`,
        ipAddress: "10.42.1.22",
      });
    }
  }

  public getDominoSteps(): DominoStep[] {
    return this.dominoSteps;
  }

  public advanceDomino(): DominoStep[] {
    const nextPendingIndex = this.dominoSteps.findIndex((s) => s.status !== "completed");
    if (nextPendingIndex !== -1) {
      const now = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      this.dominoSteps[nextPendingIndex].status = "completed";
      this.dominoSteps[nextPendingIndex].timestamp = now;

      if (nextPendingIndex + 1 < this.dominoSteps.length) {
        this.dominoSteps[nextPendingIndex + 1].status = "in_progress";
      }

      this.addAuditLog({
        actor: this.dominoSteps[nextPendingIndex].actor,
        role: "patwari",
        action: "DOMINO_CHAIN_TRANSITION",
        actionHi: "डोमिनो श्रृंखला अग्रसारण",
        parcelUlpin: "RJ08040001001A",
        department: this.dominoSteps[nextPendingIndex].department,
        details: `Step ${nextPendingIndex + 1}: ${this.dominoSteps[nextPendingIndex].title} verified and committed.`,
        ipAddress: "10.42.0.5",
      });
    }
    return [...this.dominoSteps];
  }

  public resetDomino(): DominoStep[] {
    this.dominoSteps = [
      {
        step: 1,
        department: "Sub-Registrar Office",
        title: "Sale Deed Registered & Stamp Duty Paid",
        titleHi: "विक्रय पत्र पंजीकृत एवं स्टाम्प शुल्क जमा",
        status: "completed",
        timestamp: "2026-09-28 11:30 AM",
        actor: "Sub-Registrar Jaipur VI",
        details: "Deed RJ-SRO-2026-1102 registered. Circle rate verified. Post-registration webhook dispatched.",
      },
      {
        step: 2,
        department: "Revenue Department (Patwari)",
        title: "Automated Mutation (Namantaran) in Jamabandi",
        titleHi: "जमाबंदी में स्वतः नामांतरण",
        status: "in_progress",
        timestamp: null,
        actor: "Patwari Desk",
        details: "Rule-based auto-mutation generated; awaiting 15-day public objection period completion.",
      },
      {
        step: 3,
        department: "Municipal Corporation",
        title: "Property Tax Assessment & Transfer",
        titleHi: "संपत्ति कर निर्धारण एवं हस्तांतरण",
        status: "pending",
        timestamp: null,
        actor: "Municipal Tax Assessor",
        details: "Assess municipal rate, update tax ledger with new owner name, and issue digital assessment receipt.",
      },
      {
        step: 4,
        department: "Discom (JVVNL Electricity)",
        title: "Power Connection Consumer Name Update",
        titleHi: "विद्युत उपभोक्ता नाम परिवर्तन",
        status: "pending",
        timestamp: null,
        actor: "JVVNL Billing Substation",
        details: "Transfer electricity meter account without physical NOC requirement.",
      },
      {
        step: 5,
        department: "Public Health (PHED Water)",
        title: "Piped Water Supply Account Transfer",
        titleHi: "पेयजल आपूर्ति खाता हस्तांतरण",
        status: "pending",
        timestamp: null,
        actor: "PHED Assistant Engineer",
        details: "Automated account transfer completed in water billing database.",
      },
    ];
    return [...this.dominoSteps];
  }
}

export const dbStore = new LocalDbStore();
