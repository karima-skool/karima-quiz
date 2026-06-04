# Karima Academy Course Finder Quiz — Full Project Context

> **Purpose of this file:** A complete reference for any developer (or AI assistant) picking up this project. Reading this file alone should give full understanding of the codebase without needing to open any other file. Keep this updated when making significant changes.

---

## 1. What This App Is

A standalone Next.js quiz application embedded via `<iframe>` into the Karima Academy Framer website. Users answer 9 questions (one per screen) about their Islamic learning background, interests, goals, and lifestyle. The app returns:

1. A personalised profile summary paragraph
2. A **Live & Weekly Classes** section — all currently-running live courses, always shown regardless of quiz answers
3. **Recommended courses** — top matches based on quiz answers (live courses excluded to avoid duplication)

All quiz responses are saved to Supabase on completion.

**GitHub:** `https://github.com/karima-skool/karima-quiz`
**Branches:** `main` (production — Railway deploys from here) | `dev` (all development)
**Supabase project:** `qzwhgtqcbfwprlpktdfo` (shared with the karima-learn app)

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript (strict) |
| Styling | Inline CSS styles throughout — Tailwind installed but only used for `@tailwind base/components/utilities` reset in `globals.css`. **Do not use Tailwind colour utility classes.** |
| Font | Poppins 400/500/600/700 via `next/font/google` |
| Database | Supabase PostgreSQL |
| File storage | Supabase Storage bucket `course-thumbnails` (public) |
| Hosting | Railway |

---

## 3. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://qzwhgtqcbfwprlpktdfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Critical:** `NEXT_PUBLIC_` variables are **baked into the client bundle at `next build` time**. They must exist in Railway's environment variables **before** any build is triggered. If they are absent at build time, the Supabase client will be `null` in production and all quiz response saves will silently fail. The console logs prefixed `[quiz]` in `ResultsScreen.tsx` will reveal this in Railway deployment logs.

Local development uses `.env.local` which already has both values.

---

## 4. Design System

All values are used as inline CSS. Do not add Tailwind colour classes.

| Token | Value | Usage |
|---|---|---|
| Page background | `#ffffff` | All screens except intro |
| Intro hero | `linear-gradient(135deg, #f0ebff 0%, #e8e0ff 50%, #ede8ff 100%)` | Intro screen background |
| Primary text / headings | `#040313` | H1, H2, H3 |
| Body text | `#000000` | Paragraphs, descriptions |
| Muted text | `#5e5e5e` | Subheadings, labels, secondary info |
| Accent purple | `rgb(129, 79, 255)` | Buttons, links, badges, schedule lines, scholar names |
| Deep purple | `rgb(63, 15, 201)` | Gradient endpoint |
| Primary button | `linear-gradient(155deg, rgb(214,228,255) -25%, rgb(129,79,255) 22%, rgb(63,15,201) 76%, rgb(212,228,255) 128%)` | Begin, Continue, Enrol, Submit |
| Button border-radius | `24px` | All primary action buttons |
| Card border-radius | `16px` | Course cards, profile card |
| Card border | `1px solid #ede8ff` | Course cards |
| Card shadow | `0 2px 12px rgba(129,79,255,0.08)` | Course cards |
| Purple tint bg | `rgba(129,79,255,0.06)` | Profile summary card background |
| Purple tint border | `rgba(129,79,255,0.2)` | Profile summary card border |
| Option selected bg | `rgba(129,79,255,0.08)` | Selected quiz option |
| Option selected border | `1.5px solid rgb(129,79,255)` | Selected quiz option |
| Option unselected border | `1px solid #e0e0e0` | Unselected quiz option |
| Option disabled bg | `#f5f5f5` | Greyed-out at-max options |
| Progress bar track | `#e8e0ff` | ProgressBar background |
| Progress bar fill | `linear-gradient(90deg, rgb(129,79,255), rgb(63,15,201))` | ProgressBar active fill |
| View all courses button | `1px solid rgb(129,79,255)`, white bg, purple text, `border-radius: 20px` | Outlined secondary button |

---

## 5. Project File Structure

```
karima-quiz/
├── app/
│   ├── globals.css           # Poppins font-family, white/black body, no overflow rules
│   ├── layout.tsx            # Root layout — loads Poppins, sets white background on html+body
│   └── page.tsx              # Root page — screen state machine (intro/quiz/results/browse)
├── components/
│   ├── IntroScreen.tsx       # Welcome screen with 3-row scrolling thumbnail banner
│   ├── QuizScreen.tsx        # Step controller — all 9 questions + conditional Q1b
│   ├── ResultsScreen.tsx     # Results screen — profile, live classes, recommendations
│   ├── BrowseScreen.tsx      # All Courses grid — accessed from results nav
│   ├── LiveCourseCard.tsx    # Card for live/weekly courses (used in ResultsScreen)
│   ├── CourseCard.tsx        # Card for recommended courses (used in ResultsScreen)
│   ├── ProgressBar.tsx       # Step counter + purple gradient fill bar
│   ├── SingleSelect.tsx      # Radio-style single-choice option list
│   ├── MultiSelect.tsx       # Checkbox-style multi-choice with optional cap
│   └── TextInput.tsx         # Free-text textarea with character counter
├── lib/
│   ├── types.ts              # QuizAnswers interface + EMPTY_ANSWERS constant
│   ├── recommend.ts          # Course type, scoring logic, profile summary builder
│   └── supabase.ts           # Supabase client factory (null-safe)
├── data/
│   └── courses.json          # All 41 courses — single source of truth
├── supabase/
│   └── schema.sql            # Table DDL + migration history (documentation only — already applied live)
└── .claude/
    └── launch.json           # Preview server config (port 3002, used by Claude Code preview tool)
```

---

## 6. App Flow — Screen State Machine

`app/page.tsx` is a client component that owns the entire app state:

```typescript
type Screen = "intro" | "quiz" | "results" | "browse";

// State
const [screen, setScreen]       // current screen
const [answers, setAnswers]     // QuizAnswers — accumulates through quiz
const [sessionId]               // UUID generated once on page load, never changes
```

**Transitions:**
```
intro  →  quiz  →  results  →  browse
                      ↑____________|
                   (back preserves answers; no recalculation)
```

- `handleBegin` — `intro → quiz`
- `handleComplete(finalAnswers)` — stores answers in state, `quiz → results`
- `handleRestart` — resets answers to `EMPTY_ANSWERS`, `results → intro`
- `handleBrowse` — `results → browse`
- `handleBackToResults` — `browse → results` (answers unchanged, results re-render from same answers)

---

## 7. lib/types.ts — Full Contents

```typescript
export interface QuizAnswers {
  q1: string;       // prior learning — single select
  q1b: string[];    // subjects studied — multi-select (conditional)
  q1b_other: string;
  q2: string;       // motivation — single select
  q3: string[];     // topic tags — multi-select, max 3, stores tag keys not labels
  q4: string;       // life stage — single select
  q4_other: string;
  q5: string;       // time commitment — single select
  q6: string[];     // format preference — multi-select, max 2
  q7: string;       // free text: topic interest (optional)
  q8: string;       // free text: current struggle (optional)
  q9: string;       // age group — single select, optional (can be deselected)
}

export const EMPTY_ANSWERS: QuizAnswers = {
  q1: "",
  q1b: [],
  q1b_other: "",
  q2: "",
  q3: [],
  q4: "",
  q4_other: "",
  q5: "",
  q6: [],
  q7: "",
  q8: "",
  q9: "",
};
```

**Note:** `QuizAnswers` is also redeclared in `lib/recommend.ts`. Both must be kept in sync.

---

## 8. lib/recommend.ts — Full Contents and Logic

```typescript
import coursesData from "@/data/courses.json";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  short_description: string;
  topic_tags: string[];
  difficulty: string;
  time_commitment: string;       // "less-than-1hr" | "1-2hrs" | "3-5hrs"
  format: string;                // "recorded" | "live-online" | "in-person"
  scholar: string;               // "TBC" renders as "Coming soon" in cards
  signup_url: string;
  thumbnail_url: string;         // empty string = no image shown
  active: boolean;               // false = hidden everywhere
  is_live?: boolean;             // true = appears in Live & Weekly Classes
  live_day?: string;             // e.g. "Wednesdays"
  live_time?: string;            // e.g. "8:00 PM" or "TBC"
  live_frequency?: string;       // "Weekly" | "Bi-weekly" | "Monthly"
  live_next_date?: string;       // e.g. "14th June"
  live_series?: string;          // e.g. "Currently: Rulings of Marriage"
}

export interface QuizAnswers {
  q1: string; q1b: string[]; q1b_other: string; q2: string;
  q3: string[]; q4: string; q4_other: string; q5: string;
  q6: string[]; q7: string; q8: string; q9: string;
}

export interface ScoredCourse {
  course: Course;
  score: number;
  matchReasons: string[];        // e.g. ["Recommended because you're interested in Fiqh."]
}

// ─── Tag labels (display names for Q3 tag keys) ───────────────────────────────

export const TAG_LABELS: Record<string, string> = {
  aqeedah:         "Islamic belief",
  fiqh:            "Fiqh",
  seerah:          "Seerah",
  "quran-tafseer": "Qur'an & Tafseer",
  arabic:          "Arabic",
  "family-marriage": "family life",
  spirituality:    "spirituality",
  eschatology:     "eschatology",
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

// Maps Q5 answer string → time_commitment key used in courses.json
const TIME_MAP = {
  "Less than 1 hour — I need something light and flexible": "less-than-1hr",
  "1–2 hours — I can commit to a short course": "1-2hrs",
  "3–5 hours — I'm ready for something more structured": "3-5hrs",
  "As much as it takes — I'm serious about this": "any",
};

// Generates the "Recommended because..." line for a course
function getMatchReasons(course: Course, answers: QuizAnswers): string[] {
  const matchedTags = course.topic_tags.filter(t => answers.q3.includes(t));
  if (matchedTags.length === 0) return [];
  const labels = matchedTags.map(t => TAG_LABELS[t] ?? t);
  return [`Recommended because you're interested in ${labels.join(" and ")}.`];
}

// ─── Exported functions ───────────────────────────────────────────────────────

export function getRecommendations(answers: QuizAnswers): {
  results: ScoredCourse[];
  topCourse: Course;
} {
  // 1. Filter active courses only
  const courses = (coursesData as Course[]).filter(c => c.active);
  const preferredTime = TIME_MAP[answers.q5] ?? "any";

  // 2. Score each course
  const scored = courses.map(course => {
    let score = 0;
    // Primary signal: topic tag matches with Q3
    score += course.topic_tags.filter(t => answers.q3.includes(t)).length;
    // Bonus: time commitment match (adds 0.5, not a hard filter)
    if (preferredTime !== "any" && course.time_commitment === preferredTime) {
      score += 0.5;
    }
    return { course, score, matchReasons: getMatchReasons(course, answers) };
  });

  // 3. Sort descending
  scored.sort((a, b) => b.score - a.score);

  const topCourse = scored[0].course; // always the highest scorer

  // 4. Return top 3 with score > 0; fallback to best scorer if none match
  let results = scored.filter(s => s.score > 0).slice(0, 3);
  if (results.length === 0) {
    results = [scored[0]]; // best scorer regardless
  }

  return { results, topCourse };
}

// Generates the profile summary paragraph shown at top of results
export function buildProfileSummary(answers: QuizAnswers): string {
  // Maps Q1 answer → prose description of learning level
  // Maps Q5 answer → prose time commitment
  // Maps Q2 answer → prose motivation
  // Builds: "You're [level], with a keen interest in [topics]. You're looking to [motivation],
  //          and can commit around [time] a week to learning. [closing sentence]"
  // If q4_other is filled: closing mentions situation-specific tailoring
}
```

**Important:** `results` from `getRecommendations()` includes ALL scored active courses including live ones. `ResultsScreen` applies a second filter — `results.filter(r => r.course.is_live !== true)` — to produce `recommendedResults`, preventing live courses from appearing in both the Live section and the Recommended section.

---

## 9. lib/supabase.ts

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Returns null if env vars are missing (e.g. not set before Railway build)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
```

---

## 10. Component Reference

### `IntroScreen` — `components/IntroScreen.tsx`

**Props:** `{ onBegin: () => void }`

**What it renders:**
- White nav bar: "KARIMA ACADEMY" in purple uppercase
- Lavender gradient hero section (vertically centred, `justify-content: center`):
  - White icon card (☪ symbol, 56×56px, 16px border-radius)
  - H1: "Find Your Path"
  - Subheading: "Starting your Islamic learning journey can feel overwhelming. Answer a few questions and we'll match you with the right course for where you are right now."
  - Purple gradient "Begin" button (calls `onBegin`)
- 3-row auto-scrolling thumbnail banner:
  - Thumbnails pulled from `courses.json` at build time, filtered to non-empty `thumbnail_url`
  - Array split into 3 groups (12/12/11), each duplicated for seamless loop
  - Row 1: scrolls left, 35s | Row 2: scrolls right, 28s | Row 3: scrolls left, 40s
  - CSS `@keyframes` only — no JS scroll
  - Thumbnail size: 160px height × 284px width (16:9), 10px border-radius, 14px gap
  - Full-width container, 60px fade masks on both edges via `mask-image`
  - 40px margin above banner, 48px padding below

---

### `QuizScreen` — `components/QuizScreen.tsx`

**Props:** `{ onComplete: (answers: QuizAnswers) => void }`

**State:** `answers: QuizAnswers`, `stepIndex: number`, `visible: boolean` (for fade transition)

**Step sequence:**

| Step | ID | Question | Type | Required | Options/Notes |
|---|---|---|---|---|---|
| 1 | q1 | "Have you studied Islam formally before?" | SingleSelect | Yes | 4 options |
| 2* | q1b | "What have you studied before?" | MultiSelect | No | 8 options; \*only shown if q1 ≠ "No, I'm just getting started" |
| 3 | q2 | "What's bringing you to Islamic learning right now?" | SingleSelect | Yes | 5 options |
| 4 | q3 | "Which topics interest you most? Pick up to three." | MultiSelect (max 3) | Yes | 8 options; stores tag keys, not labels |
| 5 | q4 | "Which best describes where you are right now?" | SingleSelect + Other | Yes | 6 options; "Other" reveals text input |
| 6 | q5 | "How much time can you commit each week?" | SingleSelect | Yes | 4 options |
| 7 | q6 | "How do you prefer to learn?" | MultiSelect (max 2) | Yes | 5 options |
| 8 | q7 | "What topic have you always wanted to learn more about?" | TextInput 200 chars | No | Optional |
| 9 | q8 | "What are you finding most difficult about practising Islam?" | TextInput 200 chars | No | Optional |
| 10 | q9 | "Which age group do you fall into?" | Inline SingleSelect (toggle) | No | 7 options; clicking selected option deselects it |

**Progress bar totals:** 9 if q1b skipped, 10 if q1b shown.

**Q3 options and their internal tag values:**
```
"Islamic belief and theology (Aqeedah)" → "aqeedah"
"Rulings and Islamic law (Fiqh)"        → "fiqh"
"The life of the Prophet ﷺ (Seerah)"   → "seerah"
"Understanding the Qur'an (Tafseer)"    → "quran-tafseer"
"Arabic language"                        → "arabic"
"Family, marriage and relationships"    → "family-marriage"
"Spirituality and the inner self"       → "spirituality"
"End times and eschatology"             → "eschatology"
```

**Q1b options:** Aqeedah / Islamic belief | Fiqh / rulings | Seerah | Quran / Tafseer | Arabic | Spirituality | Hadith sciences | Other (reveals text input)

**Q4 options:** Young adult figuring out faith | Married/about to be | Parent | Seeking knowledge | Going through difficult period | Other (reveals text input)

**Transition:** 200ms opacity fade between steps via `setVisible(false) → setTimeout → fn() → setVisible(true)`.

**Continue button:** Disabled (grey gradient) unless `canAdvance()` returns true. On final step shows "See my recommendations →".

---

### `ResultsScreen` — `components/ResultsScreen.tsx`

**Props:** `{ answers: QuizAnswers, sessionId: string, onRestart: () => void, onBrowse: () => void }`

**On mount:** Fires Supabase insert once (`saved` flag prevents double-fire). Logs `[quiz]` prefixed messages to console.

**Layout (top to bottom):**

1. **Sticky nav bar** — "Your Results" (left, dark bold) + "View all courses →" (right, outlined purple button, calls `onBrowse`). `position: sticky, top: 0, z-index: 10`.

2. **Content area** — `max-width: 640px`, centred, `padding: 40px 24px 60px`

3. **"Your Learning Path"** heading + muted subheading

4. **Profile summary card** — purple-tinted background (`rgba(129,79,255,0.06)`), purple border, "YOUR PROFILE" label, prose from `buildProfileSummary(answers)`

5. **Live & Weekly Classes section** — shown only if `liveCourses.length > 0`
   - `liveCourses = courses.filter(c => c.active === true && c.is_live === true)`
   - H2 heading + subheading: "Join a live class — new sessions every week."
   - Responsive grid: single column mobile, 2-column at 768px+ via `.live-grid` CSS class with `<style>` tag
   - Uses `<LiveCourseCard course={course} userTags={answers.q3} />`

6. **Recommended courses section**
   - `recommendedResults = getRecommendations(answers).results.filter(r => r.course.is_live !== true)`
   - Single-column flex list
   - Uses `<CourseCard scored={scored} rank={i + 1} />`

7. **Fallback nudge** — left-bordered purple block: "Not sure where to start? ...beginning here — **[topCourse.title]**."

8. **"Start again"** button — calls `onRestart`, resets to intro

---

### `LiveCourseCard` — `components/LiveCourseCard.tsx`

**Props:** `{ course: Course, userTags: string[] }`

**Frequency label mapping:**
```
"Weekly"    → "Weekly Class"
"Bi-weekly" → "Bi-weekly Class"
"Monthly"   → "Monthly Class"
```

**Card layout (top to bottom):**
- Thumbnail (16:9, full width, no badge)
- Schedule line: `live_day · live_time · live_frequency_label` — purple, 13px, bold, above title
- H3 title
- `live_series` (if set) — muted, 13px
- Scholar name — purple, 13px, 500 weight
- `short_description` — 14px, black, 1.6 line-height
- `live_next_date` (if set) — "Next class: [date]", muted
- "Recommended because…" line — purple italic, 13px, above border `1px solid #ede8ff`
  - Generated by `getRecommendReason(course, userTags)`:
    - Matches `course.topic_tags` against `userTags` (Q3 answers)
    - If matches: "Recommended because you're interested in [labels joined by 'and']."
    - If no matches: "Recommended based on your learning goals."
- Purple gradient "Enrol now →" button, 24px border-radius, opens in new tab

---

### `CourseCard` — `components/CourseCard.tsx`

**Props:** `{ scored: ScoredCourse, rank: number }` (rank is currently unused visually but kept for potential future use)

**Format badge logic:** `course.is_live ? "Live online" : FORMAT_LABELS[course.format]`

**Card layout:**
- Thumbnail (16:9, full width) — only if `thumbnail_url` is non-empty
- Top row: H3 title (flex: 1) + format badge (purple pill, `#f0ebff` background)
- Scholar name — purple, 13px, 500 weight
- `short_description` — 14px, black
- "Recommended because…" line (from `matchReasons[0]`) — purple italic, above `#ede8ff` border
- "Enrol now →" button

---

### `BrowseScreen` — `components/BrowseScreen.tsx`

**Props:** `{ onBack: () => void }`

- Nav bar: "← Back to my results" (purple, calls `onBack`) + "KARIMA ACADEMY" (right)
- Heading: "All Courses" + course count subtitle
- Responsive grid: `repeat(auto-fill, minmax(280px, 1fr))`, 24px gap
- Shows all `active` courses (32 currently)
- Each card: thumbnail → format badge → title → scholar → topic tag pills → "Enrol now →"
- **No LIVE badge** on thumbnails (removed by design — badge was covering thumbnails and wording was inaccurate)
- TAG_LABELS in BrowseScreen use title-case: "Aqeedah", "Family & Marriage" etc. (slightly different from recommend.ts which uses sentence-case — this is intentional for the pill display)

---

### `ProgressBar` — `components/ProgressBar.tsx`

**Props:** `{ current: number, total: number }`

- "Question X of Y" label (muted, left) + percentage (purple, right)
- 5px tall track (`#e8e0ff`) + purple gradient fill, animated width transition
- Contained to `max-width: 600px`, centred

---

### `SingleSelect` — `components/SingleSelect.tsx`

**Props:** `{ question, options, value, onChange, showOtherInput?, otherLabel?, otherValue?, onOtherChange? }`

- H2 question + flex column of option buttons
- Selected: `rgba(129,79,255,0.08)` bg, purple border, purple filled radio circle
- Unselected: white bg, `#e0e0e0` border, grey empty circle
- `showOtherInput=true`: when value === "Other", reveals a text input below the options

---

### `MultiSelect` — `components/MultiSelect.tsx`

**Props:** `{ question, options, selected, onChange, maxSelect?, maxNote?, showOtherInput?, otherValue?, onOtherChange?, selectedAsLabels? }`

- Same visual style as SingleSelect but with square checkbox indicators
- `maxSelect`: when reached, all unselected options get `opacity: 0.5`, `cursor: not-allowed`, `background: #f5f5f5`
- `maxNote`: shown above options when cap is hit (e.g. "You've selected 3 — deselect one to change your choice.")
- `selectedAsLabels`: used for Q3 where internal values are tag keys but display labels differ — pass current tags as labels for the display comparison

---

### `TextInput` — `components/TextInput.tsx`

**Props:** `{ question, value, onChange, maxLength?, optional? }`

- H2 question + optional italic label ("Optional — skip if you prefer")
- Textarea: 4 rows, white bg, `#e0e0e0` border, purple border on focus
- Character counter: "X/200" right-aligned, muted

---

## 11. courses.json — Full Data Structure

Every course object has this shape:

```json
{
  "id": "KA-002",
  "title": "I Asked the Prophet ﷺ",
  "short_description": "A transformative journey built on one simple question...",
  "topic_tags": ["seerah", "spirituality"],
  "difficulty": "beginner",
  "time_commitment": "1-2hrs",
  "format": "recorded",
  "scholar": "Shaykh Sulayman Van Ael",
  "signup_url": "https://www.skool.com/karima/classroom/XXXXXXXX",
  "thumbnail_url": "https://assets.skool.com/f/936327fe8f9041e3845adc5932105150/HASH.jpg",
  "active": true,
  "is_live": true,
  "live_day": "Sundays",
  "live_time": "5:00 PM",
  "live_frequency": "Weekly",
  "live_next_date": "14th June",
  "live_series": "Currently: Rulings of Marriage"
}
```

### Field Reference

| Field | Type | Required | Allowed Values / Notes |
|---|---|---|---|
| `id` | string | Yes | `"KA-NNN"` or `"KA-COL-NNN"` |
| `title` | string | Yes | Display title |
| `short_description` | string | Yes | 1–3 sentences shown on cards |
| `topic_tags` | string[] | Yes | Array of tag keys from TAG_LABELS |
| `difficulty` | string | Yes | `"beginner"` \| `"intermediate"` |
| `time_commitment` | string | Yes | `"less-than-1hr"` \| `"1-2hrs"` \| `"3-5hrs"` |
| `format` | string | Yes | `"recorded"` \| `"live-online"` \| `"in-person"` |
| `scholar` | string | Yes | Name string; `"TBC"` renders as "Coming soon" |
| `signup_url` | string | Yes | Skool classroom URL or `/about` fallback |
| `thumbnail_url` | string | Yes | Empty string `""` = no image shown; must be HTTP 200 accessible from any origin |
| `active` | boolean | Yes | `false` = hidden from all UI and recommendation scoring |
| `is_live` | boolean | No | `true` = appears in Live & Weekly Classes section |
| `live_day` | string | If `is_live` | e.g. `"Wednesdays"`, `"Saturdays"` |
| `live_time` | string | If `is_live` | e.g. `"8:00 PM"`, `"TBC"` |
| `live_frequency` | string | If `is_live` | `"Weekly"` → "Weekly Class" \| `"Bi-weekly"` → "Bi-weekly Class" \| `"Monthly"` → "Monthly Class" |
| `live_next_date` | string | Optional | e.g. `"14th June"` — shown as "Next class: 14th June" |
| `live_series` | string | Optional | e.g. `"Currently: Rulings of Marriage"` — shown in muted text below title |

### Current Counts
- **Total:** 41 courses
- **Active:** 32 (shown in browse grid and used for recommendations)
- **Inactive:** 9 (hidden everywhere)
- **Live:** 5

### Active Live Courses

| ID | Title | Schedule |
|---|---|---|
| KA-002 | I Asked the Prophet ﷺ | Sundays · 5:00 PM · Weekly |
| KA-004 | Tafseer of the Qur'an | Fridays · 8:00 PM · Weekly |
| KA-005 | Weekly: Life of The Prophet ﷺ | Thursdays · 7:00 PM · Weekly |
| KA-006 | Family In The Qur'an | Saturdays · TBC · Bi-weekly (Next: 14th June) |
| KA-015 | Weekly: Fiqh — Islamic Rulings | Wednesdays · 8:00 PM · Weekly (Currently: Rulings of Marriage) |

### Inactive Courses (hidden)
KA-013, KA-019, KA-026, KA-030, KA-035, KA-039, KA-040, KA-041, KA-042

### Thumbnail Sources
- **Skool CDN** (`assets.skool.com`): most courses — some URLs have hotlink protection (return HTTP 403 when loaded cross-origin from the quiz app domain)
- **Supabase Storage** (`qzwhgtqcbfwprlpktdfo.supabase.co/storage/v1/object/public/course-thumbnails/{filename}`): 13 re-hosted courses — always 200, no hotlink restriction
- Filenames in the storage bucket are URL-encoded (spaces → `%20`, `&` → `%26`, `?` → `%3F`)
- Before bulk-updating thumbnails, run the HTTP diagnostic script to verify status codes

---

## 12. Supabase Schema

**Project ID:** `qzwhgtqcbfwprlpktdfo`
**Region:** AWS EU North 1

### Table: `quiz_responses`

All migrations have been applied to the live database. The schema as it exists now:

```sql
create table quiz_responses (
  id                     uuid          primary key default gen_random_uuid(),
  created_at             timestamptz   default now(),
  session_id             text,
  q1_prior_learning      text,
  q1b_prior_subjects     text[],
  q1b_other_text         text,
  q2_motivation          text,
  q3_topic_tags          text[],
  q4_life_stage          text,
  q4_other_text          text,
  q5_time_commitment     text,
  q6_format_preference   text[],       -- was text, migrated to text[] for multi-select
  q7_interest_text       text,
  q8_struggle_text       text,
  recommended_course_ids text[],
  q9_age_group           text          -- added later via ALTER TABLE
);
```

### Column Mapping (quiz answer → Supabase column)

| Quiz Field | Column | Type | Saved Value |
|---|---|---|---|
| `sessionId` | `session_id` | text | UUID string |
| `answers.q1` | `q1_prior_learning` | text | Selected option string or null |
| `answers.q1b` | `q1b_prior_subjects` | text[] | Array of selected labels or null |
| `answers.q1b_other` | `q1b_other_text` | text | Text or null |
| `answers.q2` | `q2_motivation` | text | Selected option string or null |
| `answers.q3` | `q3_topic_tags` | text[] | Array of tag keys or null |
| `answers.q4` | `q4_life_stage` | text | Selected option string or null |
| `answers.q4_other` | `q4_other_text` | text | Text or null |
| `answers.q5` | `q5_time_commitment` | text | Selected option string or null |
| `answers.q6` | `q6_format_preference` | text[] | Array of selected options or null |
| `answers.q7` | `q7_interest_text` | text | Text or null |
| `answers.q8` | `q8_struggle_text` | text | Text or null |
| `answers.q9` | `q9_age_group` | text | Selected option string or null |
| computed | `recommended_course_ids` | text[] | IDs of all scored results (including live) |

Empty strings and empty arrays are coerced to `null` before insert.

### Storage Bucket: `course-thumbnails`

Public bucket — no auth required to read. Files are listed using the service role key. File access via `GET /storage/v1/object/public/course-thumbnails/{encoded-filename}`.

---

## 13. Known Issues and Gotchas

### NEXT_PUBLIC_ variables must be set before Railway build
`NEXT_PUBLIC_` vars are inlined at `next build` time. If they are absent when Railway builds the app, the Supabase client is `null` and saves fail silently. The diagnostic console logs (`[quiz] supabase client: NULL`) will confirm this in Railway logs.

### .next cache and JSON module updates
The Next.js dev server caches JSON module imports. If `courses.json` is updated while the dev server is running, the server may serve the old version. Always `rm -rf .next` and restart the dev server after JSON changes. This caused the live section to appear empty after `is_live` was added.

### Running `npm run build` during a dev session
Building creates production artefacts in `.next` that conflict with the dev server's expected chunk paths. After any build, JS chunks return 404 to the browser, React fails to hydrate, and buttons stop working. Fix: `rm -rf .next` then restart with `npm run dev`.

### Supabase free tier pausing
The project is on the free tier and pauses after 7 days of inactivity. All DB/storage connections fail until manually unpaused in the Supabase dashboard.

### Skool CDN hotlink protection
Some `assets.skool.com` URLs return HTTP 403 when loaded cross-origin (i.e., from the quiz app domain). Always verify new Skool thumbnail URLs with the diagnostic fetch script before saving to `courses.json`. Affected courses should be re-hosted in the `course-thumbnails` Supabase Storage bucket.

### TAG_LABELS defined in two places
`TAG_LABELS` is exported from `lib/recommend.ts` and also defined locally (with different casing) inside `components/BrowseScreen.tsx`. The BrowseScreen version uses title-case ("Aqeedah", "Family & Marriage") for tag pills; recommend.ts uses sentence-case ("Islamic belief", "family life") for recommendation prose. This is intentional — keep them separate.

### QuizAnswers duplicated in types.ts and recommend.ts
The `QuizAnswers` interface exists in both `lib/types.ts` and `lib/recommend.ts`. Both must be kept in sync if fields are added or changed.

---

## 14. Branch and Deployment Strategy

- **`dev` branch:** All development happens here. Commit frequently, push to origin/dev.
- **`main` branch:** Production. Only updated by merging dev using fast-forward: `git merge dev --ff-only`. Never commit directly to main.
- **Railway:** Connected to the `main` branch. Redeploys automatically on every push to main.
- **TypeScript check before committing:** `PATH="/usr/local/bin:$PATH" node node_modules/.bin/tsc --noEmit` — the build also catches errors but running tsc first is faster.
- **Git author:** Must be `skool@karima.org.uk` for GitHub pushes from this machine.

---

## 15. Phase 2 — Scoped but Not Yet Built

These features were agreed upon but explicitly deferred:

1. **AI-generated recommendations** — Anthropic API integration. Currently, profile summary and course matching are fully rule-based (hardcoded logic in `buildProfileSummary` and `getRecommendations`).
2. **Course data from Supabase** — Currently all course data is sourced from `data/courses.json` at build time (static). Phase 2 would fetch from Supabase at runtime, enabling real-time updates without redeployment.
3. **Email capture** — Collect user email on the results screen before or after showing recommendations, and store it alongside the quiz response.
