import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Plus, Minus, Search, Clock, MapPin, Star, Bike, Store, X, ArrowRight, Flame, Phone } from 'lucide-react'
import { useStore, useMoney, makeOrder } from '../lib/store'
import { Modal } from '../components/ui'

export default function OnlineStore() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const nav = useNavigate()
  const { settings, categories, menu } = state
  const [cart, setCart] = useState([])
  const [q, setQ] = useState('')
  const [activeCat, setActiveCat] = useState(categories[0].id)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [mode, setMode] = useState('delivery')
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '', payment: 'cash' })
  const refs = useRef({})

  const filtered = useMemo(() => menu.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.desc?.toLowerCase().includes(q.toLowerCase())), [menu, q])
  const popular = menu.filter((m) => m.popular && m.available)
  const count = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax = Math.round((subtotal * settings.taxRate) / 100)
  const fee = mode === 'delivery' ? settings.deliveryFee : 0
  const total = subtotal + tax + fee

  const add = (m) => setCart((c) => (c.find((x) => x.id === m.id) ? c.map((x) => (x.id === m.id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id: m.id, name: m.name, price: m.price, emoji: m.emoji, qty: 1 }]))
  const dec = (id) => setCart((c) => c.flatMap((x) => (x.id === id ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])))
  const qtyOf = (id) => cart.find((x) => x.id === id)?.qty || 0

  const scrollTo = (id) => { setActiveCat(id); refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  const place = (e) => {
    e.preventDefault()
    const order = makeOrder(state, cart, {
      channel: mode === 'delivery' ? 'online' : 'takeaway',
      payment: form.payment,
      notes: form.notes,
      customer: { name: form.name, phone: form.phone, address: mode === 'delivery' ? form.address : 'Pickup' },
      source: 'website',
    })
    dispatch({ type: 'PLACE_ORDER', order })
    const id = `o${state.nextNumber}`
    setCart([]); setCheckout(false); setCartOpen(false)
    nav(`/order/track/${id}`)
  }

  if (!settings.onlineOrdering) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
        <div><Store className="mx-auto h-12 w-12 text-slate-400" /><h1 className="mt-4 text-2xl font-bold">Online ordering is paused</h1><p className="mt-2 text-slate-500">{settings.restaurantName} isn’t accepting online orders right now.</p></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Hero */}
      <div className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(254,80,17,.45),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(245,158,11,.25),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-2xl">🔥</div>
              <div><p className="font-display text-lg font-extrabold leading-tight">{settings.restaurantName}</p><p className="text-xs text-slate-300">{settings.tagline}</p></div>
            </div>
            <button onClick={() => setCartOpen(true)} className="relative rounded-xl bg-white/10 p-2.5 ring-1 ring-white/20 hover:bg-white/20">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold">{count}</span>}
            </button>
          </div>
          <div className="mt-12 max-w-xl">
            <span className="chip bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Open now · {settings.openHours}</span>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Hot, fresh & delivered fast.</h1>
            <p className="mt-3 text-slate-300">Order direct for the best prices — every order supports us directly.</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-200">
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />Order direct</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />30–40 min</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{settings.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-6xl px-4">
        {/* Mode + search */}
        <div className="card relative flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="flex rounded-xl bg-slate-100 p-1">
            {[['delivery', 'Delivery', Bike], ['pickup', 'Pickup', Store]].map(([k, l, Icon]) => (
              <button key={k} onClick={() => setMode(k)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${mode === k ? 'bg-white text-ink-900 shadow' : 'text-slate-500'}`}><Icon className="h-4 w-4" />{l}</button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search burgers, pizza, drinks…" className="input pl-10" />
          </div>
        </div>

        {/* Category pills */}
        <div className="sticky top-0 z-20 -mx-4 mt-4 bg-slate-50/90 px-4 py-3 backdrop-blur">
          <div className="scrollbar-thin flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button key={c.id} onClick={() => scrollTo(c.id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${activeCat === c.id ? 'bg-ink-900 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'}`}>{c.emoji} {c.name}</button>
            ))}
          </div>
        </div>

        {/* Popular */}
        {!q && popular.length > 0 && (
          <div className="mt-4">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink-900"><Flame className="h-5 w-5 text-brand-500" />Most loved</h2>
            <div className="scrollbar-thin mt-4 flex gap-4 overflow-x-auto pb-2">
              {popular.map((m) => (
                <div key={m.id} className="w-60 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                  <div className="grid h-32 place-items-center text-6xl" style={{ background: m.bg }}>{m.emoji}</div>
                  <div className="p-4">
                    <p className="font-bold text-ink-900">{m.name}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-brand-600">{money(m.price)}</span>
                      <QtyControl qty={qtyOf(m.id)} onAdd={() => add(m)} onDec={() => dec(m.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu by category */}
        {categories.map((c) => {
          const items = filtered.filter((m) => m.cat === c.id)
          if (!items.length) return null
          return (
            <section key={c.id} ref={(el) => (refs.current[c.id] = el)} className="scroll-mt-20 pt-8">
              <h2 className="text-xl font-extrabold text-ink-900">{c.emoji} {c.name}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => (
                  <div key={m.id} className={`group flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition hover:shadow-card ${!m.available ? 'opacity-50' : ''}`}>
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl text-5xl transition group-hover:scale-105" style={{ background: m.bg }}>{m.emoji}</div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="font-bold text-ink-900">{m.name}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{m.desc}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="font-bold text-ink-900">{money(m.price)}</span>
                        {m.available ? <QtyControl qty={qtyOf(m.id)} onAdd={() => add(m)} onDec={() => dec(m.id)} /> : <span className="text-xs font-semibold text-slate-400">Sold out</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Sticky cart bar */}
      {count > 0 && !cartOpen && (
        <div className="fixed inset-x-0 bottom-20 z-30 px-4">
          <button onClick={() => setCartOpen(true)} className="mx-auto flex w-full max-w-md animate-slideIn items-center justify-between rounded-2xl bg-brand-500 px-5 py-4 text-white shadow-glow">
            <span className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-sm font-bold">{count}</span><span className="font-semibold">View cart</span></span>
            <span className="font-bold">{money(subtotal)}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slideIn flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold">Your order</h3>
              <button onClick={() => setCartOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-auto p-6">
              {cart.length === 0 && <p className="py-20 text-center text-slate-500">Your cart is empty</p>}
              {cart.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-2xl">{i.emoji}</span>
                  <div className="flex-1"><p className="font-semibold">{i.name}</p><p className="text-sm text-slate-500">{money(i.price)}</p></div>
                  <QtyControl qty={i.qty} onAdd={() => add(i)} onDec={() => dec(i.id)} />
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="space-y-2 border-t p-6 text-sm">
                <Row l="Subtotal" v={money(subtotal)} />
                <Row l={`Tax (${settings.taxRate}%)`} v={money(tax)} />
                {fee > 0 && <Row l="Delivery fee" v={money(fee)} />}
                <Row l="Total" v={money(total)} bold />
                <button onClick={() => setCheckout(true)} className="btn-primary mt-3 w-full py-3.5 text-base">Checkout <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Checkout */}
      <Modal open={checkout} onClose={() => setCheckout(false)} title={mode === 'delivery' ? 'Delivery details' : 'Pickup details'}>
        <form onSubmit={place} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></Field>
            <Field label="Phone"><input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03xx xxxxxxx" /></Field>
          </div>
          {mode === 'delivery' && <Field label="Delivery address"><input required className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House, street, area" /></Field>}
          <Field label="Order notes (optional)"><input className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. extra spicy, no onions" /></Field>
          <Field label="Payment">
            <div className="grid grid-cols-2 gap-2">
              {[['cash', mode === 'delivery' ? 'Cash on delivery' : 'Pay at counter'], ['online', 'Card / wallet']].map(([k, l]) => (
                <button type="button" key={k} onClick={() => setForm({ ...form, payment: k })} className={`rounded-xl px-3 py-3 text-sm font-semibold ring-1 transition ${form.payment === k ? 'bg-brand-50 text-brand-700 ring-brand-400' : 'ring-slate-200 hover:bg-slate-50'}`}>{l}</button>
              ))}
            </div>
          </Field>
          <div className="rounded-xl bg-slate-50 p-4 text-sm"><Row l={`${count} items`} v={money(subtotal)} /><Row l="Tax & fees" v={money(tax + fee)} /><Row l="Total to pay" v={money(total)} bold /></div>
          <button className="btn-primary w-full py-3.5 text-base">Place order · {money(total)}</button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500"><Phone className="h-3.5 w-3.5" />Questions? Call {settings.phone}</p>
        </form>
      </Modal>
    </div>
  )
}

function QtyControl({ qty, onAdd, onDec }) {
  if (!qty) return <button onClick={onAdd} className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white shadow-glow transition hover:bg-brand-600"><Plus className="h-4 w-4" /></button>
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-0.5">
      <button onClick={onDec} className="grid h-7 w-7 place-items-center rounded-md bg-white shadow-sm"><Minus className="h-3.5 w-3.5" /></button>
      <span className="w-4 text-center text-sm font-bold">{qty}</span>
      <button onClick={onAdd} className="grid h-7 w-7 place-items-center rounded-md bg-brand-500 text-white"><Plus className="h-3.5 w-3.5" /></button>
    </div>
  )
}

const Row = ({ l, v, bold }) => <div className={`flex justify-between ${bold ? 'pt-2 text-base font-bold text-ink-900' : 'text-slate-600'}`}><span>{l}</span><span>{v}</span></div>
const Field = ({ label, children }) => <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>
