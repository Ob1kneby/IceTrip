# 🇮🇸 Iceland Ring Road Trip 2026

**Jun 30 – Jul 14, 2026 · 2 people · 4x4 truck + Rooftop Tent**

An interactive web app to plan and share our Iceland road trip. Includes an interactive map, full day-by-day itinerary, pre-departure checklist with persistent state, and budget breakdown.

## Features

- **Interactive map** — all 15 stops pinned with day-by-day route display or full trip overview
- **Itinerary** — every day expanded with schedule, hike details, excursion info, warnings, and tips
- **Checklist** — pre-departure todo list that saves your progress in the browser
- **Budget** — full cost breakdown with fuel and parking separated

## Deploy to GitHub Pages (5 minutes)

1. Create a new GitHub repository (e.g. `iceland-trip-2026`)
2. Upload all three files:
   - `index.html`
   - `data.js`
   - `app.js`
3. Go to **Settings → Pages**
4. Under "Source", select **Deploy from a branch**
5. Choose **main** branch, **/ (root)** folder
6. Click **Save**
7. Your site will be live at: `https://yourusername.github.io/iceland-trip-2026`

That's it. No build step, no dependencies to install — it's all static HTML/JS.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell, all CSS styling |
| `data.js` | All trip data — days, costs, checklist, budget |
| `app.js` | Map logic, interactivity, tab management |

## Customising

All trip data lives in `data.js` — edit the `TRIP_DATA` object to update any day, cost, or checklist item. No rebuild needed.

## Dependencies (loaded from CDN, no install needed)

- [Leaflet.js](https://leafletjs.com/) v1.9.4 — interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) tiles — free map tiles

---

*Total estimated trip cost: ~$2,800 per person · ~$5,600 for 2*
