// Detects whether an email belongs to a school domain that can plausibly be
// verified by a school authority. We treat any .edu / .edu.ng / .ac.<cc>
// as a student domain, and flag common consumer providers as non-student.

const CONSUMER_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "yahoo.co.uk", "outlook.com", "hotmail.com",
  "live.com", "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com",
  "yandex.com", "mail.com", "gmx.com", "zoho.com",
]);

export type EmailKind = "student" | "consumer" | "other";

export function classifyEmail(email: string): { kind: EmailKind; domain: string } {
  const domain = (email.split("@")[1] ?? "").trim().toLowerCase();
  if (!domain) return { kind: "other", domain: "" };
  if (CONSUMER_DOMAINS.has(domain)) return { kind: "consumer", domain };
  // .edu, .edu.<cc>, .ac.<cc>, .sch.<cc>
  if (/\.edu(\.[a-z]{2,3})?$/.test(domain)) return { kind: "student", domain };
  if (/\.ac\.[a-z]{2,3}$/.test(domain)) return { kind: "student", domain };
  if (/\.sch\.[a-z]{2,3}$/.test(domain)) return { kind: "student", domain };
  return { kind: "other", domain };
}

// Turns a Supabase error message into a user-friendly one.
export function friendlyAuthError(raw: string | undefined): string {
  const m = (raw ?? "").toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials") || m.includes("invalid email or password")) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("email not confirmed")) return "Please confirm your email first — check your inbox.";
  if (m.includes("user already registered")) return "An account with that email already exists. Try signing in.";
  if (m.includes("rate limit")) return "Too many attempts — wait a moment and try again.";
  if (m.includes("password") && m.includes("6")) return "Password must be at least 6 characters.";
  return raw || "Something went wrong. Please try again.";
}
