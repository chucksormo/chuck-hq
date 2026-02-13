# CLAUDE.md — Chuck HQ

## Project
Chuck HQ is a collaboration dashboard for Fredrik (human) and Chuck (AI agent). 
Built with React + Vite + TypeScript + Tailwind CSS + Express backend.

## Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS
- Backend: Express.js with JSON file database in /data/
- Design: Dark JARVIS/Tony Stark aesthetic — electric blue (#00d4ff) and amber (#f59e0b) accents
- Font: JetBrains Mono for data, Inter for UI

## Code Style
- TypeScript strict mode
- Functional React components with hooks
- Tailwind for all styling — no CSS modules
- Keep components focused and small
- All data flows through /api/ endpoints
- JSON files in /data/ are the source of truth

## Design Rules
- NEVER change the dark JARVIS aesthetic
- Keep animations subtle and performant
- Mobile-responsive always
- Glass-morphism panels (backdrop-blur, semi-transparent bg)
- Color palette: stark-900 bg, arc (electric blue) for accents, amber for highlights, success green, danger red

## Important
- Server must stay alive (don't exit after starting)
- All components must fetch from API, never use hardcoded data
- Test that `npm run dev` starts both vite and express via concurrently
- When finished, run: `openclaw system event --text "Done: <summary>" --mode now`
