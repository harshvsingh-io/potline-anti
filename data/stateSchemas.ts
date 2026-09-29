export interface SchemaFieldMapping {
  standardField: string;
  standardDescription: string;
  standardType: string;
  stateASourceField: string; // Rajasthan (Apna Khata / E-Dharti)
  stateAUnit: string;
  stateBSourceField: string; // Haryana (Jamabandi) or Maharashtra (MahaBhulekh)
  stateBUnit: string;
  stateTransformationRule?: string;
  transformationRule: string;
}

export const STATE_SCHEMA_MAPPINGS: SchemaFieldMapping[] = [
  {
    standardField: "parcel_id_ulpin",
    standardDescription: "14-digit alphanumeric Bhu-Aadhaar / ULPIN",
    standardType: "String (14)",
    stateASourceField: "bhu_aadhaar_no",
    stateAUnit: "Alphanumeric",
    stateBSourceField: "kewat_khasra_hash",
    stateBUnit: "Composite string",
    transformationRule: "Direct 1:1 ISO 19152 LADM identity assignment",
  },
  {
    standardField: "cadastral_survey_no",
    standardDescription: "Local village field survey / parcel identification",
    standardType: "String",
    stateASourceField: "khasra_number (खसरा नं)",
    stateAUnit: "Fractional e.g. 142/1",
    stateBSourceField: "murabba_killa_no (मुरब्बा/किल्ला नं)",
    stateBUnit: "Composite e.g. 42//15",
    transformationRule: "Parse regex '(\\d+)//(\\d+)' -> standard cadastral segment",
  },
  {
    standardField: "normalized_area_sqm",
    standardDescription: "Standardized metric parcel surface area",
    standardType: "Float (sq meters)",
    stateASourceField: "rakba_bigha_biswa",
    stateAUnit: "Bigha / Biswa (1 Bigha = 2,529.28 m² in Jaipur)",
    stateBSourceField: "kanal_marla",
    stateBUnit: "Kanal / Marla (1 Kanal = 505.857 m² in Haryana)",
    stateTransformationRule: "Jaipur Bigha * 2529.28 + Biswa * 126.464",
    transformationRule: "Convert regional traditional units into SI metric m²",
  },
  {
    standardField: "primary_owner_name",
    standardDescription: "Primary record-holder / Khatedar legal title",
    standardType: "String (Unicode UTF-8)",
    stateASourceField: "khatedar_naam (खातेदार का नाम)",
    stateAUnit: "Devanagari text",
    stateBSourceField: "malik_naam_hissedar (मालिक नाम/हिस्सेदार)",
    stateBUnit: "Gurmukhi / Devanagari text",
    transformationRule: "Normalize honorifics (Shri, Smt) & extract coparcenary shares",
  },
  {
    standardField: "land_use_classification",
    standardDescription: "Categorized zoning and revenue classification",
    standardType: "Enum (Agricultural, Residential, Commercial, Industrial, Eco)",
    stateASourceField: "kisam_zameen (किस्म ज़मीन: चाही, बरानी, बिलानाम)",
    stateAUnit: "Revenue classification",
    stateBSourceField: "khasra_girdawari_class (नेहरी, चाही, गैर मुमकिन)",
    stateBUnit: "Agricultural soil classification",
    transformationRule: "Map 32 regional soil codes into 5 Land Stack DPI classes",
  },
  {
    standardField: "encumbrance_status",
    standardDescription: "Active legal mortgage / lien / charge on parcel",
    standardType: "Boolean + Object array",
    stateASourceField: "rehnamukta_shart (रहननामा कैफियत)",
    stateAUnit: "Jamabandi Column 12 text remarks",
    stateBSourceField: "barah_sala_rahn (12-साला रहन प्रविष्टि)",
    stateBUnit: "Sub-Registrar encumbrance index",
    transformationRule: "Parse bank charge strings into structured CERSAI format",
  },
];

export interface UnitConversionSample {
  state: "Rajasthan" | "Haryana" | "Maharashtra" | "Punjab";
  unitName: string;
  unitHi: string;
  sampleInput: string;
  sqMetersResult: number;
  sqYardsResult: number;
  acresResult: number;
}

export const UNIT_CONVERSION_SAMPLES: UnitConversionSample[] = [
  {
    state: "Rajasthan",
    unitName: "Jaipur Pucca Bigha (1 Bigha 4 Biswa)",
    unitHi: "जयपुर पक्का बीघा (1 बीघा 4 बिस्वा)",
    sampleInput: "1 Bigha 4 Biswa",
    sqMetersResult: 3035.14,
    sqYardsResult: 3630.0,
    acresResult: 0.75,
  },
  {
    state: "Haryana",
    unitName: "Kanal & Marla (4 Kanal 8 Marla)",
    unitHi: "कनाल एवं मरला (4 कनाल 8 मरला)",
    sampleInput: "4 Kanal 8 Marla",
    sqMetersResult: 2225.77,
    sqYardsResult: 2662.0,
    acresResult: 0.55,
  },
  {
    state: "Maharashtra",
    unitName: "Guntha (20 Guntha)",
    unitHi: "गुंठा (20 गुंठा)",
    sampleInput: "20 Guntha",
    sqMetersResult: 2023.43,
    sqYardsResult: 2420.0,
    acresResult: 0.50,
  },
  {
    state: "Punjab",
    unitName: "Biswa & Killa (1 Killa 2 Kanal)",
    unitHi: "किल्ला एवं कनाल (1 किल्ला 2 कनाल)",
    sampleInput: "1 Killa 2 Kanal",
    sqMetersResult: 5058.57,
    sqYardsResult: 6050.0,
    acresResult: 1.25,
  },
];
