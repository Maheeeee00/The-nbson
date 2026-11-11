# Servora — Restaurant Operating System (Demo)

An all-in-one restaurant management system: **POS, commission-free online ordering, kitchen display, delivery tracking and an admin dashboard with analytics**. It's built as a polished, fully clickable demo you can show to restaurant owners.

Built with **React 18 + Vite + Tailwind CSS + Recharts**. It needs no backend: all data lives in the browser (`localStorage`), so it deploys to Vercel for free in about a minute.

---

## ✨ Modules

| Route | Module | What to show customers |
|---|---|---|
| `/#/` | **Marketing website** | Hero, features, module tour, pricing, FAQ |
| `/#/order` | **Online ordering store** | Customer menu, cart, checkout (delivery or pickup) |
| `/#/order/track/:id` | **Live order tracking** | Progress steps plus a live rider map |
| `/#/pos` | **POS terminal** | PIN login, table map, discounts, cash/card/QR payment, printable receipt |
| `/#/kitchen` | **Kitchen display (KDS)** | Live tickets, colour-coded timers, one-tap bump |
| `/#/delivery` | **Delivery dispatch** | Assign riders, live map, ETAs, rider status |
| `/#/admin` | **Admin dashboard** | KPIs, revenue chart, channel mix, best sellers, peak hours |
| `/#/admin/orders` | Orders | Filters, search, order details, status changes, CSV export |
| `/#/admin/menu` | Menu manager | Add, edit and delete items, mark sold out or popular |
| `/#/admin/inventory` | Inventory | Stock levels, low-stock alerts, quick adjust |
| `/#/admin/staff` | Staff | Roles, shift status, POS PINs |
| `/#/admin/reports` | Reports | Today, 7 or 30 days, payment and category breakdowns, export |
| `/#/admin/settings` | Settings | Name, address, currency, tax, delivery fee, online ordering toggles |

**POS demo PINs:** `1111` (Manager), `2222` (Cashier), `3333` (Waiter), `4444` (Chef). You can also tap a name on the lock screen.

## 🎬 How to give a great demo

1. Open **Online Store**, **Kitchen** and **Admin** in **three browser tabs**. They sync live.
2. Place an order on the Online Store. It appears instantly on the Kitchen screen and the Admin dashboard.
3. Move it along in the Kitchen. The customer's tracking page updates in real time.
4. Dispatch it to a rider on the **Delivery** screen and watch the rider move on the map.
5. Turn on **"Live demo mode"** (in the Admin top bar) to auto-generate realistic orders every few seconds, so the system looks busy while you talk.
6. **Reset demo** (the ↻ icon in the Admin top bar) restores the original data.

The floating bar at the bottom of every page lets you switch between modules during the demo.

---

## 🚀 Run locally

```bash
npm install
npm run dev
```
Then open http://localhost:5173

## 📦 Push to GitHub

```bash
git init
git add .
git commit -m "Servora restaurant system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/servora.git
git push -u origin main
```
(Create the empty repo at https://github.com/new first.)

## ▲ Deploy on Vercel

1. Go to https://vercel.com/new and sign in with GitHub.
2. **Import** your `servora` repository.
3. Vercel detects **Vite** automatically (Build: `npm run build`, Output: `dist`). Click **Deploy**.
4. You get a live URL such as `https://servora.vercel.app` to share with customers.

Every `git push` redeploys automatically.

---

## 🎨 Rebranding

- **Product name and logo:** `src/components/ui.jsx` (`Logo`) and `index.html` (title)
- **Brand colours:** `tailwind.config.js` → `colors.brand`
- **Demo restaurant, menu, staff, riders:** `src/lib/data.js`
- **Pricing plans and landing text:** `src/pages/Landing.jsx`
- After changing `data.js`, click **Reset demo** in Admin (or clear site data) to load the new seed.

## 🗂 Project structure

```
src/
  lib/
    data.js        demo seed data (menu, tables, staff, riders, order history)
    store.jsx      global state, localStorage persistence, cross-tab sync, demo simulator
    analytics.js   KPI and chart calculations, CSV export
  components/
    ui.jsx         Logo, badges, modal, toggle, demo switcher
    CityMap.jsx    SVG live delivery map (no API key needed)
  pages/
    Landing.jsx  OnlineStore.jsx  TrackOrder.jsx  POS.jsx  Kitchen.jsx  Delivery.jsx
    admin/  AdminLayout  Dashboard  Orders  MenuManager  Inventory  Staff  Reports  Settings
```

## 🛣 Turning the demo into a real product

This is a front-end demo. For production with real customers you'd add:
- A backend and database (e.g. Supabase, Firebase or Node + PostgreSQL) in place of `localStorage`
- Authentication for staff and admins
- Real-time updates over the network (Supabase Realtime, WebSockets)
- A payment gateway (Stripe, or JazzCash/Easypaisa in Pakistan)
- Google Maps or Mapbox for real rider tracking
- Thermal printer integration (ESC/POS)

The state actions in `store.jsx` (`PLACE_ORDER`, `SET_STATUS`, `ASSIGN_RIDER`, …) map cleanly onto API endpoints when you get there.
