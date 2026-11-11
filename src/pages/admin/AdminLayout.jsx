import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard, ReceiptText, UtensilsCrossed, Boxes, Users, BarChart3, Settings, Bell, Menu, X,
  MonitorSmartphone, ChefHat, Bike, ShoppingBag, RotateCcw, Search,
} from 'lucide-react'
import { useStore, timeAgo } from '../../lib/store'
import { Logo, Toggle, ConfirmButton } from '../../components/ui'

const NAV = [
  ['Dashboard', '', LayoutDashboard],
  ['Orders', 'orders', ReceiptText],
  ['Menu', 'menu', UtensilsCrossed],
  ['Inventory', 'inventory', Boxes],
  ['Staff', 'staff', Users],
  ['Reports', 'reports', BarChart3],
  ['Settings', 'settings', Settings],
]
const APPS = [['POS Terminal', '/pos', MonitorSmartphone], ['Kitchen Display', '/kitchen', ChefHat], ['Delivery', '/delivery', Bike], ['Online Store', '/order', ShoppingBag]]

export default function AdminLayout() {
  const { state, dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const [bell, setBell] = useState(false)
  const lowStock = state.inventory.filter((i) => i.qty < i.min).length
  const newOrders = state.orders.filter((o) => o.status === 'new').length

  const Sidebar = (
    <div className="flex h-full flex-col bg-ink-900 text-slate-300">
      <div className="flex items-center justify-between p-5"><Logo dark /><button className="lg:hidden" onClick={() => setOpen(false)}><X /></button></div>
      <div className="mx-4 mb-4 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">Branch</p>
        <p className="font-semibold text-white">{state.settings.restaurantName}</p>
        <p className="text-xs text-slate-400">{state.settings.address}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV.map(([l, to, Icon]) => (
          <NavLink key={l} to={`/admin${to ? '/' + to : ''}`} end={!to} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-brand-500 text-white shadow-glow' : 'hover:bg-white/5 hover:text-white'}`}>
            <Icon className="h-5 w-5" />{l}
            {l === 'Orders' && newOrders > 0 && <span className="ml-auto chip bg-sky-500 text-white">{newOrders}</span>}
            {l === 'Inventory' && lowStock > 0 && <span className="ml-auto chip bg-rose-500 text-white">{lowStock}</span>}
          </NavLink>
        ))}
        <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Apps</p>
        {APPS.map(([l, to, Icon]) => (
          <Link key={l} to={to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white"><Icon className="h-5 w-5" />{l}</Link>
        ))}
      </nav>
      <div className="m-4 flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 font-bold text-white">A</span>
        <div className="text-xs"><p className="font-semibold text-white">Ayesha Khan</p><p className="text-slate-400">Owner · Admin</p></div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{Sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 animate-slideIn">{Sidebar}</div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
          <div className="relative hidden max-w-sm flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="input bg-slate-50 pl-9" placeholder="Search orders, items, customers…" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 sm:flex" title="Generates realistic orders every few seconds">
              <span className={`h-2 w-2 rounded-full ${state.simulate ? 'animate-pulse bg-emerald-500' : 'bg-slate-300'}`} />Live demo mode
              <Toggle on={state.simulate} onChange={(v) => dispatch({ type: 'SIMULATE', on: v })} />
            </span>
            <ConfirmButton onConfirm={() => dispatch({ type: 'RESET' })} armedLabel="Reset demo?" className="rounded-xl p-2.5 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50" title="Reset demo data"><RotateCcw className="h-4 w-4" /></ConfirmButton>
            <div className="relative">
              <button onClick={() => setBell(!bell)} className="relative rounded-xl p-2.5 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">
                <Bell className="h-4 w-4" />
                {state.notifications.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{state.notifications.length}</span>}
              </button>
              {bell && (
                <div className="absolute right-0 mt-2 w-80 animate-slideIn rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200">
                  <div className="flex items-center justify-between px-3 py-2"><p className="font-bold">Notifications</p><button onClick={() => dispatch({ type: 'CLEAR_NOTES' })} className="text-xs font-semibold text-brand-600">Clear</button></div>
                  {state.notifications.length === 0 && <p className="px-3 py-6 text-center text-sm text-slate-500">You’re all caught up</p>}
                  {state.notifications.slice(0, 6).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50">
                      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><ReceiptText className="h-4 w-4" /></span>
                      <div><p className="text-sm font-semibold">{n.text}</p><p className="text-xs text-slate-500">{timeAgo(n.at)}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 pb-28 sm:p-6 sm:pb-28"><Outlet /></main>
      </div>
    </div>
  )
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{title}</h1>{sub && <p className="mt-1 text-slate-500">{sub}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
