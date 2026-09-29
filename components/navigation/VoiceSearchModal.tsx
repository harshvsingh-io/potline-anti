"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PARCELS_DATA } from "@/data/parcels";
import { useApp } from "../providers/AppProvider";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { lang } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript("");
      setErrorMsg("");
      return;
    }

    // Check if Web Speech API is supported
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg(
        lang === "hi"
          ? "इस ब्राउज़र में ध्वनि पहचान (Speech API) उपलब्ध नहीं है।"
          : "Web Speech API is not supported in this browser. Please type to search."
      );
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRecognition as any)();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg("");
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        setErrorMsg(
          lang === "hi"
            ? `ध्वनि पहचान त्रुटि: ${event.error}`
            : `Speech recognition error: ${event.error}`
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        recognition.abort();
      };
    } catch {
      setErrorMsg("Failed to initialize voice search.");
    }
  }, [isOpen, lang]);

  if (!isOpen) return null;

  const handleMatchSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    // Search by ULPIN or owner or khasra
    const matched = PARCELS_DATA.find(
      (p) =>
        p.ulpin.toLowerCase().includes(q) ||
        p.khasraNo.toLowerCase().includes(q) ||
        p.owners.some((o) => o.name.toLowerCase().includes(q) || o.hindiName.includes(q))
    );

    if (matched) {
      onClose();
      router.push(`/parcel/${matched.ulpin}`);
    } else {
      // Fallback to first parcel or search query
      onClose();
      router.push(`/parcel/RJ08040001001A`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-paper dark:bg-night-surface border border-hairline max-w-md w-full p-6 shadow-xl relative rounded-sm">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink dark:hover:text-paper"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-4 rounded-full bg-forest/10 dark:bg-forest/20 text-forest mb-3">
            {isListening ? (
              <Mic className="w-8 h-8 animate-pulse text-surveyRed" />
            ) : (
              <MicOff className="w-8 h-8 text-ink-muted" />
            )}
          </div>
          <h3 className="font-serif text-xl font-bold text-ink dark:text-paper">
            {lang === "hi" ? "आवाज़ से खोजें" : "Voice Search"}
          </h3>
          <p className="text-xs text-ink-muted mt-1 font-mono">
            {lang === "hi"
              ? "बोले: 'खसरा 142' या खातेदार का नाम या 'RJ0804...'"
              : "Speak: 'Khasra 142', owner name, or ULPIN"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-surveyRed-faint border border-surveyRed/30 text-surveyRed text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="min-h-[70px] bg-paper-light dark:bg-night-card border border-hairline p-3 font-mono text-sm text-ink dark:text-paper flex items-center justify-center text-center">
          {transcript ? (
            <span className="font-semibold text-forest dark:text-[#388062]">&ldquo;{transcript}&rdquo;</span>
          ) : isListening ? (
            <span className="text-ink-muted italic text-xs">
              {lang === "hi" ? "सुन रहे हैं... कृपया बोलें" : "Listening... speak now"}
            </span>
          ) : (
            <span className="text-ink-muted text-xs">
              {lang === "hi" ? "कोई आवाज़ नहीं सुनी गई" : "No speech detected"}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-ink-muted hover:text-ink border border-hairline uppercase tracking-wider font-mono"
          >
            {lang === "hi" ? "रद्द करें" : "Cancel"}
          </button>
          {transcript && (
            <button
              onClick={() => handleMatchSearch(transcript)}
              className="px-4 py-1.5 text-xs bg-forest text-paper font-semibold hover:bg-forest-hover border border-forest font-mono uppercase tracking-wider"
            >
              {lang === "hi" ? "खोजें" : "Search"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
