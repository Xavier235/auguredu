// Manual bank-transfer payment configuration.
// Bank details for receiving Naira payments via Opay.

export const BANK_DETAILS = {
  bankName: "Opay",
  accountName: "Ayinde Adebola Temiloluwa",
  accountNumber: "9067859562",
  altLabel: "Also",
  altValue: "Opay transfers accepted",
};

export type PlanId = "lecturer_monthly" | "lecturer_yearly" | "pro_monthly" | "pro_yearly";

// ---- Payment reference IDs -------------------------------------------------
// Students put this code in the bank transfer narration so an admin can match
// a transfer to a submission instantly.
export const REFERENCE_REGEX = /^AUG-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 confusion

export function makeReferenceCode(userId: string) {
  const seed = userId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  let userPart = "";
  for (let i = 0; i < 4; i++) {
    const ch = seed[i] ?? "X";
    userPart += REF_ALPHABET.includes(ch) ? ch : REF_ALPHABET[ch.charCodeAt(0) % REF_ALPHABET.length];
  }
  let rand = "";
  for (let i = 0; i < 4; i++) {
    rand += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `AUG-${userPart}-${rand}`;
}

export const PLANS: Record<
  PlanId,
  { name: string; tier: "lecturer" | "pro"; period: "month" | "year"; priceNaira: number; blurb: string; perks: string[] }
> = {
  pro_monthly: {
    name: "Pro — Monthly",
    tier: "pro",
    period: "month",
    priceNaira: 25000,
    blurb: "Unlimited AI Study Buddy, flashcards & PDF chat.",
    perks: [
      "Unlimited AI Study Buddy chat",
      "Unlimited flashcards from PDFs & images",
      "PDF & image uploads in chat",
      "Priority AI responses",
    ],
  },
  pro_yearly: {
    name: "Pro — Yearly",
    tier: "pro",
    period: "year",
    priceNaira: 100000,
    blurb: "Save ₦200,000 vs monthly — best value for a full academic session.",
    perks: [
      "Everything in Pro Monthly",
      "Save ₦200,000 vs monthly billing",
      "Priority AI responses & faster queue",
      "Early access to new predictors & tools",
      "Advanced CGPA scenario planner",
      "Exportable PDF study reports",
      "Priority support (24h response)",
    ],
  },
  lecturer_monthly: {
    name: "Professor Access — Monthly",
    tier: "lecturer",
    period: "month",
    priceNaira: 40000,
    blurb: "Talk to a Nigerian university professor — worked examples, syllabus mapping and exam-style answers.",
    perks: [
      "Everything in Pro",
      "Professor Chat — 30 questions per day",
      "Worked examples & step-by-step solutions",
      "Syllabus & course-code cross mapping",
      "Priority receipt review",
    ],
  },
  lecturer_yearly: {
    name: "Professor Access — Yearly",
    tier: "lecturer",
    period: "year",
    priceNaira: 160000,
    blurb: "A full academic year of professor-level guidance. Save ₦320,000.",
    perks: [
      "Everything in Professor Monthly",
      "Save ₦320,000 vs monthly billing",
      "Unlimited professor questions (fair-use)",
      "Personal semester study coach",
      "Past-question walkthroughs on demand",
      "Priority research & citation help",
      "Direct WhatsApp escalation for urgent exam prep",
      "Priority approval on receipts (under 1 hour)",
    ],
  },
};

export function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function tierLabel(tier: string) {
  if (tier === "lecturer") return "Professor";
  if (tier === "pro") return "Pro";
  return "Free";
}
