# 🎄 Christmas Carols Lyrics PWA (Progressive Web App)

A lightweight, dedicated **Lyrics-Only** Christmas Carol mobile app designed specifically for singers caroling outdoors, in church, or door-to-door.

---

## 🌟 Key Features

1. **Only Lyrics & Zero Clutter:** No audio players, no complex MP3 playback; pure, fast, beautiful lyrics reading.
2. **Singable English Transliteration & Tamil:**
   - **தமிழ்:** Pure Tamil script.
   - **English:** Romanized transliteration so anyone who cannot read Tamil can sing along directly!
   - **Both:** Stacked Tamil and English lines together.
3. **100% Offline PWA:**
   - Pre-caches all 19 songs, fonts, and assets into `CacheStorage` via Service Worker (`sw.js`).
   - Works in airplane mode or during street caroling with zero internet.
4. **💡 Screen Stays Awake (Wake Lock API):**
   - Automatically prevents phone screens from dimming or sleeping while singing mid-verse.
5. **▶ Hands-Free Auto-Scroll:**
   - Adjustable speed (0.7x, 1.0x, 1.5x) so singers holding props or song sheets can read hands-free.
6. **Instant Bilingual Search:**
   - Type in Tamil (`ஆரிராரிரோ`) or English (`aarirariro`, `chinna`, `bethlehem`) to find any song in milliseconds.
7. **Outdoor Night Mode & Font Resizer:**
   - High-contrast OLED dark theme with warm golden highlights.
   - Easy `A-` and `A+` font resizing buttons.
8. **Chorus / பல்லவி Highlight:**
   - Ornate festive border around chorus sections with repeat tags (`2x`).

---

## 🚀 Running the App Locally

```bash
cd /Users/fcruz/.gemini/antigravity/scratch/christmas-carols-pwa
npm run dev
```

Open `http://localhost:5173` in your browser.

To test the production build with offline Service Worker:
```bash
npm run preview
```

---

## 📲 Installing on Your Smartphone (PWA)

### On iPhone (iOS Safari):
1. Open the app URL in Safari.
2. Tap the **Share** button (box with an arrow pointing up).
3. Tap **"Add to Home Screen"**.
4. The Christmas Carol app will appear on your home screen with its festive tree icon and will open fullscreen like a native app.

### On Android (Chrome):
1. Open the app URL in Chrome.
2. Tap the **"Install"** pill button at the top, or tap the three dots (⋮) and tap **"Install App"**.
