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
      { status: "error", message: `Parcel ${ulpin} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "success",
    timestamp: new Date().toISOString(),
    ulpin: parcel.ulpin,
    khasraNo: parcel.khasraNo,
    encumbranceCount: parcel.encumbrances.length,
    encumbrances: parcel.encumbrances,
    isCleanTitle: parcel.encumbrances.length === 0,
  });
}
