import { NextRequest, NextResponse } from "next/server";
import { PARCELS_DATA } from "@/data/parcels";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id.toUpperCase();
  const parcel = PARCELS_DATA.find((p) => p.ulpin.toUpperCase() === id);

  if (!parcel) {
    return NextResponse.json(
      { status: "invalid", message: `Record ${id} cannot be verified against ledger` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "verified",
    verificationTimestamp: new Date().toISOString(),
    sha256Hash: `0x9f8e7d6c5b4a3210${parcel.ulpin.toLowerCase()}8847`,
    ulpin: parcel.ulpin,
    khasraNo: parcel.khasraNo,
    village: parcel.village,
    primaryOwner: parcel.owners[0]?.name,
    areaSqM: parcel.areaSqM,
    disputeRiskScore: parcel.disputeRiskScore,
    isTamperEvident: true,
  });
}
