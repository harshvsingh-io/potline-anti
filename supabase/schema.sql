-- =========================================================================
-- PLOTLINE: LAND STACK DPI SUPABASE / POSTGRESQL SCHEMA WITH RLS & AUDIT TRIGGERS
-- =========================================================================

-- Enable PostGIS and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. BASE LAYER: Cadastral Boundaries & ULPIN
CREATE TABLE IF NOT EXISTS parcels (
    ulpin VARCHAR(14) PRIMARY KEY,
    khasra_no VARCHAR(50) NOT NULL,
    survey_no VARCHAR(50) NOT NULL,
    village VARCHAR(100) NOT NULL,
    tehsil VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'Rajasthan',
    area_sqm NUMERIC(12, 2) NOT NULL,
    area_original VARCHAR(50) NOT NULL,
    land_use VARCHAR(50) NOT NULL,
    elevation_meters NUMERIC(6, 2) DEFAULT 390.0,
    dispute_risk_score INTEGER DEFAULT 0,
    boundary_geom GEOMETRY(Polygon, 4326),
    centroid_lat NUMERIC(9, 6) NOT NULL,
    centroid_lng NUMERIC(9, 6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ESSENTIAL LAYER: RoR Ownership
CREATE TABLE IF NOT EXISTS ror_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ulpin VARCHAR(14) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    owner_name VARCHAR(150) NOT NULL,
    owner_name_hi VARCHAR(150),
    father_name VARCHAR(150),
    share_pct NUMERIC(5, 2) DEFAULT 100.00,
    aadhar_masked VARCHAR(20),
    phone_masked VARCHAR(20),
    mutation_number VARCHAR(50),
    mutation_date DATE,
    tenure_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ESSENTIAL LAYER: Registered Deeds
CREATE TABLE IF NOT EXISTS registered_deeds (
    deed_no VARCHAR(50) PRIMARY KEY,
    ulpin VARCHAR(14) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    reg_date DATE NOT NULL,
    sro_name VARCHAR(150) NOT NULL,
    seller_name VARCHAR(150) NOT NULL,
    buyer_name VARCHAR(150) NOT NULL,
    declared_value NUMERIC(14, 2) NOT NULL,
    circle_rate_value NUMERIC(14, 2) NOT NULL,
    stamp_duty_paid NUMERIC(14, 2) NOT NULL,
    registration_fee NUMERIC(14, 2) NOT NULL,
    deed_type VARCHAR(100) DEFAULT 'Sale Deed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ESSENTIAL LAYER: Encumbrance & Mortgages
CREATE TABLE IF NOT EXISTS encumbrances (
    id VARCHAR(50) PRIMARY KEY,
    ulpin VARCHAR(14) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    bank_name VARCHAR(150) NOT NULL,
    loan_amount NUMERIC(14, 2) NOT NULL,
    mortgage_type VARCHAR(100),
    cersai_reg_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    registered_in_sro BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USE-CASE LAYER: Municipal Property Taxes
CREATE TABLE IF NOT EXISTS property_taxes (
    tax_id VARCHAR(50) PRIMARY KEY,
    ulpin VARCHAR(14) REFERENCES parcels(ulpin) ON DELETE CASCADE,
    assessment_year VARCHAR(20) NOT NULL,
    annual_demand NUMERIC(10, 2) NOT NULL,
    total_due NUMERIC(10, 2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'Paid',
    last_paid_date DATE,
    receipt_no VARCHAR(50),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IMMUTABLE AUDIT TRAIL LOG
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    action_hi VARCHAR(150),
    parcel_ulpin VARCHAR(14),
    department VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    sha256_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ror_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE registered_deeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE encumbrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for Land Stack transparency
CREATE POLICY "Public Read Parcels" ON parcels FOR SELECT USING (true);
CREATE POLICY "Public Read RoR" ON ror_owners FOR SELECT USING (true);
CREATE POLICY "Public Read Deeds" ON registered_deeds FOR SELECT USING (true);
CREATE POLICY "Public Read Encumbrances" ON encumbrances FOR SELECT USING (true);
CREATE POLICY "Public Read Taxes" ON property_taxes FOR SELECT USING (true);
CREATE POLICY "Public Read Audit Logs" ON audit_logs FOR SELECT USING (true);

-- Immutable Audit Log: No UPDATE or DELETE allowed
CREATE POLICY "Disallow Audit Updates" ON audit_logs FOR UPDATE USING (false);
CREATE POLICY "Disallow Audit Deletes" ON audit_logs FOR DELETE USING (false);

-- Automatic Audit Trigger on Parcel Updates
CREATE OR REPLACE FUNCTION audit_parcel_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (actor, role, action, parcel_ulpin, department, details, sha256_hash)
    VALUES (
        CURRENT_USER,
        'system_trigger',
        'PARCEL_RECORD_MUTATION',
        NEW.ulpin,
        'Revenue & Survey',
        CONCAT('Updated parcel record: ', NEW.ulpin, ' from risk score ', OLD.dispute_risk_score, ' to ', NEW.dispute_risk_score),
        MD5(CONCAT(NEW.ulpin, NOW()::text))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_parcels ON parcels;
CREATE TRIGGER trg_audit_parcels
AFTER UPDATE ON parcels
FOR EACH ROW
EXECUTE FUNCTION audit_parcel_changes();
