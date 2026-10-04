import { describe, it, expect } from "vitest";
import { matchesExamQuestion } from "./reply-style";

const qs = ["Which of the following is the SI unit of electric current in physics?"];

describe("exam question guard", () => {
  it("blocks a pasted exam question", () => {
    expect(matchesExamQuestion("which of the following is the SI unit of electric current in physics", qs)).toBe(true);
  });
  it("allows an unrelated question", () => {
    expect(matchesExamQuestion("How do I balance a chemical equation?", qs)).toBe(false);
  });
});
