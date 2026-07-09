// Manual bank-transfer payment configuration.
// Update BANK_DETAILS with your permanent receiving account.

export const BANK_DETAILS = {
  bankName: "TO BE PROVIDED",
  accountName: "TO BE PROVIDED",
  accountNumber: "0000000000",
  // Optional secondary rail (e.g. Opay/Kuda/USDT)
  altLabel: "",
  altValue: "",
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
    priceNaira: 2500,
    blurb: "Unlimited AI Study Buddy, flashcards & PDF chat.",
    perks: ["Unlimited AI chat", "Unlimited flashcards", "PDF & image uploads", "Read-to-earn XP boost"],
  },
  pro_yearly: {
    name: "Pro — Yearly",
    tier: "pro",
    period: "year",
    priceNaira: 24000,
    blurb: "Save 20% — best value for a full academic session.",
    perks: ["Everything in Pro monthly", "Save ₦6,000 vs monthly", "Priority AI response"],
  },
  lecturer_monthly: {
    name: "Lecturer AI — Monthly",
    tier: "lecturer",
    period: "month",
    priceNaira: 5000,
    blurb: "Premium lecturer-grade answers with worked examples & syllabus mapping.",
    perks: ["Everything in Pro", "Lecturer AI (30 requests/day)", "Deep worked examples", "Course-code cross mapping"],
  },
  lecturer_yearly: {
    name: "Lecturer AI — Yearly",
    tier: "lecturer",
    period: "year",
    priceNaira: 48000,
    blurb: "Full-year lecturer access. Save 20%.",
    perks: ["Everything in Lecturer monthly", "Save ₦12,000 vs monthly", "Priority review of receipts"],
  },
};

export function formatNaira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}
