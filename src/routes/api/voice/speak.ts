import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

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

// Keep each request comfortably under the model's input limit.
function firstChunk(text: string, maxWords = 350) {
  const words = text.match(/\S+/g) ?? [];
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
}

export const Route = createFileRoute("/api/voice/speak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await requireUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json().catch(() => ({}))) as { text?: string; voice?: string };
        const raw = (body.text ?? "").trim();
        if (!raw) {
          return new Response(JSON.stringify({ error: "Nothing to read out." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: firstChunk(raw),
            voice: body.voice === "professor" ? "onyx" : "alloy",
            instructions:
              "Speak warmly and clearly, like a friendly Nigerian university lecturer explaining to a student. Moderate pace.",
            response_format: "mp3",
          }),
        });

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error("TTS failed", res.status, detail);
          return new Response(JSON.stringify({ error: `Voice failed (${res.status})`, detail }), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(res.body, {
          headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
