import { useState } from 'react'
import { ChefHat, Timer, Flame, CheckCircle2, Play, Bell, Maximize2 } from 'lucide-react'
import { useStore, useNow, CHANNEL } from '../lib/store'
import { Logo, Toggle } from '../components/ui'

const COLS = [
  { key: 'new', title: 'New', accent: 'bg-sky-500', next: 'preparing', action: 'Start cooking', icon: Play },
  { key: 'preparing', title: 'Preparing', accent: 'bg-amber-500', next: 'ready', action: 'Mark ready', icon: CheckCircle2 },
  { key: 'ready', title: 'Ready', accent: 'bg-emerald-500', next: null, action: 'Bump', icon: Bell },
]

export default function Kitchen() {
  const { state, dispatch } = useStore()
  const now = useNow(1000)
  const [checked, setChecked] = useState({})
  const active = state.orders.filter((o) => ['new', 'preparing', 'ready'].includes(o.status))
  const avg = (() => {
    const done = state.orders.filter((o) => o.completedAt && o.completedAt > now - 86400000)
    if (!done.length) return 12
    return Math.round(done.reduce((s, o) => s + (o.completedAt - o.createdAt), 0) / done.length / 60000)
  })()

  const advance = (o, col) => {
    if (col.next) dispatch({ type: 'SET_STATUS', id: o.id, status: col.next })
    else dispatch({ type: 'SET_STATUS', id: o.id, status: 'completed' })
  }

  return (
    <div className="min-h-screen bg-ink-900 pb-24 text-white">
      <header className="flex flex-wrap items-center gap-4 border-b border-white/10 bg-ink-800 px-6 py-4">
        <Logo dark small />
        <span className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/10"><ChefHat className="h-4 w-4 text-brand-400" />Kitchen Display</span>
        <div className="ml-auto flex flex-wrap items-center gap-3 text-sm">
          <Stat label="Active" value={active.length} />
          <Stat label="Late (>20m)" value={active.filter((o) => now - o.createdAt > 20 * 60000).length} danger />
          <Stat label="Avg. time" value={`${avg}m`} />
          <span className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10"><span className="text-xs text-slate-400">Auto demo</span><Toggle on={state.simulate} onChange={(v) => dispatch({ type: 'SIMULATE', on: v })} /></span>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10 hover:bg-white/10" title="Fullscreen"><Maximize2 className="h-4 w-4" /></button>
          <span className="font-display text-2xl font-extrabold tabular-nums">{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-3">
        {COLS.map((col) => {
          const list = active.filter((o) => o.status === col.key).sort((a, b) => a.createdAt - b.createdAt)
          return (
            <div key={col.key} className="rounded-3xl bg-white/[.03] p-3 ring-1 ring-white/10">
              <div className="mb-3 flex items-center justify-between px-2">
                <h2 className="flex items-center gap-2 text-lg font-bold"><span className={`h-2.5 w-2.5 rounded-full ${col.accent}`} />{col.title}</h2>
                <span className="chip bg-white/10 text-white">{list.length}</span>
              </div>
              <div className="space-y-3">
                {list.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-500">No tickets</p>}
                {list.map((o) => {
                  const mins = Math.floor((now - o.createdAt) / 60000)
                  const secs = Math.floor(((now - o.createdAt) % 60000) / 1000)
                  const tone = mins >= 20 ? 'from-rose-500 to-rose-600' : mins >= 10 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500'
                  return (
                    <div key={o.id} className="animate-slideIn overflow-hidden rounded-2xl bg-white text-ink-900 shadow-xl">
                      <div className={`flex items-center justify-between bg-gradient-to-r ${tone} px-4 py-2.5 text-white`}>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-xl font-extrabold">#{o.number}</span>
                          <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold">{CHANNEL[o.channel]?.label}{o.table ? ` · ${o.table}` : ''}</span>
                        </div>
                        <span className="flex items-center gap-1 font-mono text-sm font-bold">{mins >= 20 ? <Flame className="h-4 w-4" /> : <Timer className="h-4 w-4" />}{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
                      </div>
                      <div className="space-y-1.5 p-4">
                        {o.items.map((i) => {
                          const k = o.id + i.id
                          return (
                            <label key={i.id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 ${checked[k] ? 'text-slate-400 line-through' : ''}`}>
                              <input type="checkbox" checked={!!checked[k]} onChange={() => setChecked({ ...checked, [k]: !checked[k] })} className="h-4 w-4 accent-emerald-500" />
                              <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-sm font-extrabold">{i.qty}</span>
                              <span className="font-semibold">{i.name}</span>
                            </label>
                          )
                        })}
                        {o.notes && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">📝 {o.notes}</p>}
                      </div>
                      <div className="px-4 pb-4">
                        <button onClick={() => advance(o, col)} disabled={col.key === 'ready' && (o.channel === 'online' || o.channel === 'delivery')} className={`btn w-full py-3 text-white ${col.key === 'new' ? 'bg-sky-500 hover:bg-sky-600' : col.key === 'preparing' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-ink-900 hover:bg-ink-700'}`}>
                          <col.icon className="h-4 w-4" />
                          {col.key === 'ready' && (o.channel === 'online' || o.channel === 'delivery') ? 'Awaiting rider' : col.action}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Stat({ label, value, danger }) {
  return (
    <span className="rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
      <span className="block text-[10px] uppercase tracking-wider text-slate-400">{label}</span>
      <span className={`font-display text-lg font-extrabold ${danger && value > 0 ? 'text-rose-400' : ''}`}>{value}</span>
    </span>
  )
}
