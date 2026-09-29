"use client";

import React, { useState } from "react";
import { MessageSquare, Bell, Smartphone, Send, CheckCheck } from "lucide-react";

interface NotificationMsg {
  id: string;
  sender: string;
  channel: "WhatsApp" | "SMS";
  time: string;
  title: string;
  body: string;
  bodyHi: string;
}

const SAMPLE_NOTIFICATIONS: NotificationMsg[] = [
  {
    id: "notif-1",
    sender: "e-Dharti Rajasthan",
    channel: "WhatsApp",
    time: "10:14 AM",
    title: "Mutation Process Initiated",
    body: "Notice: An automated mutation application (Ref: M-2024-891) for Khasra 142/1 has been logged post-deed execution. View status on Plotline.",
    bodyHi: "सूचना: खसरा 142/1 हेतु स्वचालित नामांतरण (संदर्भ: M-2024-891) दर्ज किया गया है। स्थिति प्लॉटलाइन पर देखें।",
  },
  {
    id: "notif-2",
    sender: "CERSAI Central Registry",
    channel: "SMS",
    time: "Yesterday",
    title: "Bank Security Interest Registered",
    body: "Security interest of Rs 45,00,000 has been registered by State Bank of India against your land parcel ULPIN RJ08040001003A.",
    bodyHi: "आपके भूखंड ULPIN RJ08040001003A के विरुद्ध एसबीआई द्वारा ₹45,00,000 का सुरक्षा हित पंजीकृत किया गया है।",
  },
  {
    id: "notif-3",
    sender: "Jaipur Municipal Corp",
    channel: "WhatsApp",
    time: "2 days ago",
    title: "Urban Property Tax Assessment Notice",
    body: "Annual Urban Development Tax bill of ₹24,000 generated for Ward 14 / Plot 404. Pay before 31st March to avail 5% rebate.",
    bodyHi: "वार्ड 14 भूखंड हेतु ₹24,000 का वार्षिक नगरीय विकास कर बिल जारी हुआ। 31 मार्च से पूर्व 5% छूट का लाभ लें।",
  },
];

export const PhoneSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"WhatsApp" | "SMS">("WhatsApp");
  const filtered = SAMPLE_NOTIFICATIONS.filter((n) => n.channel === activeTab);

  return (
    <div className="w-full max-w-sm mx-auto bg-ink-light rounded-[32px] p-3 shadow-2xl border-4 border-[#3D4C44] relative select-none">
      {/* Phone Notch & Speaker */}
      <div className="w-24 h-4 bg-ink rounded-full mx-auto mb-2 flex items-center justify-center">
        <div className="w-8 h-1 bg-ink-muted/40 rounded-full" />
      </div>

      {/* Screen container */}
      <div className="bg-[#EFEAE2] dark:bg-[#121B17] rounded-[24px] overflow-hidden border border-ink/20 flex flex-col h-[460px]">
        {/* App Bar */}
        <div className="bg-forest px-4 py-3 text-paper flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {activeTab === "WhatsApp" ? "Citizen WhatsApp" : "Govt SMS Inbox"}
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase bg-paper/20 px-1.5 py-0.5 rounded-sm">
            Simulated
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-hairline bg-paper-light dark:bg-night-card text-[11px] font-mono">
          <button
            onClick={() => setActiveTab("WhatsApp")}
            className={`flex-1 py-1.5 text-center font-bold ${
              activeTab === "WhatsApp"
                ? "border-b-2 border-forest text-forest"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            WhatsApp Business
          </button>
          <button
            onClick={() => setActiveTab("SMS")}
            className={`flex-1 py-1.5 text-center font-bold ${
              activeTab === "SMS"
                ? "border-b-2 border-forest text-forest"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Direct SMS
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono">
          <div className="text-center">
            <span className="text-[9px] bg-ink/10 dark:bg-paper/10 text-ink-muted px-2 py-0.5 rounded-sm">
              Today • Land Stack Notifications
            </span>
          </div>

          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-paper dark:bg-night-surface border border-hairline p-3 shadow-xs rounded-sm space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-ink-muted border-b border-hairline pb-1">
                <span className="font-bold text-forest">{msg.sender}</span>
                <span>{msg.time}</span>
              </div>
              <div className="font-bold text-xs text-ink dark:text-paper pt-0.5">
                {msg.title}
              </div>
              <p className="text-[11px] text-ink-light dark:text-paper/80 leading-relaxed">
                {msg.body}
              </p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-forest pt-1">
                <CheckCheck className="w-3 h-3 text-forest" />
                <span>Delivered & Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Simulated input bar at bottom */}
        <div className="p-2 border-t border-hairline bg-paper dark:bg-night-card flex items-center gap-2">
          <input
            type="text"
            readOnly
            value="Simulated citizen notification stream"
            className="flex-1 bg-paper-light dark:bg-night-surface border border-hairline px-2 py-1 text-[10px] font-mono text-ink-muted rounded-none"
          />
          <button className="p-1.5 bg-forest text-paper rounded-none" disabled>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
