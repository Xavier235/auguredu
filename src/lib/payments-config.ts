// Manual bank-transfer payment configuration.
// Bank details for receiving Naira payments via Opay.

export const BANK_DETAILS = {
  bankName: "Opay",
  accountName: "Ayinde Adebola Temiloluwa",
  accountNumber: "TO BE PROVIDED", // Reply with the 10-digit Opay account number to fill this in
  altLabel: "Also",
  altValue: "Opay transfers accepted",
};

export type PlanId = "lecturer_monthly" | "lecturer_yearly" | "pro_monthly" | "pro_yearly";

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
