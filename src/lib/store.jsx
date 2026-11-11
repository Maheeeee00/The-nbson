import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { CATEGORIES, MENU, TABLES, INVENTORY, STAFF, RIDERS, DEFAULT_SETTINGS, buildHistory, buildLiveOrders } from './data'

// Servora keeps all demo data in the browser (localStorage) so the whole system
// works on Vercel with no backend. Open the POS, Kitchen and Online Store in
// different tabs — they stay in sync live through the `storage` event.

const KEY = 'servora-state-v1'
const Ctx = createContext(null)

function initialState() {
  const { orders, nextNumber } = buildHistory(DEFAULT_SETTINGS.taxRate)
  const live = buildLiveOrders(nextNumber)
  return {
    settings: DEFAULT_SETTINGS,
    categories: CATEGORIES,
    menu: MENU,
    tables: TABLES,
    inventory: INVENTORY,
    staff: STAFF,
    riders: RIDERS,
    orders: [...orders, ...live],
    nextNumber: nextNumber + live.length,
    simulate: false,
    notifications: [],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* storage unavailable */ }
  return initialState()
}

const uid = (p) => p + Math.random().toString(36).slice(2, 9)

function reducer(state, a) {
  switch (a.type) {
    case 'REPLACE':
      return a.state
    case 'RESET':
      return initialState()
    case 'PLACE_ORDER': {
      const number = state.nextNumber
      const order = { ...a.order, id: `o${number}`, number, createdAt: Date.now(), status: a.order.status || (state.settings.autoAccept ? 'preparing' : 'new') }
      // deduct a little inventory per item for realism
      const units = order.items.reduce((s, i) => s + i.qty, 0)
      const inventory = state.inventory.map((inv, idx) => (idx % 3 === number % 3 ? { ...inv, qty: Math.max(0, +(inv.qty - units * 0.5).toFixed(1)) } : inv))
      const note = { id: uid('n'), text: `New ${order.channel} order #${number}`, at: Date.now(), orderId: order.id }
      return { ...state, orders: [...state.orders, order], nextNumber: number + 1, inventory, notifications: [note, ...state.notifications].slice(0, 20) }
    }
    case 'SET_STATUS':
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === a.id ? { ...o, status: a.status, ...(a.status === 'out' ? { dispatchedAt: Date.now() } : {}), ...(a.status === 'completed' ? { completedAt: Date.now() } : {}) } : o),
      }
    case 'ASSIGN_RIDER':
      return { ...state, orders: state.orders.map((o) => (o.id === a.id ? { ...o, rider: a.rider, status: 'out', dispatchedAt: Date.now() } : o)) }
    case 'SAVE_ITEM': {
      const exists = state.menu.some((m) => m.id === a.item.id)
      return { ...state, menu: exists ? state.menu.map((m) => (m.id === a.item.id ? a.item : m)) : [...state.menu, { ...a.item, id: uid('m') }] }
    }
    case 'DELETE_ITEM':
      return { ...state, menu: state.menu.filter((m) => m.id !== a.id) }
    case 'TOGGLE_ITEM':
      return { ...state, menu: state.menu.map((m) => (m.id === a.id ? { ...m, available: !m.available } : m)) }
    case 'ADJUST_STOCK':
      return { ...state, inventory: state.inventory.map((i) => (i.id === a.id ? { ...i, qty: Math.max(0, +(i.qty + a.delta).toFixed(1)) } : i)) }
    case 'SAVE_STOCK': {
      const exists = state.inventory.some((i) => i.id === a.item.id)
      return { ...state, inventory: exists ? state.inventory.map((i) => (i.id === a.item.id ? a.item : i)) : [...state.inventory, { ...a.item, id: uid('i') }] }
    }
    case 'SAVE_STAFF': {
      const exists = state.staff.some((s) => s.id === a.member.id)
      return { ...state, staff: exists ? state.staff.map((s) => (s.id === a.member.id ? a.member : s)) : [...state.staff, { ...a.member, id: uid('s') }] }
    }
    case 'DELETE_STAFF':
      return { ...state, staff: state.staff.filter((s) => s.id !== a.id) }
    case 'SETTINGS':
      return { ...state, settings: { ...state.settings, ...a.patch } }
    case 'SIMULATE':
      return { ...state, simulate: a.on }
    case 'CLEAR_NOTES':
      return { ...state, notifications: [] }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const fromStorage = useRef(false)

  // persist
  useEffect(() => {
    if (fromStorage.current) { fromStorage.current = false; return }
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* ignore */ }
  }, [state])

  // cross-tab live sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY && e.newValue) {
        fromStorage.current = true
        dispatch({ type: 'REPLACE', state: JSON.parse(e.newValue) })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // demo simulator: generates realistic incoming orders and moves them along
  const stateRef = useRef(state)
  stateRef.current = state
  useEffect(() => {
    if (!state.simulate) return
    const t = setInterval(() => {
      const s = stateRef.current
      const r = Math.random()
      if (r < 0.45) {
        const avail = s.menu.filter((m) => m.available)
        const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
          const m = avail[Math.floor(Math.random() * avail.length)]
          return { id: m.id, name: m.name, price: m.price, qty: 1 + Math.floor(Math.random() * 2), emoji: m.emoji }
        })
        const channel = ['online', 'online', 'dine-in', 'takeaway', 'delivery'][Math.floor(Math.random() * 5)]
        dispatch({ type: 'PLACE_ORDER', order: makeOrder(s, items, { channel, table: channel === 'dine-in' ? `T${1 + Math.floor(Math.random() * 12)}` : null, payment: 'card', customer: { name: ['Walk-in', 'Ali', 'Sana', 'Hamid', 'Rida'][Math.floor(Math.random() * 5)], phone: '0300-0000000', address: 'Gulberg III' } }) })
      } else {
        const active = s.orders.filter((o) => ['new', 'preparing', 'ready', 'out'].includes(o.status))
        if (!active.length) return
        const o = active[Math.floor(Math.random() * active.length)]
        const isDelivery = o.channel === 'delivery' || o.channel === 'online'
        if (o.status === 'new') dispatch({ type: 'SET_STATUS', id: o.id, status: 'preparing' })
        else if (o.status === 'preparing') dispatch({ type: 'SET_STATUS', id: o.id, status: 'ready' })
        else if (o.status === 'ready' && isDelivery) dispatch({ type: 'ASSIGN_RIDER', id: o.id, rider: s.riders[Math.floor(Math.random() * s.riders.length)].id })
        else dispatch({ type: 'SET_STATUS', id: o.id, status: 'completed' })
      }
    }, 5000)
    return () => clearInterval(t)
  }, [state.simulate])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

export function makeOrder(state, items, extra = {}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const discount = extra.discount || 0
  const tax = Math.round(((subtotal - discount) * state.settings.taxRate) / 100)
  const fee = extra.channel === 'delivery' || extra.channel === 'online' ? state.settings.deliveryFee : 0
  return { items, subtotal, tax, fee, discount, total: subtotal - discount + tax + fee, payment: 'cash', customer: {}, ...extra }
}

export function useMoney() {
  const { state } = useStore()
  const c = state.settings.currency
  return (n) => `${c} ${Math.round(n).toLocaleString()}`
}

export const STATUS = {
  new: { label: 'New', cls: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  preparing: { label: 'Preparing', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  ready: { label: 'Ready', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  out: { label: 'Out for delivery', cls: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
}

export const CHANNEL = {
  'dine-in': { label: 'Dine-in', cls: 'bg-indigo-50 text-indigo-700' },
  takeaway: { label: 'Takeaway', cls: 'bg-orange-50 text-orange-700' },
  delivery: { label: 'Delivery', cls: 'bg-violet-50 text-violet-700' },
  online: { label: 'Online', cls: 'bg-emerald-50 text-emerald-700' },
}

export function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function useNow(interval = 1000) {
  const [, force] = useReducer((x) => x + 1, 0)
  useEffect(() => { const t = setInterval(force, interval); return () => clearInterval(t) }, [interval])
  return Date.now()
}
