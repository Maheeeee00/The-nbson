import { useEffect, useState } from 'react'
import { Bike, MapPin, Phone, Package, CheckCircle2, Navigation, Clock } from 'lucide-react'
import { useStore, useMoney, useNow, timeAgo } from '../lib/store'
import { Logo, Empty, Toggle } from '../components/ui'
import CityMap, { progressFor, etaFor } from '../components/CityMap'

export default function Delivery() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const now = useNow(1000)
  const [focus, setFocus] = useState(null)
  const [pick, setPick] = useState({})

  const isDel = (o) => o.channel === 'online' || o.channel === 'delivery'
  const ready = state.orders.filter((o) => isDel(o) && o.status === 'ready')
  const cooking = state.orders.filter((o) => isDel(o) && ['new', 'preparing'].includes(o.status))
  const onRoad = state.orders.filter((o) => o.status === 'out')
  const busy = new Set(onRoad.map((o) => o.rider))
  const deliveredToday = state.orders.filter((o) => isDel(o) && o.status === 'completed' && o.createdAt > new Date().setHours(0, 0, 0, 0))

  // auto-complete when rider reaches the destination
  useEffect(() => {
    onRoad.forEach((o) => { if (progressFor(o, now) >= 1) dispatch({ type: 'SET_STATUS', id: o.id, status: 'completed' }) })
  }, [now]) // eslint-disable-line

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 pb-20 lg:h-screen lg:flex-row lg:pb-0">
      <aside className="scrollbar-thin flex w-full shrink-0 flex-col overflow-y-auto bg-white lg:w-[420px] lg:border-r lg:border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <Logo small />
          <span className="flex items-center gap-2 text-xs text-slate-500">Auto demo <Toggle on={state.simulate} onChange={(v) => dispatch({ type: 'SIMULATE', on: v })} /></span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-5">
          {[['Ready', ready.length, 'text-emerald-600'], ['On the road', onRoad.length, 'text-violet-600'], ['Delivered today', deliveredToday.length, 'text-ink-900']].map(([l, v, c]) => (
            <div key={l} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200"><p className="text-[11px] font-medium text-slate-500">{l}</p><p className={`font-display text-2xl font-extrabold ${c}`}>{v}</p></div>
          ))}
        </div>

        <Section title="Ready to dispatch" icon={Package} count={ready.length}>
          {ready.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">{cooking.length ? `${cooking.length} delivery order(s) still in the kitchen` : 'Nothing waiting'}</p>}
          {ready.map((o) => (
            <div key={o.id} className="animate-slideIn rounded-2xl p-4 ring-1 ring-emerald-200 bg-emerald-50/50">
              <div className="flex items-center justify-between"><span className="font-display text-lg font-extrabold">#{o.number}</span><span className="font-bold">{money(o.total)}</span></div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600"><MapPin className="h-3.5 w-3.5" />{o.customer?.address || '—'}</p>
              <div className="mt-3 flex gap-2">
                <select value={pick[o.id] || ''} onChange={(e) => setPick({ ...pick, [o.id]: e.target.value })} className="input py-2">
                  <option value="">Choose rider…</option>
                  {state.riders.map((r) => <option key={r.id} value={r.id} disabled={busy.has(r.id)}>{r.name}{busy.has(r.id) ? ' (busy)' : ''}</option>)}
                </select>
                <button disabled={!pick[o.id]} onClick={() => dispatch({ type: 'ASSIGN_RIDER', id: o.id, rider: pick[o.id] })} className="btn-primary shrink-0"><Navigation className="h-4 w-4" />Dispatch</button>
              </div>
            </div>
          ))}
        </Section>

        <Section title="On the road" icon={Bike} count={onRoad.length}>
          {onRoad.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No active deliveries</p>}
          {onRoad.map((o) => {
            const r = state.riders.find((x) => x.id === o.rider)
            const p = progressFor(o, now)
            return (
              <button key={o.id} onClick={() => setFocus(focus === o.id ? null : o.id)} className={`w-full rounded-2xl p-4 text-left ring-1 transition ${focus === o.id ? 'bg-violet-50 ring-violet-400' : 'bg-white ring-slate-200 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="font-display text-lg font-extrabold">#{o.number}</span><span className="text-sm text-slate-500">· {r?.name}</span></span>
                  <span className="flex items-center gap-1 text-sm font-bold text-violet-600"><Clock className="h-3.5 w-3.5" />{etaFor(o, now)} min</span>
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">{o.customer?.address}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000" style={{ width: `${p * 100}%` }} /></div>
                <div className="mt-3 flex justify-end">
                  <span onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_STATUS', id: o.id, status: 'completed' }) }} className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"><CheckCircle2 className="h-3.5 w-3.5" />Mark delivered</span>
                </div>
              </button>
            )
          })}
        </Section>

        <Section title="Riders" icon={Bike} count={state.riders.length}>
          {state.riders.map((r) => {
            const done = deliveredToday.filter((o) => o.rider === r.id).length
            return (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg ring-1 ring-slate-200">🛵</div>
                <div className="flex-1"><p className="font-semibold">{r.name}</p><p className="text-xs text-slate-500">{r.vehicle}</p></div>
                <span className={`chip ${busy.has(r.id) ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>{busy.has(r.id) ? 'On delivery' : 'Available'}</span>
                <a href={`tel:${r.phone}`} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-ink-900"><Phone className="h-4 w-4" /></a>
              </div>
            )
          })}
        </Section>
      </aside>

      <main className="relative h-[60vh] flex-1 lg:h-auto">
        <CityMap orders={onRoad} riders={state.riders} now={now} highlight={focus} />
        <div className="absolute left-4 top-4 rounded-2xl bg-white/90 px-4 py-3 shadow-card backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live map</p>
          <p className="font-display text-lg font-extrabold text-ink-900">{onRoad.length} rider{onRoad.length === 1 ? '' : 's'} on the road</p>
        </div>
        <div className="absolute bottom-24 right-4 flex gap-3 rounded-2xl bg-white/90 px-4 py-2.5 text-xs font-semibold shadow-card backdrop-blur lg:bottom-4">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-brand-500" />Restaurant</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-violet-600" />Rider</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500" />Customer</span>
        </div>
        {onRoad.length === 0 && <div className="absolute inset-0 grid place-items-center"><div className="rounded-2xl bg-white/90 px-6 py-4 text-center shadow-card backdrop-blur"><p className="font-bold">No riders on the road</p><p className="text-sm text-slate-500">Dispatch a ready order to see live tracking</p></div></div>}
      </main>
    </div>
  )
}

function Section({ title, icon: Icon, count, children }) {
  return (
    <div className="border-t border-slate-100 p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500"><Icon className="h-4 w-4" />{title}<span className="chip bg-slate-100 text-slate-600">{count}</span></h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
