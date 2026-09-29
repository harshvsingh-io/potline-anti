import { NextRequest, NextResponse } from "next/server";
import { PARCELS_DATA } from "@/data/parcels";

export async function GET(
  request: NextRequest,
  { params }: { params: { ulpin: string } }
) {
  const ulpin = params.ulpin.toUpperCase();
  const parcel = PARCELS_DATA.find((p) => p.ulpin.toUpperCase() === ulpin);

  if (!parcel) {
    return NextResponse.json(
      { status: "error", message: `Parcel ${ulpin} not found in state cadastral index` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    data: {
      ulpin: parcel.ulpin,
      khasraNo: parcel.khasraNo,
      surveyNo: parcel.surveyNo,
      village: parcel.village,
      tehsil: parcel.tehsil,
      district: parcel.district,
      state: parcel.state,
      areaSqM: parcel.areaSqM,
      areaOriginal: parcel.areaOriginal,
      landUse: parcel.landUse,
      centroid: parcel.centroid,
      elevationMeters: parcel.elevationMeters,
      disputeRiskScore: parcel.disputeRiskScore,
      inconsistencies: parcel.inconsistencies,
      zoning: parcel.zoning,
      taxStatus: parcel.tax.paymentStatus,
    },
  });
}
