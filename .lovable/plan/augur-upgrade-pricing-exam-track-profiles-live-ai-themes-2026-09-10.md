# Augur upgrade: pricing, exam-track profiles, live AI, themes

## 1. Pricing and referral

New prices (replacing the current ones):

| Plan | Price |
| --- | --- |
| Basic monthly | ₦5,000 |
| Basic yearly | ₦25,000 |
| Lecturer Premium monthly | ₦8,000 |
| Lecturer Premium yearly | ₦30,000 |

- Lecturer Premium becomes the highlighted, recommended plan on the upgrade page (badge, larger card, listed first).
- The FOUNTAIN TEENS code changes from 20% to 50% off. Plan copy that mentions old savings amounts gets rewritten to match the new prices.

## 2. Study profile: who you are

Profile setup gains a short guided step:

- **I am a**: JAMB candidate, WAEC candidate, NECO candidate, or University student.
- **Stream** (for JAMB/WAEC/NECO): Science, Commercial, or Art.
- **Department + level** (for university students) — the existing fields, shown only for that path.

Stored on the study profile so every other feature can read it. Existing users keep working; the fields default to empty and a gentle prompt appears until they pick.

## 3. Augur AI knows who it's talking to

- The chat system prompt receives the track (JAMB / WAEC / NECO / university), stream or department, and level, so answers match the exam board and syllabus the student actually sits.
- Deep WAEC and NECO grounding: exam format, marking style, common question patterns per stream.
- **Usage learning**: a lightweight record of which parts of the site each student uses most (chat, library, drills, CGPA, predictor). Augur reads that summary and steers help toward what the student actually does, and nudges the underused tools.

## 4. Live internet knowledge

Augur gains a web-lookup ability, used only when a question needs current or verifiable outside information (news, this year's dates, syllabus changes, unfamiliar past questions). Results are summarised with sources shown under the answer. When lookup fails, Augur answers from its own knowledge and says so.

## 5. WAEC and NECO drills + CBT exam

- New drill modes in chat alongside JAMB Drill: **WAEC Drill** and **NECO Drill**, subject- and stream-aware, delivering past-question-style items one at a time with marking and explanations.
- The CBT exam page gains WAEC and NECO exam types with timed, subject-based papers, defaulting to the student's own stream and subjects. Questions are curated/verified before they appear; anything AI-produced is labelled as practice, never presented as a real past paper.

## 6. Diverse library

Library gets past-question sections for WAEC, NECO and JAMB, organised by subject and stream, on top of the existing university course notes. The list filters itself to the student's profile first ("For you"), with everything else still browsable.

## 7. Campus match by track

Matching adds track and stream to the scoring, so a WAEC science candidate is paired with fellow WAEC science candidates, and university students still match on course codes and department as today.

## 8. Light and dark mode

A theme toggle in the header switches between light and dark, remembers the choice, and follows the device setting the first time. All pages get checked for readable contrast in both.

## 9. Augur chat bubble everywhere

A floating Augur button sits on every page. Tapping it opens a compact chat panel that talks to the same Augur, carries the same profile context, and offers a link to the full chat page. It stays out of the way on phones and hides itself on the chat page.

## Technical notes

- Prices/referral live in `src/lib/payments-config.ts`; the server already re-checks the price on submission, so the discount can't be faked.
- Profile track fields are added to `study_profiles` (new columns, RLS unchanged) and surfaced in `/profile` and `/campus`.
- Usage learning writes a per-user counter row set (feature, count) and is folded into the existing durable memory summary used by `chat.functions.ts`.
- Web lookup runs server-side inside the chat server function as a tool call; keys stay on the server.
- Drill/exam banks live in a new catalogue module next to `library-catalogue.ts` so more questions can be added later without code changes elsewhere.
- Theme uses the existing `dark` class variant in `src/styles.css` with a small provider in `__root.tsx`.
- The floating bubble is one component rendered in `__root.tsx`, reusing the existing chat server function.

## Sequence

1. Pricing + referral (quick, user-visible).
2. Theme toggle + floating Augur bubble.
3. Profile track/stream + campus matching.
4. Augur profile awareness, usage learning, web lookup.
5. WAEC/NECO drills, CBT exam types, library past questions.
