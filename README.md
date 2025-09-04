# Quiz App (React + Vite)

Clean, responsive quiz application with scoring, results summary, and optional high-score persistence.

## Scripts

- `npm run dev` – start dev server at `http://localhost:5173/`
- `npm run build` – production build
- `npm run preview` – preview built app

## Features

- One question at a time with 4 options
- Prevent Next until an option is selected
- Previous navigation, final score, per-question results
- Progress indicator and 30s timer per question
- Responsive layout, keyboard accessible (Enter/Space), basic ARIA
- Local `public/questions.json` data source; high score saved to `localStorage`

## Add/Change Questions

1) Edit `public/questions.json` and append more items:

```json
{ "question": "Your question?", "correct": "Correct", "incorrect": ["Wrong A", "Wrong B", "Wrong C"] }
```

2) To show more than 10 questions, edit `src/pages/Quiz.jsx` and change/remove `.slice(0, 10)`.

## Architecture & Design

See `ARCHITECTURE.md` for structure and decisions.
