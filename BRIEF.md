# Tony Stark HQ — Design Brief

## What is this?
A web-based collaboration dashboard for Fredrik (human gründer) and Chuck (autonomous AI agent) to execute the Tony Stark plan together.

## Why not a normal kanban?
Kanban is designed for human teams with managers. We're different:
- Chuck works autonomously and needs to show Fredrik what he's been doing
- Fredrik drops ideas and context whenever inspiration hits
- We need to track long-term vision AND daily actions
- The AI agent needs a "mission control" view

## Core Sections

### 1. 🎯 Mission Control (Hero Section)
- The Tony Stark Plan phases with progress indicators
- Current phase highlighted
- Key metrics: days to goal, active projects, ideas in pipeline

### 2. 💡 Idea Inbox
- Quick capture: just type an idea, hit enter
- Each idea gets auto-scored by the framework (moat, AI-driftbar, revenue, passiv, speed, fit, glede)
- Sort by score, filter by status (new, evaluating, active, parked, killed)
- Click to expand: see full analysis, pros/cons, next steps

### 3. 🚀 Active Projects
- Cards for each active project (HexaQuiz, etc.)
- Each card shows: status, next action, blockers, progress
- NOT traditional kanban columns — more like a "radar view"
- Projects can be in: exploring, building, growing, maintaining, exiting

### 4. 📋 Chuck's Activity Feed
- What Chuck has been doing autonomously
- Research findings, calendar events created, reminders set
- Fredrik can react: 👍 approve, 🔄 revise, ❌ cancel

### 5. 💪 Health Tracker
- Simple daily check: neck tension level (1-10)
- PSOAS and splenius capitis training log
- Streak counter for training consistency

### 6. 📊 Weekly Review
- Auto-generated weekly summary
- What was accomplished, what's next
- Momentum indicator

## Tech Stack
- Single page app, modern and clean
- React + Vite (Fredrik knows JS/TS)
- Tailwind CSS for styling
- Local storage initially (can add backend later)
- Dark mode (Tony Stark aesthetic)
- Mobile-friendly (Fredrik uses WhatsApp on phone)

## Design Vibe
- Dark, sleek, Tony Stark / JARVIS aesthetic
- Not corporate — creative and inspiring
- Subtle animations, feels alive
- Color scheme: dark bg, electric blue accents, warm amber for highlights

## Data
- Store in JSON files in the workspace for now
- Chuck can read/write these directly
- Later: add a simple API if needed
