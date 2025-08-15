# Neuroljus — Landing (Next.js + Tailwind)

## Quick start
```bash
# 1) Install
npm install

# 2) Dev server
npm run dev

# 3) Build & run
npm run build && npm start
```

## Deploy on Vercel
1. Push this repo to GitHub (e.g., `neuroljus-site`).
2. Create a project on https://vercel.com and import the repo.
3. Framework preset: **Next.js**. No special env vars needed.
4. After first deploy, set a custom domain when ready (e.g., `neuroljus.ai`).

## Structure
```
.
├─ next.config.mjs
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ components/
   │  └─ NeuroljusLanding.tsx   # main landing (bilingual)
   ├─ pages/
   │  ├─ _app.tsx
   │  ├─ index.tsx              # uses NeuroljusLanding
   │  ├─ privacy.tsx
   │  └─ accessibility.tsx
   └─ styles/
      └─ globals.css
```

## Optional: Analytics (Plausible)
Add the Plausible script to `_app.tsx` or `_document.tsx` once the domain is live.

## Notes
- Content is bilingual (EN/SV). Toggle is embedded in the landing component.
- Reporting, Ethics, Pilot, and Contact sections are included with language aligned to Swedish innovation programs.
