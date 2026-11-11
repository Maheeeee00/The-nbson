const DAY = 86400000
export const startOfDay = (t = Date.now()) => new Date(t).setHours(0, 0, 0, 0)

export const valid = (orders) => orders.filter((o) => o.status !== 'cancelled')

export function inRange(orders, from, to = Date.now()) {
  return orders.filter((o) => o.createdAt >= from && o.createdAt <= to)
}

export function summary(orders) {
  const v = valid(orders)
  const revenue = v.reduce((s, o) => s + o.total, 0)
  return { revenue, count: v.length, avg: v.length ? revenue / v.length : 0, items: v.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0) }
}

export function pct(a, b) {
  if (!b) return 0
  return ((a - b) / b) * 100
}

export function dailySeries(orders, days = 14) {
  const today = startOfDay()
  return Array.from({ length: days }, (_, i) => {
    const from = today - (days - 1 - i) * DAY
    const day = valid(inRange(orders, from, from + DAY - 1))
    return {
      date: new Date(from).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      revenue: day.reduce((s, o) => s + o.total, 0),
      orders: day.length,
    }
  })
}

export function byHour(orders) {
  const h = Array.from({ length: 24 }, (_, i) => ({ hour: i, label: `${i % 12 || 12}${i < 12 ? 'a' : 'p'}`, orders: 0, revenue: 0 }))
  valid(orders).forEach((o) => { const x = h[new Date(o.createdAt).getHours()]; x.orders++; x.revenue += o.total })
  return h.filter((x) => x.hour >= 11 || x.hour <= 2)
}

export function byChannel(orders) {
  const map = {}
  valid(orders).forEach((o) => { map[o.channel] = (map[o.channel] || 0) + o.total })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function byPayment(orders) {
  const map = {}
  valid(orders).forEach((o) => { map[o.payment] = (map[o.payment] || 0) + o.total })
  return Object.entries(map).map(([name, value]) => ({ name, value }))
}

export function topItems(orders, n = 6) {
  const map = {}
  valid(orders).forEach((o) => o.items.forEach((i) => {
    map[i.id] = map[i.id] || { id: i.id, name: i.name, emoji: i.emoji, qty: 0, revenue: 0 }
    map[i.id].qty += i.qty
    map[i.id].revenue += i.qty * i.price
  }))
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, n)
}

export function byCategory(orders, menu, categories) {
  const catOf = Object.fromEntries(menu.map((m) => [m.id, m.cat]))
  const map = {}
  valid(orders).forEach((o) => o.items.forEach((i) => { const c = catOf[i.id] || 'other'; map[c] = (map[c] || 0) + i.qty * i.price }))
  return categories.map((c) => ({ name: c.name, value: map[c.id] || 0 })).filter((x) => x.value > 0)
}

export const COLORS = ['#fe5011', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9', '#8b5cf6', '#84cc16']

export function toCSV(orders) {
  const head = ['Order', 'Date', 'Channel', 'Table', 'Customer', 'Items', 'Subtotal', 'Discount', 'Tax', 'Fee', 'Total', 'Payment', 'Status']
  const rows = orders.map((o) => [o.number, new Date(o.createdAt).toISOString(), o.channel, o.table || '', o.customer?.name || '', o.items.map((i) => `${i.qty}x ${i.name}`).join('; '), o.subtotal, o.discount || 0, o.tax, o.fee || 0, o.total, o.payment, o.status])
  return [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export function download(name, text) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
  a.download = name
  a.click()
}
