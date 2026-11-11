import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Plus, Minus, Trash2, Utensils, ShoppingBag, Bike, Percent, CreditCard, Banknote, Smartphone,
  Printer, CheckCircle2, LayoutGrid, Clock, Lock, Delete, ReceiptText, X, StickyNote,
} from 'lucide-react'
import { useStore, useMoney, makeOrder, timeAgo } from '../lib/store'
import { Logo, Modal, StatusBadge, ChannelBadge } from '../components/ui'

export default function POS() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const { menu, categories, settings, tables, orders, staff } = state
  const [user, setUser] = useState(null)
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [ticket, setTicket] = useState([])
  const [type, setType] = useState('dine-in')
  const [table, setTable] = useState(null)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [discount, setDiscount] = useState(0)
  const [modal, setModal] = useState(null) // 'tables' | 'pay' | 'receipt' | 'discount' | 'active'
  const [lastOrder, setLastOrder] = useState(null)

  const items = useMemo(() => menu.filter((m) => (cat === 'all' || m.cat === cat) && m.name.toLowerCase().includes(q.toLowerCase())), [menu, cat, q])
  const subtotal = ticket.reduce((s, i) => s + i.price * i.qty, 0)
  const discountAmt = Math.round((subtotal * discount) / 100)
  const tax = Math.round(((subtotal - discountAmt) * settings.taxRate) / 100)
  const fee = type === 'delivery' ? settings.deliveryFee : 0
  const total = subtotal - discountAmt + tax + fee

  const activeOrders = orders.filter((o) => ['new', 'preparing', 'ready', 'out'].includes(o.status))
  const busyTables = new Set(activeOrders.filter((o) => o.table).map((o) => o.table))

  const add = (m) => m.available && setTicket((t) => (t.find((x) => x.id === m.id) ? t.map((x) => (x.id === m.id ? { ...x, qty: x.qty + 1 } : x)) : [...t, { id: m.id, name: m.name, price: m.price, emoji: m.emoji, qty: 1 }]))
  const change = (id, d) => setTicket((t) => t.flatMap((x) => (x.id === id ? (x.qty + d > 0 ? [{ ...x, qty: x.qty + d }] : []) : [x])))
  const clear = () => { setTicket([]); setDiscount(0); setTable(null); setCustomer({ name: '', phone: '', address: '' }) }

  const complete = (payment, tendered) => {
    const order = makeOrder(state, ticket, {
      channel: type, table: type === 'dine-in' ? table : null, payment, discount: discountAmt,
      customer: { name: customer.name || (type === 'dine-in' ? `Table ${table || '-'}` : 'Walk-in'), phone: customer.phone, address: customer.address },
      cashier: user?.name, status: 'preparing',
    })
    dispatch({ type: 'PLACE_ORDER', order })
    setLastOrder({ ...order, number: state.nextNumber, createdAt: Date.now(), tendered })
    clear()
    setModal('receipt')
  }

  if (!user) return <PinLock staff={staff} onUnlock={setUser} settings={settings} />

  return (
    <div className="flex h-screen flex-col bg-slate-100 lg:flex-row">
      {/* Left rail */}
      <aside className="flex shrink-0 items-center gap-2 overflow-x-auto bg-ink-900 p-3 lg:w-24 lg:flex-col lg:overflow-y-auto">
        <div className="hidden lg:block"><Logo dark iconOnly /></div>
        <div className="flex gap-2 lg:mt-4 lg:flex-col">
          <CatBtn active={cat === 'all'} onClick={() => setCat('all')} emoji="🍽️" label="All" />
          {categories.map((c) => <CatBtn key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} emoji={c.emoji} label={c.name} />)}
        </div>
      </aside>

      {/* Products */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <p className="font-display text-lg font-extrabold text-ink-900">{settings.restaurantName}</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" />{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="relative ml-auto w-full max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search menu…" className="input bg-slate-50 pl-9" />
          </div>
          <button onClick={() => setModal('active')} className="btn-ghost relative"><ReceiptText className="h-4 w-4" />Orders<span className="chip bg-brand-500 text-white">{activeOrders.length}</span></button>
          <button onClick={() => setUser(null)} className="flex items-center gap-2 rounded-xl bg-slate-50 py-1.5 pl-1.5 pr-3 ring-1 ring-slate-200 hover:bg-slate-100">
            <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: user.color }}>{user.name[0]}</span>
            <span className="text-left text-xs"><b className="block text-ink-900">{user.name}</b><span className="text-slate-500">{user.role}</span></span>
            <Lock className="ml-1 h-3.5 w-3.5 text-slate-400" />
          </button>
        </header>
        <div className="scrollbar-thin grid flex-1 auto-rows-max grid-cols-2 gap-3 overflow-y-auto p-5 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((m) => {
            const inT = ticket.find((t) => t.id === m.id)?.qty
            return (
              <button key={m.id} onClick={() => add(m)} disabled={!m.available} className={`group relative overflow-hidden rounded-2xl bg-white text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 ${inT ? 'ring-2 ring-brand-500' : 'ring-slate-200'}`}>
                <div className="grid h-24 place-items-center text-5xl transition group-hover:scale-110" style={{ background: m.bg }}>{m.emoji}</div>
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-ink-900">{m.name}</p>
                  <p className="mt-0.5 text-sm font-semibold text-brand-600">{money(m.price)}</p>
                </div>
                {inT && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white shadow">{inT}</span>}
                {!m.available && <span className="absolute left-2 top-2 chip bg-ink-900 text-white">Sold out</span>}
              </button>
            )
          })}
        </div>
      </main>

      {/* Ticket */}
      <section className="flex h-[55vh] shrink-0 flex-col border-l border-slate-200 bg-white lg:h-auto lg:w-[400px]">
        <div className="border-b border-slate-100 p-4">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
            {[['dine-in', 'Dine-in', Utensils], ['takeaway', 'Takeaway', ShoppingBag], ['delivery', 'Delivery', Bike]].map(([k, l, Icon]) => (
              <button key={k} onClick={() => setType(k)} className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${type === k ? 'bg-white text-ink-900 shadow' : 'text-slate-500'}`}><Icon className="h-4 w-4" />{l}</button>
            ))}
          </div>
          {type === 'dine-in' && (
            <button onClick={() => setModal('tables')} className="mt-3 flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200 hover:bg-slate-100">
              <span className="flex items-center gap-2 font-semibold"><LayoutGrid className="h-4 w-4 text-brand-500" />{table ? `Table ${table}` : 'Select table'}</span>
              <span className="text-xs text-slate-500">{tables.length - busyTables.size} free</span>
            </button>
          )}
          {type !== 'dine-in' && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input className="input py-2" placeholder="Customer name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
              <input className="input py-2" placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              {type === 'delivery' && <input className="input col-span-2 py-2" placeholder="Delivery address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />}
            </div>
          )}
        </div>

        <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-4">
          {ticket.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <ReceiptText className="h-12 w-12" />
              <p className="mt-3 font-semibold">No items yet</p>
              <p className="text-sm">Tap a menu item to add it</p>
            </div>
          )}
          {ticket.map((i) => (
            <div key={i.id} className="flex animate-slideIn items-center gap-3 rounded-xl bg-slate-50 p-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xl">{i.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{i.name}</p>
                <p className="text-xs text-slate-500">{money(i.price)} × {i.qty}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => change(i.id, -1)} className="grid h-7 w-7 place-items-center rounded-lg bg-white ring-1 ring-slate-200">{i.qty === 1 ? <Trash2 className="h-3.5 w-3.5 text-rose-500" /> : <Minus className="h-3.5 w-3.5" />}</button>
                <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                <button onClick={() => change(i.id, 1)} className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500 text-white"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <p className="w-20 text-right text-sm font-bold">{money(i.price * i.qty)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <button onClick={() => setModal('discount')} className="flex w-full justify-between text-slate-600 hover:text-brand-600">
              <span className="flex items-center gap-1"><Percent className="h-3.5 w-3.5" />Discount {discount ? `(${discount}%)` : ''}</span><span>{discountAmt ? `- ${money(discountAmt)}` : 'Add'}</span>
            </button>
            <div className="flex justify-between text-slate-600"><span>Tax ({settings.taxRate}%)</span><span>{money(tax)}</span></div>
            {fee > 0 && <div className="flex justify-between text-slate-600"><span>Delivery fee</span><span>{money(fee)}</span></div>}
            <div className="flex justify-between pt-2 font-display text-2xl font-extrabold text-ink-900"><span>Total</span><span>{money(total)}</span></div>
          </div>
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
            <button onClick={clear} disabled={!ticket.length} className="btn-ghost px-4"><Trash2 className="h-4 w-4" /></button>
            <button onClick={() => setModal('pay')} disabled={!ticket.length || (type === 'dine-in' && !table)} className="btn-primary py-3.5 text-base">
              {type === 'dine-in' && !table && ticket.length ? 'Select a table' : `Charge ${money(total)}`}
            </button>
          </div>
        </div>
      </section>

      {/* Table picker */}
      <Modal open={modal === 'tables'} onClose={() => setModal(null)} title="Select a table" wide>
        {['Main Hall', 'Terrace', 'Family'].map((zone) => (
          <div key={zone} className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{zone}</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {tables.filter((t) => t.zone === zone).map((t) => {
                const busy = busyTables.has(t.name)
                return (
                  <button key={t.id} onClick={() => { setTable(t.name); setModal(null) }} className={`rounded-2xl p-3 text-center ring-2 transition ${table === t.name ? 'bg-brand-500 text-white ring-brand-500' : busy ? 'bg-amber-50 ring-amber-200' : 'bg-emerald-50 ring-emerald-200 hover:ring-emerald-400'}`}>
                    <p className="font-display text-xl font-extrabold">{t.name}</p>
                    <p className="text-xs opacity-80">{t.seats} seats</p>
                    <p className={`mt-1 text-[10px] font-bold uppercase ${table === t.name ? '' : busy ? 'text-amber-600' : 'text-emerald-600'}`}>{busy ? 'Occupied' : 'Free'}</p>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </Modal>

      {/* Discount */}
      <Modal open={modal === 'discount'} onClose={() => setModal(null)} title="Apply discount">
        <div className="grid grid-cols-3 gap-2">
          {[0, 5, 10, 15, 20, 25].map((d) => (
            <button key={d} onClick={() => { setDiscount(d); setModal(null) }} className={`rounded-xl py-4 font-display text-xl font-extrabold ring-1 ${discount === d ? 'bg-brand-500 text-white ring-brand-500' : 'ring-slate-200 hover:bg-slate-50'}`}>{d ? `${d}%` : 'None'}</button>
          ))}
        </div>
      </Modal>

      {/* Payment */}
      <PayModal open={modal === 'pay'} onClose={() => setModal(null)} total={total} money={money} onPay={complete} />

      {/* Receipt */}
      <Modal open={modal === 'receipt'} onClose={() => setModal(null)} title="Order complete">
        {lastOrder && (
          <div>
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
              <p className="mt-2 text-lg font-bold">Order #{lastOrder.number} sent to kitchen</p>
              {lastOrder.tendered > 0 && <p className="text-slate-500">Change due: <b className="text-ink-900">{money(lastOrder.tendered - lastOrder.total)}</b></p>}
            </div>
            <div id="receipt" className="mx-auto mt-5 max-w-xs rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 font-mono text-xs">
              <p className="text-center text-sm font-bold">{settings.restaurantName}</p>
              <p className="text-center text-slate-500">{settings.address}</p>
              <p className="mt-2 text-center">#{lastOrder.number} · {lastOrder.channel.toUpperCase()} {lastOrder.table ? `· ${lastOrder.table}` : ''}</p>
              <p className="text-center text-slate-500">{new Date(lastOrder.createdAt).toLocaleString()}</p>
              <div className="my-3 border-t border-dashed border-slate-300" />
              {lastOrder.items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.qty} {i.name}</span><span>{(i.price * i.qty).toLocaleString()}</span></div>)}
              <div className="my-3 border-t border-dashed border-slate-300" />
              <div className="flex justify-between"><span>Subtotal</span><span>{lastOrder.subtotal.toLocaleString()}</span></div>
              {lastOrder.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{lastOrder.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between"><span>Tax</span><span>{lastOrder.tax.toLocaleString()}</span></div>
              {lastOrder.fee > 0 && <div className="flex justify-between"><span>Delivery</span><span>{lastOrder.fee.toLocaleString()}</span></div>}
              <div className="mt-1 flex justify-between text-sm font-bold"><span>TOTAL</span><span>{money(lastOrder.total)}</span></div>
              <p className="mt-1 text-center uppercase">Paid by {lastOrder.payment}</p>
              <p className="mt-3 text-center">Thank you! Come again ♥</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => window.print()} className="btn-ghost"><Printer className="h-4 w-4" />Print</button>
              <button onClick={() => setModal(null)} className="btn-primary">New order</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Active orders */}
      <Modal open={modal === 'active'} onClose={() => setModal(null)} title={`Active orders (${activeOrders.length})`} wide>
        <div className="space-y-2">
          {activeOrders.slice().reverse().map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3">
              <span className="font-display text-lg font-extrabold">#{o.number}</span>
              <ChannelBadge channel={o.channel} />
              {o.table && <span className="chip bg-white ring-1 ring-slate-200">{o.table}</span>}
              <span className="text-sm text-slate-500">{o.items.reduce((s, i) => s + i.qty, 0)} items · {timeAgo(o.createdAt)}</span>
              <span className="ml-auto font-bold">{money(o.total)}</span>
              <StatusBadge status={o.status} />
              {o.status === 'ready' && !['online', 'delivery'].includes(o.channel) && <button onClick={() => dispatch({ type: 'SET_STATUS', id: o.id, status: 'completed' })} className="btn-dark py-1.5 text-xs">Complete</button>}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

function CatBtn({ active, onClick, emoji, label }) {
  return (
    <button onClick={onClick} className={`flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl py-2.5 transition lg:w-full ${active ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
      <span className="text-2xl">{emoji}</span>
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  )
}

function PayModal({ open, onClose, total, money, onPay }) {
  const [method, setMethod] = useState('cash')
  const [tendered, setTendered] = useState('')
  const t = Number(tendered) || 0
  const quick = [total, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000, Math.ceil(total / 5000) * 5000].filter((v, i, a) => a.indexOf(v) === i)
  return (
    <Modal open={open} onClose={onClose} title="Take payment">
      <p className="text-center text-sm text-slate-500">Amount due</p>
      <p className="text-center font-display text-4xl font-extrabold text-ink-900">{money(total)}</p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {[['cash', 'Cash', Banknote], ['card', 'Card', CreditCard], ['online', 'Wallet / QR', Smartphone]].map(([k, l, Icon]) => (
          <button key={k} onClick={() => setMethod(k)} className={`flex flex-col items-center gap-1.5 rounded-xl py-4 text-sm font-semibold ring-1 transition ${method === k ? 'bg-brand-50 text-brand-700 ring-2 ring-brand-500' : 'ring-slate-200 hover:bg-slate-50'}`}><Icon className="h-6 w-6" />{l}</button>
        ))}
      </div>
      {method === 'cash' && (
        <div className="mt-5">
          <input type="number" value={tendered} onChange={(e) => setTendered(e.target.value)} placeholder="Cash received" className="input py-3 text-lg" />
          <div className="mt-2 flex flex-wrap gap-2">
            {quick.map((v) => <button key={v} onClick={() => setTendered(String(v))} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold hover:bg-slate-200">{money(v)}</button>)}
          </div>
          {t >= total && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-center font-semibold text-emerald-700">Change: {money(t - total)}</p>}
        </div>
      )}
      {method === 'online' && (
        <div className="mt-5 grid place-items-center rounded-xl bg-slate-50 p-5">
          <div className="grid h-36 w-36 grid-cols-7 gap-0.5 rounded-lg bg-white p-2">
            {Array.from({ length: 49 }, (_, i) => <span key={i} className={((i * 7 + 3) % 5 < 2 || [0, 1, 7, 8, 5, 6, 12, 13, 35, 36, 42, 43].includes(i)) ? 'bg-ink-900' : ''} />)}
          </div>
          <p className="mt-2 text-sm text-slate-500">Customer scans to pay</p>
        </div>
      )}
      <button onClick={() => { onPay(method, method === 'cash' ? t : 0); setTendered('') }} disabled={method === 'cash' && t > 0 && t < total} className="btn-primary mt-6 w-full py-3.5 text-base">
        <CheckCircle2 className="h-5 w-5" />Complete payment
      </button>
    </Modal>
  )
}

function PinLock({ staff, onUnlock, settings }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const press = (d) => {
    const p = (pin + d).slice(0, 4)
    setPin(p); setErr(false)
    if (p.length === 4) {
      const s = staff.find((x) => x.pin === p)
      if (s) setTimeout(() => onUnlock(s), 150)
      else setTimeout(() => { setErr(true); setPin('') }, 200)
    }
  }
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-900 p-6">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-500/30 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
      <div className="relative w-full max-w-sm text-center text-white">
        <div className="flex justify-center"><Logo dark /></div>
        <p className="mt-8 text-sm text-slate-400">{settings.restaurantName} · POS Terminal</p>
        <h1 className="mt-1 text-2xl font-extrabold">Enter your PIN</h1>
        <div className={`mt-6 flex justify-center gap-3 ${err ? 'animate-[slideIn_.2s]' : ''}`}>
          {[0, 1, 2, 3].map((i) => <span key={i} className={`h-4 w-4 rounded-full transition ${i < pin.length ? 'bg-brand-500 scale-110' : err ? 'bg-rose-500/60' : 'bg-white/20'}`} />)}
        </div>
        {err && <p className="mt-3 text-sm text-rose-400">Incorrect PIN, try again</p>}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <button key={d} onClick={() => press(String(d))} className="rounded-2xl bg-white/5 py-5 font-display text-2xl font-bold ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95">{d}</button>)}
          <button onClick={() => setPin('')} className="rounded-2xl py-5 text-sm text-slate-400 hover:text-white"><X className="mx-auto h-6 w-6" /></button>
          <button onClick={() => press('0')} className="rounded-2xl bg-white/5 py-5 font-display text-2xl font-bold ring-1 ring-white/10 hover:bg-white/10 active:scale-95">0</button>
          <button onClick={() => setPin(pin.slice(0, -1))} className="rounded-2xl py-5 text-slate-400 hover:text-white"><Delete className="mx-auto h-6 w-6" /></button>
        </div>
        <div className="mt-8 rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Demo logins — tap to sign in</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {staff.slice(0, 4).map((s) => (
              <button key={s.id} onClick={() => onUnlock(s)} className="flex items-center gap-2 rounded-xl bg-white/5 py-1.5 pl-1.5 pr-3 text-xs hover:bg-white/10">
                <span className="grid h-6 w-6 place-items-center rounded-md font-bold" style={{ background: s.color }}>{s.name[0]}</span>
                {s.name.split(' ')[0]} · <span className="text-slate-400">{s.pin}</span>
              </button>
            ))}
          </div>
        </div>
        <Link to="/" className="mt-6 inline-block text-sm text-slate-500 hover:text-white">← Back to website</Link>
      </div>
    </div>
  )
}
