"use client";

import React, { useState } from "react";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { ParcelData } from "@/data/parcels";

interface HealthPdfButtonProps {
  parcel: ParcelData;
}

export const HealthPdfButton: React.FC<HealthPdfButtonProps> = ({ parcel }) => {
  const [generating, setGenerating] = useState(false);

  const generatePdf = async () => {
    setGenerating(true);
    try {
      // 1. Generate QR Code pointing to verification URL
      const origin = typeof window !== "undefined" ? window.location.origin : "https://plotline.gov.in";
      const verifyUrl = `${origin}/verify/${parcel.ulpin}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 160,
        margin: 1,
        color: { dark: "#1B2621", light: "#F4EFE6" },
      });

      // 2. Initialize jsPDF (Portrait, mm, A4)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const primaryForest = "#1F4D3A";
      const ink = "#1B2621";
      const paperBg = "#F4EFE6";
      const surveyRed = "#B3372A";

      // Background tinted paper fill
      doc.setFillColor(244, 239, 230);
      doc.rect(0, 0, 210, 297, "F");

      // Outer hairline border
      doc.setDrawColor(27, 38, 33);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, 190, 277);

      // Header Banner
      doc.setFont("courier", "bold");
      doc.setFontSize(8);
      doc.setTextColor(91, 103, 112);
      doc.text("GOVERNMENT OF RAJASTHAN • LAND STACK DIGITAL PUBLIC INFRASTRUCTURE", 105, 18, { align: "center" });

      doc.setFont("times", "bold");
      doc.setFontSize(20);
      doc.setTextColor(31, 77, 58);
      doc.text("PARCEL TITLE HEALTH CERTIFICATE", 105, 27, { align: "center" });

      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(27, 38, 33);
      doc.text(`Official Land Record Inspection • Issue Date: ${new Date().toLocaleDateString("en-IN")}`, 105, 33, { align: "center" });

      doc.setLineWidth(0.2);
      doc.line(15, 37, 195, 37);

      // Parcel Identifiers Table
      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 77, 58);
      doc.text("1. PARCEL IDENTIFICATION & CADASTRAL LOCATION", 15, 45);

      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(27, 38, 33);
      doc.text(`ULPIN (Bhu-Aadhaar): ${parcel.ulpin}`, 15, 52);
      doc.text(`Khasra / Survey No:  ${parcel.khasraNo} (${parcel.surveyNo})`, 15, 58);
      doc.text(`Village / Ward:      ${parcel.village}, Tehsil ${parcel.tehsil}`, 15, 64);
      doc.text(`District & State:    ${parcel.district}, ${parcel.state}`, 15, 70);
      doc.text(`Digitized Area:      ${parcel.areaSqM} m² (RoR: ${parcel.areaOriginal})`, 15, 76);
      doc.text(`Zoning & Land Use:   ${parcel.zoning.zoneType} / ${parcel.landUse}`, 15, 82);

      // Embed QR Code
      doc.addImage(qrDataUrl, "PNG", 155, 42, 38, 38);
      doc.setFontSize(7);
      doc.text("Scan to Verify Online", 174, 83, { align: "center" });

      doc.line(15, 88, 195, 88);

      // Ownership & Deeds Section
      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 77, 58);
      doc.text("2. PROVENANCE & CURRENT TITLE HOLDER", 15, 96);

      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(27, 38, 33);
      doc.text(`Primary Khatedar:    ${parcel.owners[0]?.name} (s/o ${parcel.owners[0]?.fatherName})`, 15, 103);
      doc.text(`Tenure & Share:      ${parcel.owners[0]?.tenureType} (${parcel.owners[0]?.sharePct}% share)`, 15, 109);
      doc.text(`Mutation Record:     No. ${parcel.owners[0]?.mutationNumber} dated ${parcel.owners[0]?.mutationDate}`, 15, 115);
      doc.text(`Latest Deed:         ${parcel.latestDeed.deedNo} (${parcel.latestDeed.sro})`, 15, 121);

      doc.line(15, 127, 195, 127);

      // 8-Point Automated Health Inspection Table
      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 77, 58);
      doc.text("3. AUTOMATED MULTI-DEPARTMENT COMPLIANCE CHECKS", 15, 135);

      let yPos = 143;
      doc.setFontSize(8);
      parcel.healthChecks.forEach((check, idx) => {
        const isPass = check.status === "pass";
        const statusText = isPass ? "[PASS]" : check.status === "warn" ? "[WARN]" : "[FAIL]";
        
        doc.setFont("courier", "bold");
        if (isPass) doc.setTextColor(31, 77, 58);
        else if (check.status === "warn") doc.setTextColor(201, 146, 46);
        else doc.setTextColor(179, 55, 42);

        doc.text(`${statusText} ${idx + 1}. ${check.title}`, 15, yPos);
        
        doc.setFont("courier", "normal");
        doc.setTextColor(27, 38, 33);
        doc.text(`${check.detail} (Source: ${check.department})`, 25, yPos + 4);
        
        yPos += 11;
      });

      // Composite Dispute Risk Score Section
      doc.line(15, yPos, 195, yPos);
      yPos += 7;

      doc.setFont("courier", "bold");
      doc.setFontSize(10);
      doc.setTextColor(31, 77, 58);
      doc.text("4. DISPUTE RISK ASSESSMENT & RECOMMENDATION", 15, yPos);
      yPos += 7;

      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(27, 38, 33);
      doc.text(`Dispute Risk Score: ${parcel.disputeRiskScore} / 100`, 15, yPos);
      doc.text(
        parcel.disputeRiskScore < 25
          ? "Status: CLEAR FOR REGISTRATION & BANK FINANCING."
          : "Status: ENCUMBRANCE OR MUNICIPAL RECTIFICATION REQUIRED PRIOR TO SALE.",
        15,
        yPos + 6
      );

      // Footer disclaimer & Seal
      doc.line(15, 268, 195, 268);
      doc.setFontSize(7);
      doc.setTextColor(91, 103, 112);
      doc.text("This document is generated by the Land Stack DPI engine for demonstration and validation.", 105, 273, { align: "center" });
      doc.text("Digitally authenticated under Section 65B Indian Evidence Act • Check online with QR code.", 105, 277, { align: "center" });

      // Save PDF
      doc.save(`Plotline_Certificate_${parcel.ulpin}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePdf}
      disabled={generating}
      className="inline-flex items-center gap-2 px-3.5 py-2 bg-forest text-paper hover:bg-forest-hover font-mono text-xs font-semibold uppercase tracking-wider border border-forest transition-colors shadow-sm disabled:opacity-60"
    >
      {generating ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF Certificate</span>
        </>
      )}
    </button>
  );
};
