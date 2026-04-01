"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access denied. Please allow microphone access to use voice input.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setTranscribing(true);
  }

  async function transcribeAudio(blob: Blob) {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();
      if (data.text) onTranscript(data.text);
    } catch {
      console.error("Transcription failed");
    } finally {
      setTranscribing(false);
    }
  }

  if (transcribing) {
    return (
      <button disabled className="p-3 rounded-xl glass text-dream-400">
        <Loader2 size={20} className="animate-spin" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={recording ? stopRecording : startRecording}
      disabled={disabled}
      className={cn(
        "p-3 rounded-xl transition-all",
        recording
          ? "bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse"
          : "glass text-dream-400 hover:text-dream-300 hover:bg-dream-900/40",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
      title={recording ? "Stop recording" : "Record voice"}
    >
      {recording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
}
