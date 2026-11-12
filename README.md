# Nabeel & Farhana — Nikah invitation website

A zero-v0-credit, static, GitHub Pages-ready animated wedding invitation.

## Publish for free on GitHub Pages
1. Create a **public** GitHub repository, e.g. `nabeel-farhana-wedding`.
2. Upload **all files and the assets folder** from this package to the repository root (not the enclosing zip folder).
3. Open repository **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, branch **main**, folder **/(root)**, then save.
4. Visit `https://YOUR-USERNAME.github.io/nabeel-farhana-wedding/` when deployment finishes.

## Included
- Animated invitation cover and patterned emerald/ivory/gold design with subtle heritage-inspired red accents.
- Mobile-responsive ceremony, family, dua, live countdown, Maps, `.ics` calendar, wishes, and sharing.
- Details set to **9 January 2027, 5:30 PM India Standard Time** (UTC+05:30). Calendar event defaults to a 2-hour placeholder duration; change it if necessary.
- Guest wishes save only to the visitor's own browser, **not to a shared public database**. To receive guest wishes centrally, connect an optional backend/form service.

## Background music
The requested track is a YouTube video: https://youtu.be/8bWRU2ipOwA . The Music button uses YouTube's official embedded player. **Browsers and YouTube may restrict auto-play, embedded audio, or playback.** Guests can tap the Music button to retry. No YouTube audio is downloaded or bundled. For more reliable music, place an appropriately licensed/authorized audio file at `assets/background-music.mp3`; the site will use that file first. Don't upload copyrighted music without permission.

## Edit details
Edit `index.html` for names, families, venue, heading, and map URL. Edit `script.js` for date (`WEDDING_DATE`) or YouTube video ID. Edit `nikah.ics` for the calendar event. Edit colors at top of `styles.css`.

## Notes
The backdrop-inspired geometric SVG in `assets/heritage-pattern.svg` is an original simplified motif, not a reproduction of the provided PDF artwork. A public GitHub Pages deployment exposes source code and assets; avoid publishing private phone numbers or sensitive information. Google Fonts and YouTube need an internet connection.
