# Plotline (प्लाॅटलाइन)
### Parcel-Centric GIS Digital Public Infrastructure for Land Governance in India (National Land Stack Prototype)

> **"One parcel. One identity. Every department."**  
> **"एक ज़मीन। एक पहचान। सब विभाग।"**

---

## 1. Problem Statement & Solution

Land governance across Indian states is heavily fragmented across isolated departmental silos:
- **Revenue Department**: Maintains paper & digitized Record of Rights (Jamabandi / RoR) with traditional units (Bigha, Biswa, Kanal).
- **Registration Department**: Registers conveyances (sale deeds) without real-time title lock, enabling unrecorded mortgages and duplicate sales.
- **Town Planning (JDA / Municipalities)**: Issues building permits and enforces master plan zoning independently of revenue conversion (Section 90-A).
- **Financial Institutions / CERSAI**: Register equitable mortgages that frequently fail to reflect on sub-registrar encumbrance certificates (Form 15/16).
- **Survey & Settlement**: Cadastral vectors drift from paper Jamabandi records by up to 20%.

**Plotline** solves this by establishing a unified parcel-level Digital Public Infrastructure anchored around **ULPIN (Unique Land Parcel Identification Number / Bhu-Aadhaar)**.

---

## 2. Land Stack 3-Tier Architecture

| Land Stack Tier | Attributes & Data | Originating Authority | DPI Policy Rule |
| :--- | :--- | :--- | :--- |
| **1. BASE LAYER** | 14-character alphanumeric ULPIN, WGS84 GeoJSON cadastral polygon, ETS survey pins, centroid. | Survey & Settlement Dept (DLRS) | Zero boundary overlap tolerance checked via Turf.js. |
| **2. ESSENTIAL LAYER** | Jamabandi RoR legal owners, coparcenary shares, Sub-Registrar deeds, CERSAI bank liens, Master Plan 2025 zoning. | Revenue Dept, Registration Dept, Banks, Town Planning | Automated deed-to-mutation pipeline. Blocks unauthorized construction on green belt land. |
| **3. USE-CASE LAYER** | Property tax ledger, DLC guidance circle rate, power (JVVNL) & water (PHED) consumer accounts, 100-yr HFL flood zone buffers. | Municipal Corporation, Discoms, PHED, Disaster Management | Automatic utility name transfer upon mutation. NGT river buffer alerts. |

---

## 3. Jaipur Pilot Dataset (40 Parcels)

The application includes 40 georeferenced parcels located in the Jaipur metropolitan & rural pilot area (Sanganer Tehsil & Ward 14 Mansarovar Extension):
- **20 Rural Parcels**: Khasra numbering, Pucca Bigha/Biswa area, Khatedari tenure.
- **20 Urban Parcels**: Ward plot numbering, normalized square meters, Master Plan R-2 zoning.

### 8 Seeded Inconsistencies for Diagnostic Testing:
1. `RJ08040001001A` (Khasra 142/1): RoR Jamabandi owner differs from latest registered buyer (Delayed/fraud mutation).
2. `RJ08040001002A` (Khasra 142/2): Commercial warehouse building permit issued without Section 90-A CLU on agricultural land.
3. `RJ08040001003A` (Khasra 143/1): Active ₹45 Lakh SBI mortgage in CERSAI missing from Sub-Registrar encumbrance certificate.
4. `RJ08040001004A` (Khasra 144/1): Overlapping cadastral boundary (124 m² collision) with adjacent parcel Khasra 144/2.
5. `RJ08040001005A` (Khasra 144/2): Municipal property tax unpaid for 3 consecutive financial years (₹78,400 arrears).
6. `RJ08040001006A` (Khasra 145/1): Parcel intersects with 100-year High Flood Level (HFL) setback of Dravyavati River.
7. `RJ08040001007A` (Khasra 145/2): 17.8% area shortfall between RoR Jamabandi (3,162 m²) and GIS vector polygon (2,600 m²).
8. `RJ08040001008A` (Khasra 146/1): Active civil court interim stay order restraining title alienation.

---

## 4. User Roles & Demo Switcher

Click the **Role Switcher** in the top navigation header to test permissions:
- **Citizen / Land Owner**: View 360° record, download PDF health certificate, simulate subdivision split, submit service requests.
- **Revenue Officer (Patwari / Tehsildar)**: Review mutation queue, endorse Jamabandi changes, resolve cross-layer conflicts.
- **Sub-Registrar**: Deed registration verification, circle rate stamp duty assessment.
- **Urban Planner**: Enforce Master Plan 2025 zoning codes, inspect building permissions.
- **State Administrator**: Monitor Land Pulse district choropleth, generate developer API keys, review immutable audit logs.

---

## 5. Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling & Design**: Tailwind CSS with custom survey-office cartographic tokens (`#F4EFE6` paper, `#1B2621` ink, `#1F4D3A` forest green, `#B3372A` survey red).
- **Procedural 3D**: Three.js, `@react-three/fiber`, `@react-three/drei` (Zero heavy GLB/GLTF assets).
- **2D Mapping**: React Leaflet + OpenStreetMap tiles.
- **Spatial Calculations**: `@turf/turf` (Geometry severance, area polygon intersection).
- **Analytics**: Recharts.
- **Database & RLS**: PostgreSQL / Supabase PostGIS DDL with automatic fallback mock-store.
- **Search**: `cmdk` (Ctrl+K) + Web Speech API (Hindi/English voice search).
- **Document Export**: `jsPDF` + `qrcode` (Tamper-evident verification link).

---

## 6. Getting Started

### Prerequisites
- Node.js v18+ or v20+

### Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
