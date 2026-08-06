import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mic, Square, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Hold-free mic button: tap to record, tap again to transcribe into the composer. */
export function MicButton({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size < 1024) {
          toast.error("That recording was too short.");
          return;
        }
        setBusy(true);
        try {
          const form = new FormData();
          form.append("audio", blob, "recording.webm");
          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            headers: await authHeader(),
            body: form,
          });
          const json = await res.json().catch(() => ({}) as any);
          if (!res.ok) throw new Error(json.error ?? "Could not hear that, please try again.");
          const text = (json.text ?? "").trim();
          if (!text) throw new Error("Nothing was picked up, please speak a little louder.");
          onTranscript(text);
        } catch (e: any) {
          toast.error(e.message ?? "Voice failed");
        } finally {
          setBusy(false);
        }
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone permission is needed to send audio.");
    }
  }

  function stop() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }

  return (
    <button
      type="button"
      onClick={() => (recording ? stop() : start())}
      disabled={disabled || busy}
      aria-label={recording ? "Stop recording and send audio" : "Record audio message for Augur"}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
        recording
          ? "border-rose-500/60 bg-rose-500/15 text-rose-300 animate-pulse"
          : "border-border bg-background/70 hover:bg-muted"
      }`}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : recording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}

/** Reads any Augur reply out loud with the professor voice. */
export function SpeakButton({ text, label = "Listen to this reply" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  async function toggle() {
    if (state === "playing") {
      audioRef.current?.pause();
      audioRef.current = null;
      setState("idle");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeader()) },
        body: JSON.stringify({ text, voice: "professor" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}) as any);
        throw new Error(j.error ?? "Voice playback failed");
      }
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;
      audio.onended = () => setState("idle");
      await audio.play();
      setState("playing");
    } catch (e: any) {
      toast.error(e.message ?? "Voice playback failed");
      setState("idle");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={state === "playing" ? "Stop audio" : label}
      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
    >
      {state === "loading" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : state === "playing" ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
      {state === "playing" ? "Stop" : "Listen"}
    </button>
  );
}
