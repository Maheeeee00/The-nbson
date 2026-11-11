import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { X, LayoutDashboard, MonitorSmartphone, ChefHat, ShoppingBag, Bike, Home } from 'lucide-react'
import { STATUS, CHANNEL } from '../lib/store'

export function Logo({ dark = false, small = false, iconOnly = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0">
      <span className={`grid place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-glow ${small ? 'h-8 w-8' : 'h-9 w-9'}`}>
        <svg viewBox="0 0 64 64" className={small ? 'h-5 w-5' : 'h-6 w-6'}><path d="M14 38c0-10 8-18 18-18s18 8 18 18H14z" fill="currentColor" /><rect x="10" y="41" width="44" height="5" rx="2.5" fill="currentColor" /><circle cx="32" cy="15" r="4" fill="currentColor" /></svg>
      </span>
      {!iconOnly && <span className={`font-display font-extrabold tracking-tight ${small ? 'text-lg' : 'text-xl'} ${dark ? 'text-white' : 'text-ink-900'}`}>
        Servora
      </span>}
    </Link>
  )
}

export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new
  return (
    <span className={`chip ${s.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function ChannelBadge({ channel }) {
  const c = CHANNEL[channel] || CHANNEL.online
  return <span className={`chip ${c.cls}`}>{c.label}</span>
}

export function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-slideIn`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur px-6 py-4">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Toggle({ on, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-brand-500' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export function Empty({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icon className="h-7 w-7" /></div>
      <p className="mt-4 font-semibold text-slate-700">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  )
}

const MODULES = [
  { to: '/', label: 'Website', icon: Home, end: true },
  { to: '/order', label: 'Online Store', icon: ShoppingBag },
  { to: '/pos', label: 'POS', icon: MonitorSmartphone },
  { to: '/kitchen', label: 'Kitchen', icon: ChefHat },
  { to: '/delivery', label: 'Delivery', icon: Bike },
  { to: '/admin', label: 'Admin', icon: LayoutDashboard },
]

// Floating switcher so you can jump between modules during a client demo.
export function DemoSwitcher() {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 print:hidden">
      <div className="flex items-center gap-1 rounded-2xl bg-ink-900/90 p-1.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        {MODULES.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition ${isActive ? 'bg-brand-500 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

// Two-step button: first click arms it, second click confirms (no browser popups).
export function ConfirmButton({ onConfirm, className = '', armedLabel = 'Confirm?', title, children }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3000); return () => clearTimeout(t) }, [armed])
  return (
    <button type="button" title={title} onClick={() => (armed ? (setArmed(false), onConfirm()) : setArmed(true))}
      className={armed ? 'rounded-lg bg-rose-500 px-2.5 py-1.5 text-xs font-bold text-white' : className}>
      {armed ? armedLabel : children}
    </button>
  )
}
