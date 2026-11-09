# Releasing to TestFlight and Play internal testing

This guide is for the owner. Nothing here was done for you. No account, certificate, key, or upload exists in this repository.
Never commit a signing key, a keystore, a `.p8` file, or a password.

## Decisions and costs that are yours

| Decision | Cost | Needed for |
| --- | --- | --- |
| Apple Developer Program | US$99 per year | TestFlight and the App Store |
| Google Play Console developer account | US$25 one time | Play internal testing and the Play Store |
| A Mac with current Xcode | Already installed | iOS builds |
| Public URLs for the privacy policy and the support page | Free (GitHub Pages works) | Both stores |

Google may require new personal accounts to run a closed test with at least 12 testers for 14 days before production access. Internal testing is not affected. Check the current Play rules before you plan a public launch.

## 0. Before the first upload

1. Decide the app id. Change it now if you want a different one. See "Changing the app id" in the README. It cannot change after the first upload.
2. Fill in `store/PRIVACY.md` and `store/SUPPORT.md`. Publish both on public URLs.
3. Make sure the web version still works: `npm test && npm run build`.
4. Update `store/listing.md` if you change the name or text.

## 1. iOS: TestFlight

### 1.1 Account

1. Enroll at https://developer.apple.com/programs/enroll/. Approval can take one to two days.
2. Sign in to Xcode with the same Apple ID: Xcode > Settings > Accounts.

### 1.2 Register the app

1. Open https://appstoreconnect.apple.com > Apps > "+" > New App.
2. Platform iOS. Name "Ultimate Tic-Tac-Toe". Primary language English.
3. Bundle ID: register `com.yosefmekonnen.ultimatetictactoe` (or your changed id) at Certificates, Identifiers & Profiles > Identifiers first. Pick it in the list.
4. SKU: any unique text, for example `uttt-001`.

### 1.3 Signing and provisioning

1. Build the web app and sync: `npm run build && npx cap sync`.
2. Run `npx cap open ios`.
3. In Xcode, select the App project, then the App target > Signing & Capabilities.
4. Tick "Automatically manage signing". Choose your Team.
5. Check that the Bundle Identifier matches the id you registered.
6. Xcode creates the certificate and provisioning profile for you.

### 1.4 Version and build number

1. In the target's General tab, set Version (for example `1.0`) and Build (for example `1`).
2. Every upload needs a build number that is higher than the last upload with the same version.

### 1.5 Archive and upload

1. Choose the run destination "Any iOS Device (arm64)".
2. Product > Archive.
3. When the Organizer opens, select the archive, then Distribute App > App Store Connect > Upload.
4. Keep the defaults, sign in if asked, and upload.
5. Wait for the "processing" email. This takes a few minutes to an hour.

### 1.6 TestFlight

1. In App Store Connect, open the app > TestFlight.
2. Answer the export compliance question if asked. `Info.plist` already says no non-exempt encryption.
3. Internal testing: add people from your team (up to 100). They get the build with no review.
4. External testing: create a group, add testers by email or public link, and submit the first build for Beta App Review. This review usually takes a day.
5. Testers install the TestFlight app and accept the invite.

### 1.7 App Store review notes

Apple guideline 4.2 rejects apps that are only a website in a wrapper. This app adds haptics, a native share sheet, safe-area layout, a native splash, and works offline. Mention this in the review notes. Use the review note text in `store/listing.md`.

## 2. Android: Play internal testing

### 2.1 Account

1. Register at https://play.google.com/console/signup and pay the one-time fee.
2. Complete identity verification. It can take a few days.

### 2.2 Create the app

1. Play Console > Create app. Name "Ultimate Tic-Tac-Toe". Language English. App, Free.
2. Accept the declarations.
3. Complete Dashboard > "Set up your app": privacy policy URL, app access, ads (none), content rating (see `store/listing.md`), target audience, data safety (collects nothing), and category.

### 2.3 Create an upload key (once, keep it safe)

1. In a terminal, run:
   ```bash
   keytool -genkeypair -v -keystore ~/uttt-upload.jks -alias upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Store the keystore file and its passwords in a password manager and make a second backup. Do not put it in this repository.
3. Plan to use Play App Signing. Google holds the final app signing key. You hold the upload key. If you lose the upload key, you can ask Google to reset it.

### 2.4 Build a signed release bundle

1. Run `npm run build && npx cap sync android`.
2. Run `npx cap open android`.
3. In Android Studio: Build > Generate Signed App Bundle / APK > Android App Bundle.
4. Choose the keystore you made. Choose the `release` build type. Finish.
5. The file is `android/app/release/app-release.aab`. Do not commit it.
6. Raise `versionCode` in `android/app/build.gradle` for every new upload. Set `versionName` to the version people see.

Android Studio may ask you to install Android SDK Build-Tools. Accept. The command-line build needs JDK 21. The project targets Java 21, so JDK 17 fails to compile.

### 2.5 Upload to the internal testing track

1. Play Console > Testing > Internal testing > Create new release.
2. Accept Play App Signing if asked.
3. Upload the `.aab`. Add release notes from `store/listing.md`.
4. Save, then Review release, then Start rollout to internal testing.
5. Testers tab: create an email list and add the testers (up to 100).
6. Copy the opt-in link and send it to the testers. They open it on an Android device signed in with the listed account.

## 3. After testing

1. Test on at least one real iPhone and one real Android phone. The simulator does not play haptics.
2. Check light mode, dark mode, a small phone, and a large phone.
3. Take the final store screenshots on the device sizes the stores ask for.
4. For production, submit the iOS build for App Review (App Store Connect > the version > Add for Review) and promote the Android release to Production.

## Updating the app later

1. Change the code. Run `npm test`.
2. Run `npm run build && npx cap sync`.
3. Raise the iOS build number and the Android `versionCode`.
4. Archive and upload again.
