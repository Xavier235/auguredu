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
  {
    name: string;
    tier: "lecturer" | "pro";
    period: "month" | "year";
    priceNaira: number;
    blurb: string;
    perks: string[];
    featured?: boolean;
  }
> = {
  lecturer_monthly: {
    name: "Lecturer Premium — Monthly",
    tier: "lecturer",
    period: "month",
    priceNaira: 8000,
    blurb: "Our flagship plan. A Nigerian lecturer in your pocket: worked examples, WAEC/NECO/JAMB drills and syllabus mapping.",
    featured: true,
    perks: [
      "Everything in Basic",
      "Lecturer chat with Augur — 30 questions a day",
      "WAEC, NECO and JAMB drill modes",
      "Live web look-ups for fresh exam news",
      "Worked examples and step-by-step solutions",
      "Priority receipt review",
    ],
  },
  lecturer_yearly: {
    name: "Lecturer Premium — Yearly",
    tier: "lecturer",
    period: "year",
    priceNaira: 30000,
    blurb: "A full year of lecturer-level guidance. Save ₦66,000 against paying monthly.",
    featured: true,
    perks: [
      "Everything in Lecturer Premium Monthly",
      "Save ₦66,000 vs monthly billing",
      "Unlimited lecturer questions (fair use)",
      "Personal exam and semester coach",
      "Past-question walkthroughs on demand",
      "Receipts approved within the hour",
    ],
  },
  pro_monthly: {
    name: "Basic — Monthly",
    tier: "pro",
    period: "month",
    priceNaira: 5000,
    blurb: "Unlimited Augur study chat, flashcards and PDF reading.",
    perks: [
      "Unlimited Augur study chat",
      "Unlimited flashcards from PDFs and images",
      "PDF and image uploads in chat",
      "Faster responses",
    ],
  },
  pro_yearly: {
    name: "Basic — Yearly",
    tier: "pro",
    period: "year",
    priceNaira: 25000,
    blurb: "A full session of Basic. Save ₦35,000 against paying monthly.",
    perks: [
      "Everything in Basic Monthly",
      "Save ₦35,000 vs monthly billing",
      "Advanced CGPA scenario planner",
      "Exportable PDF study reports",
      "Early access to new tools",
    ],
  },
};

// ---- Referral discount -----------------------------------------------------
// Students who enter this code on the upgrade page pay 50% less.
export const REFERRAL_CODE = "FOUNTAIN TEENS";
export const REFERRAL_DISCOUNT = 0.5;

const normalise = (v: string) => v.trim().toUpperCase().replace(/\s+/g, " ");

export function isValidReferral(code?: string | null) {
  return !!code && normalise(code) === REFERRAL_CODE;
}

/** Price after applying the referral discount, rounded to whole naira. */
export function priceFor(planId: PlanId, referral?: string | null) {
  const base = PLANS[planId].priceNaira;
  return isValidReferral(referral) ? Math.round(base * (1 - REFERRAL_DISCOUNT)) : base;
}

export function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function tierLabel(tier: string) {
  if (tier === "lecturer") return "Professor";
  if (tier === "pro") return "Basic";
  return "Free";
}
