import { supabase } from "@/integrations/supabase/client";

/**
 * Avatars are stored in the private `avatars` bucket under `${userId}/...`.
 * `avatar_url` on the profile may be either:
 *   - a full http(s) URL (e.g. from Google OAuth) — used as-is
 *   - a storage path inside the bucket — resolved to a signed URL
 */
export async function resolveAvatarUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(value, 60 * 60); // 1h
  if (error) return null;
  return data.signedUrl;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type || "image/png" });
  if (error) throw error;
  return path;
}
