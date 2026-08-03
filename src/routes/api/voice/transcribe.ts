import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const EXT: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

async function requireUser(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const supabase = createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export const Route = createFileRoute("/api/voice/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await requireUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const form = await request.formData();
        const audio = form.get("audio");
        if (!(audio instanceof File)) {
          return new Response(JSON.stringify({ error: "No audio uploaded" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (audio.size < 1024) {
          return new Response(JSON.stringify({ error: "Recording was too short — please try again." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (audio.size > 20 * 1024 * 1024) {
          return new Response(JSON.stringify({ error: "Recording too long (max 20 MB)." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const base = (audio.type || "audio/webm").split(";")[0];
        const ext = EXT[base] ?? "webm";

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", audio, `recording.${ext}`);

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}` },
          body: upstream,
        });

        const text = await res.text();
        if (!res.ok) {
          console.error("Transcription failed", res.status, text);
          return new Response(JSON.stringify({ error: `Transcription failed (${res.status})`, detail: text }), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          });
        }
        let parsed: any = {};
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { text };
        }
        return new Response(JSON.stringify({ text: parsed.text ?? "" }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
