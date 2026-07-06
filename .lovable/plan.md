
# Augur v2 — Phased Build Plan

Scope is large, so I'll ship in 3 phases across separate turns. Each phase is independently useful and testable. This turn implements **Phase 1** end-to-end.

---

## Phase 1 — AI Student Assistant + PDF/Flashcards + Read-to-Earn (this turn)

Replace the "talk to professors" concept with an **AI study buddy** (default, free with fair-use limits). Persist conversations. Let users upload PDFs/images, auto-generate flashcards, and earn XP by reading.

**What ships**
- `/chat` becomes threaded AI chat (per-user conversations persisted in DB).
- Composer supports PDF + image attachments (Supabase Storage bucket `chat-uploads`).
- On PDF/image upload: server function calls Lovable AI (Gemini multimodal) to extract text and generate ~10 flashcards → shown as an inline card deck in the chat + saved to `flashcards` table.
- **Read-to-earn**: each PDF has a reader view with page tracking. XP awarded per page (rate-limited to prevent farming: 1 XP/page, max 50 XP/PDF, requires ≥15s dwell time per page). XP stored in `user_xp` table.
- Leaderboard section on `/profile` (top 20 readers, opt-in via profile flag).
- Room UX polish: student→AI rooms only (`study-buddy`, `jamb-tutor`, `essay-coach`, `general`); "Lecturers" room is now a locked card → paywall waitlist.
- Reference chips: when AI cites a course code (e.g. `MTH 101`), it's rendered as a chip linking to a course-info popover.

**Data model (new tables, all with RLS + GRANTs)**
- `chat_threads` (id, user_id, title, room, created_at, updated_at)
- `chat_messages_v2` (id, thread_id, user_id, role: user|assistant, content, attachments jsonb, created_at) — old public `chat_messages` kept for legacy rooms (or migrated later).
- `pdf_documents` (id, user_id, storage_path, title, page_count, created_at)
- `flashcards` (id, user_id, source_pdf_id nullable, question, answer, deck_name, created_at)
- `user_xp` (user_id PK, xp int, level int, updated_at)
- `xp_events` (id, user_id, kind, points, meta jsonb, created_at) — audit + anti-farm
- Storage bucket `chat-uploads` (private, RLS on `auth.uid()` folder prefix)

**Server functions** (`createServerFn`, `requireSupabaseAuth`)
- `sendChatMessage({ threadId, content, attachments })` → streams Gemini response, persists both turns.
- `generateFlashcardsFromPdf({ pdfId })` → parses PDF via Gemini multimodal, returns deck.
- `awardReadingXp({ pdfId, page, dwellMs })` → validates dwell + dedupe, inserts `xp_events`, bumps `user_xp`.

**AI model**: `google/gemini-3-flash-preview` (default) via existing Lovable AI Gateway helper. System prompt tuned for Nigerian university curriculum.

---

## Phase 2 — Search Autocomplete, Filters, Course/Professor Index (next turn)

- Live autocomplete dropdown on `SiteHeader` search input (debounced, 200ms).
- `/search` gains filter chips: **All / Tools / Courses / Professors / Universities**.
- New `courses` and `professors` tables seeded from `course-catalogue.ts` + a curated professor list per school.
- Attach PDFs/images to a search query → AI answers ("What's in this syllabus?") — reuses Phase 1 upload pipeline.
- Smart cross-mapping: search `MTH101` also matches `MAT 101`, `Mathematics 101`, `Elementary Math` via a normalized `search_tokens` column.

---

## Phase 3 — Student Email Verification, Matric Validation, Lecturer Paywall (final turn)

- Signup: require `.edu`, `.edu.ng`, `.ac.ng`, or explicit school domain match against `schools` table. Reject Gmail/Yahoo on signup form (client + server-side check in a trigger).
- Enforce Supabase email confirmation (`auto_confirm_email: false`).
- CGPA predictor: require matric number matching school-specific regex (e.g. UNILAG `\d{9}`, UI `\d{6}`). Store on `profiles`. Show a "Verified student" badge only when both email domain + matric format pass.
- **Lecturer chat paywall** (Paddle, per pre-enable guidance):
  - Run `recommend_payment_provider` → enable Paddle.
  - Products: "Lecturer Chat Monthly" (10 requests/day cap), "Lecturer Chat Yearly".
  - Meanwhile the lecturers room is a waitlist (email capture already exists) + join-queue table.
  - Real-lecturer side: `lecturer_applications` table + admin role gate for a future `/lecturer-dashboard`.
- Rate limit enforced via `daily_usage(user_id, feature, count, day)` table checked in the send server fn.

---

## Technical notes (Phase 1)

- Streaming via `streamText` + `toUIMessageStreamResponse` in `src/routes/api/chat.ts`; UI switches to `useChat` from `@ai-sdk/react` with `DefaultChatTransport`.
- Attachments uploaded client-side to Storage first, then their paths passed to `sendChatMessage`; the server function signs a URL and passes it to Gemini as an `image_url` / PDF `file` block.
- PDF reader is a lightweight in-app viewer (`pdfjs-dist`) — no external link. Tracks `visiblePage` + dwell timer, POSTs to `awardReadingXp` on page change.
- Anti-farming: server checks (a) page must be new for this user+pdf, (b) `dwellMs >= 15000`, (c) daily cap 200 XP.
- Reference chip parser: regex `\b[A-Z]{2,4}\s?\d{3}\b` in assistant markdown → wrap in `<CourseChip code="MTH 101">`.
- Old `chat_messages` (rooms) table stays for now; Phase 1 keeps a read-only "Legacy rooms" toggle so no data is lost.

---

## Files (Phase 1)

**New**
- `supabase/migrations/…_ai_chat_and_xp.sql`
- `src/routes/api/chat.ts` (streaming route)
- `src/lib/ai-gateway.server.ts` (if not present)
- `src/lib/chat.functions.ts` (`sendChatMessage`, `generateFlashcardsFromPdf`, `awardReadingXp`, thread CRUD)
- `src/lib/course-chip.tsx`
- `src/components/chat/thread-list.tsx`, `message-list.tsx`, `composer.tsx`, `flashcard-deck.tsx`, `pdf-reader.tsx`, `xp-badge.tsx`
- `src/routes/chat.$threadId.tsx` (thread route — per chat-agent-ui-contract)
- `src/routes/read.$pdfId.tsx` (PDF reader + XP tracking)

**Edited**
- `src/routes/chat.tsx` → redirects to newest thread or creates one; renders thread list on desktop, drawer on mobile.
- `src/routes/profile.tsx` → adds XP card + leaderboard section.
- `src/components/site-header.tsx` → adds XP pill.
- `src/start.ts` → ensure `attachSupabaseAuth` middleware present.

---

Reply **approve** to start Phase 1, or tell me what to change.
