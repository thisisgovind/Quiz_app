# Architecture & Design Decisions

## Overview
A simple, maintainable React app built with Vite. The app shows one question at a time, tracks answers, computes a score, and presents a results summary. State is contained within pages; routing separates quiz flow from results.

## Structure
- `src/App.jsx` – App shell with routes (`/`, `/quiz`, `/results`) and shared header/footer.
- `src/pages/Quiz.jsx` – Core quiz logic: load questions, selection, navigation, timer, and score calculation.
- `src/pages/Results.jsx` – Final score and per-question correctness, with restart link.
- `public/questions.json` – Local data source (1 correct + 3 incorrect per question).
- `src/index.css` – Minimal, responsive styling with small enhancements and accessibility-conscious focus states.

## Data Model
Each question is normalized to:
```
{ id: number, question: string, correct: string, options: string[] }
```
`options` is a shuffled array of 4 options. Answers are stored as:
```
{ id: number, selected: string, correct: string }
```

## Flow
1. Load questions from `public/questions.json` and normalize.
2. For each question:
   - User selects an option (keyboard or mouse).
   - Next is enabled; Previous restores prior selection.
   - A 30s timer auto-locks current selection (or skips if none) and advances.
3. On completion, compute score and navigate to `/results` with state payload.

## State Management
- Hooks only (`useState`, `useEffect`, `useMemo`, `useCallback`).
- Local state per page to keep scope small; no global store required for this size.
- Navigation state carries results to the `Results` page.

## Accessibility
- Buttons for options (focusable, `aria-pressed`, keyboard activation with Enter/Space).
- Live timer announcements via text update; progress bar is decorative.
- Clear labels, color contrast, and focus outlines.

## Styling
- Vanilla CSS for portability; utility-like classes for consistency.
- Responsive at small screens; reduced-motion media query disables animations if preferred by user.

## Error Handling
- Loading and error states for data fetch.
- Graceful fallback when no questions are available.

## Extensibility
- Swap data source: replace fetch in `Quiz.jsx` to call Open Trivia DB; normalize fields similarly.
- Difficulty levels: add query params or routes that load alternate JSON files or API endpoints.
- Persistence: move transient state to a context if multi-page persistence is required.

## Trade-offs
- Simplicity over libraries: no global state, no CSS framework; faster to read and modify.
- Local JSON default to avoid network flakiness; API integration remains straightforward.

