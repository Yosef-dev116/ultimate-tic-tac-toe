# Store listing

Copy and paste these fields into App Store Connect and Google Play Console.
Character limits are in brackets. Check them again when the stores change the rules.

## Name and subtitle

- **App name** [30 max]: Ultimate Tic-Tac-Toe
- **Subtitle (iOS)** [30 max]: A new puzzle every day
- **Short description (Play)** [80 max]: One new Ultimate Tic-Tac-Toe puzzle a day. Beat the AI and share your result.

The name may already be taken on a store. If so, use "Ultimate Tic-Tac-Toe Daily".

## Category

- **iOS primary:** Games > Puzzle
- **iOS secondary:** Games > Board
- **Play:** Games > Puzzle (Board is the second choice)

## Promotional text (iOS) [170 max]

A fresh strategy puzzle every day. Everyone gets the same one. Can you beat the AI before the clock resets?

## Description [4000 max]

Ultimate Tic-Tac-Toe is a strategy game played on nine small tic-tac-toe boards inside one big board.

One new puzzle arrives every day. It is the same for every player in the world. Play as X against a built-in AI that thinks several moves ahead. Win three small boards in a row to win the big board.

HOW IT WORKS
- Your move decides where your opponent plays next. Play the top-right cell and the AI must play in the top-right board.
- If that board is full or already won, your opponent can play anywhere.
- Win three small boards in a row to win the game.

FEATURES
- A new daily puzzle at 00:00 UTC
- A smart AI opponent
- A short tutorial that teaches the rules in a minute
- Haptic feedback on your moves and on the result
- Share a spoiler-free emoji summary of your result with friends
- Light and dark mode
- Works offline. No account, no ads, no tracking

Your results stay on your device.

## Keywords (iOS) [100 max, comma-separated, no spaces after commas]

tic tac toe,ultimate,daily,puzzle,strategy,board game,brain,logic,AI,two player

## What's new (first release)

First release. One new Ultimate Tic-Tac-Toe puzzle every day. Beat the AI and share your result.

## URLs

- **Support URL (both stores, required):** the page you publish from `SUPPORT.md`
- **Privacy policy URL (both stores, required):** the page you publish from `PRIVACY.md`
- **Marketing URL (optional):** https://ultimate-tic-tac-toe-theta-five.vercel.app

## Age rating answers

**Apple (App Store Connect age rating questionnaire).** Answer "None" or "No" to every item:

| Question | Answer |
| --- | --- |
| Cartoon or fantasy violence | None |
| Realistic violence | None |
| Sexual content or nudity | None |
| Profanity or crude humor | None |
| Alcohol, tobacco, or drug references | None |
| Horror or fear themes | None |
| Medical or treatment information | None |
| Gambling and contests | None |
| Simulated gambling | None |
| Unrestricted web access | No |
| User-generated content | No |
| Messaging or chat | No |

Expected result: 4+. The questionnaire changes from time to time. Answer what is true for the app.

**Google Play (IARC questionnaire).** Category: "Game". Answer "No" to violence, sexuality, language, controlled substances, gambling, user interaction, shared location, and digital purchases.
Expected result: Everyone (PEGI 3, ESRB Everyone).

## Privacy answers

- **Apple App Privacy ("nutrition label"):** Data Not Collected.
- **Google Play Data safety:** The app does not collect or share any user data. No data is encrypted in transit because none is sent. Answer "No" to the data deletion request question (nothing is held off the device).
- **Export compliance (Apple):** `ITSAppUsesNonExemptEncryption` is set to `false` in `Info.plist`. The app makes no network calls and uses no encryption of its own.
- **Ads:** No ads.
- **In-app purchases:** None.

## Other required fields

- **Copyright:** the year and the owner's name, for example "2026 Yosef Mekonnen".
- **Content rights (Apple):** the app contains no third-party content.
- **Target audience (Play):** 13 and older is the safest choice. Choosing under 13 starts the Families policy review.
- **App access (Play):** all functions are available without login.
- **Review notes (Apple):** "No account is needed. Tap a cell to play. The result screen has a Share button."

## Screenshots

Simulator captures from an iPhone 17 are in `store/screenshots/ios/`. Apple needs 6.9-inch and 6.5-inch iPhone sizes, so re-capture on the sizes App Store Connect asks for.
Play needs at least two phone screenshots. Capture them on an Android emulator.
