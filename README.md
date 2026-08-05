# Ultimate Tic-Tac-Toe — Daily Puzzle

A premium-feeling, mobile-first Ultimate Tic-Tac-Toe game with a Wordle-style daily puzzle:
one new strategic challenge a day, identical for every player, playable against a built-in
AI opponent. Built with React, TypeScript, and Motion for React.

## The game

Ultimate Tic-Tac-Toe is played on a 3x3 grid of 3x3 tic-tac-toe boards.

- The overall (meta) board is won by winning three mini-boards in a row — horizontally,
  vertically, or diagonally — just like a normal game of tic-tac-toe played one level up.
- **The core rule:** whichever cell you play in a mini-board sends your opponent to the
  matching mini-board for their turn. Play the top-right cell, and your opponent must play
  somewhere in the top-right mini-board.
- If that target board is already won, drawn, or full, the redirect is void and your
  opponent gets a free choice — they can play in any mini-board that's still open.
- A mini-board that ends in a draw (filled with no three-in-a-row) is closed to further
  play and counts toward neither player when checking the meta-board for a win.
- The game ends the instant a meta-board line is completed, or in a draw once every
  mini-board is resolved with no meta-board winner.

## Daily challenge

Every day's puzzle is generated deterministically from the current UTC date — the same
seed produces the same opening position for every player, worldwide, the same way Wordle's
word-of-the-day works. There's no backend and no server-side puzzle store: the seed is
hashed from the date, and a short, legal opening sequence is played out from it before
control passes to you.

You play as X against the built-in AI (O), which searches with minimax and alpha-beta
pruning. Finish the puzzle once per day; your result (win, loss, or draw) is remembered
locally so reloading the page shows your completed result instead of letting you replay.
A "Share Result" button copies a Wordle-style emoji summary of your game.

## Local setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

The dev server prints a local URL (defaults to `http://localhost:5173`).

## Tests

```bash
npm test
```

Runs the Vitest suite covering the game engine (legal moves, win/draw detection, the
active-board redirect rule), the AI (always returns a legal move, always takes an
immediate win), and the daily puzzle generator (deterministic per date, UTC-safe).

## Production build

```bash
npm run build
```

Type-checks with `tsc -b` and produces an optimized static build in `dist/`. Preview it
locally with:

```bash
npm run preview
```

## Deployment (Vercel)

This is a static Vite build with no server-side code or environment variables required.

1. Push the repository to GitHub (see the commands your assistant provided alongside this
   README).
2. In Vercel, import the GitHub repository as a new project.
3. Framework preset: **Vite**. Vercel auto-detects the build command (`npm run build`) and
   output directory (`dist`) — no configuration file is required.
4. Deploy. Every subsequent push to the default branch redeploys automatically; other
   branches and PRs get their own preview URLs.

## Development reset procedure

A debug-only tool for rehearsing demos — it is not part of the normal player experience and
does not change production game behavior.

**In `npm run dev`:** a small "Reset daily puzzle (dev)" button appears in the bottom-left
corner. Clicking it clears today's completion state and reloads into the same daily puzzle.
This button is gated behind `import.meta.env.DEV` and is compiled out of production builds
entirely — it does not exist in `dist/`.

**On any build, including production**, via the browser devtools console:

```js
localStorage.setItem('uttt:dev-reset', 'true')
```

then reload the page. The app detects the flag on load, clears today's stored result, and
restarts the same daily puzzle (the puzzle is generated from a date-based seed, so it's
identical). The flag is one-shot and removes itself, so normal play afterward is unaffected.
