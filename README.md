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

Requires Node.js 20+ for the web app. The mobile tooling needs Node.js 22+.

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

## Mobile app

The web game also ships as a real iOS and Android app, built with [Capacitor](https://capacitorjs.com).
The app bundles the Vite build. It works offline and makes no network calls.

### Run it

Requires Node.js 22+ (Capacitor 8 needs it), Xcode for iOS, and Android Studio for Android.

```bash
npm install
npm run build && npx cap sync   # build the web app and copy it into ios/ and android/
npx cap open ios                # opens Xcode: pick a simulator and press Run
npx cap open android            # opens Android Studio: pick an emulator and press Run
```

Run `npm run build && npx cap sync` again after every change to `src/`.

Command-line debug builds:

```bash
# iOS Simulator
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17' -derivedDataPath /tmp/uttt-dd build CODE_SIGNING_ALLOWED=NO

# Android (needs JDK 21 and an Android SDK; the build targets Java 21, and Gradle 8.14 does not run on JDK 25 or newer)
cd android && ./gradlew assembleDebug
```

### Project layout

| Path | What it is |
| --- | --- |
| `capacitor.config.ts` | App id, app name, web directory (`dist`), splash and system bar settings |
| `src/native/` | All native-only code: platform check, haptics, share, startup. The rest of `src/` is plain web code |
| `ios/` | Xcode project (Swift Package Manager, no CocoaPods). Committed |
| `android/` | Android Studio project. Committed |
| `resources/` | Icon and splash sources (`*.png`, plus the SVGs in `resources/src/`) |
| `scripts/build-resources.mjs` | Redraws the `resources/` PNGs from the SVG marks |
| `store/` | Store listing text, privacy policy, support page, release guide, screenshots |

Regenerate icons and splash screens after you change `resources/`:

```bash
npm run resources   # optional: redraw the PNGs from scripts/build-resources.mjs
npm run cap:assets  # write every icon and splash size into ios/ and android/
```

### What is native

- Safe-area insets (`viewport-fit=cover`, `env(safe-area-inset-*)`), so nothing sits under the notch, Dynamic Island, or home indicator.
- System bars follow the light or dark appearance (Capacitor `SystemBars`).
- Haptics: a light tap when you place a move, and a success, error, or warning pattern when the game ends (`@capacitor/haptics`).
- The native share sheet for the daily result (`@capacitor/share`). The web build keeps the Web Share API and clipboard fallback.
- A launch splash screen (light and dark) that fades out when the board has painted (`@capacitor/splash-screen`).
- No pull-to-refresh or rubber-band bounce, no text selection or long-press menus on the board, and no double-tap zoom.
- Phones stay in portrait. Tablets can rotate.

Every native call checks `Capacitor.isNativePlatform()` first, so `npm run dev` and the Vercel build behave as before.

### Changing the app id

The app id is `com.yosefmekonnen.ultimatetictactoe`. Change it before the first store upload.
Stores treat the id as permanent after that. To change it, replace the string in these places:

1. `capacitor.config.ts`: `appId`.
2. iOS: `PRODUCT_BUNDLE_IDENTIFIER` in `ios/App/App.xcodeproj/project.pbxproj` (two places), or in Xcode under Signing & Capabilities.
3. Android: `namespace` and `applicationId` in `android/app/build.gradle`.
4. Android: `package_name` and `custom_url_scheme` in `android/app/src/main/res/values/strings.xml`.
5. Android: the `package` line in `MainActivity.java`, and move it to the matching folder under `android/app/src/main/java/`.

Then run `npm run build && npx cap sync`.

### Store release

See `store/RELEASING.md` (step-by-step for TestFlight and the Play internal testing track), `store/listing.md`, `store/PRIVACY.md`, and `store/SUPPORT.md`.

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
