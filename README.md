# WisiSleep 🌙

A sleep audio app — part of the WiSiVERSE ecosystem.

## Features

- 🌿 **Nature Sounds** — rain, ocean, forest, thunder, and more (Freesound API)
- 🎵 **Sleep Music** — ambient, piano, meditation (Pixabay Audio API)
- 🎙️ **Podcasts** — search any topic (Podcast Index API)
- 📚 **Audiobooks** — public domain books (Librivox API)
- 🌙 **Sleep Timer** — 15, 30, 45, 60, 90 min with fade-out
- ❤️ **Library** — save favorites to localStorage

## Setup

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your API keys:
   - **Freesound**: https://freesound.org/apiv2/apply/
   - **Pixabay**: https://pixabay.com/api/docs/
   - **Podcast Index**: https://api.podcastindex.org/

4. Add logo assets to `/public`:
   - `logo-wisisleep.png`
   - `logo-wisiverse.png`

5. Run dev server:
   ```
   npm run dev
   ```

## Deploy

Push to GitHub → Vercel auto-deploys.  
Set env variables in Vercel dashboard under Project Settings → Environment Variables.

## Stack

React + Vite · Vercel · WiSiVERSE Design System
