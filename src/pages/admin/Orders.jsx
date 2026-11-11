import { useMemo, useState } from 'react'
import { Download, Search, ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react'
import { useStore, useMoney, timeAgo, STATUS, CHANNEL } from '../../lib/store'
import { toCSV, download } from '../../lib/analytics'
import { StatusBadge, ChannelBadge, Modal, Empty } from '../../components/ui'
import { PageHead } from './AdminLayout'

const TABS = [['all', 'All'], ['active', 'Active'], ['new', 'New'], ['preparing', 'Preparing'], ['ready', 'Ready'], ['out', 'On the way'], ['completed', 'Completed'], ['cancelled', 'Cancelled']]
const PER = 12

export default function Orders() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const [tab, setTab] = useState('all')
  const [channel, setChannel] = useState('all')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [sel, setSel] = useState(null)

  const list = useMemo(() => {
    return state.orders.slice().reverse().filter((o) => {
      if (tab === 'active' && !['new', 'preparing', 'ready', 'out'].includes(o.status)) return false
      if (!['all', 'active'].includes(tab) && o.status !== tab) return false
      if (channel !== 'all' && o.channel !== channel) return false
      if (q && !(`${o.number} ${o.customer?.name || ''} ${o.table || ''}`.toLowerCase().includes(q.toLowerCase()))) return false
      return true
    })
  }, [state.orders, tab, channel, q])

  const pages = Math.max(1, Math.ceil(list.length / PER))
  const shown = list.slice(page * PER, page * PER + PER)
  const order = sel && state.orders.find((o) => o.id === sel)
  const count = (k) => k === 'all' ? state.orders.length : k === 'active' ? state.orders.filter((o) => ['new', 'preparing', 'ready', 'out'].includes(o.status)).length : state.orders.filter((o) => o.status === k).length

  return (
    <div>
      <PageHead title="Orders" sub={`${list.length.toLocaleString()} orders`}>
        <button onClick={() => download('servora-orders.csv', toCSV(list))} className="btn-ghost"><Download className="h-4 w-4" />Export CSV</button>
      </PageHead>

      <div className="card">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-3">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); setPage(0) }} className={`shrink-0 border-b-2 px-3 pb-3 text-sm font-semibold transition ${tab === k ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-ink-900'}`}>
              {l} <span className="ml-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{count(k)}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} className="input pl-9" placeholder="Search by order #, customer or table" />
          </div>
          <select value={channel} onChange={(e) => { setChannel(e.target.value); setPage(0) }} className="input w-auto">
            <option value="all">All channels</option>
            {Object.entries(CHANNEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Channel</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((o) => (
                <tr key={o.id} onClick={() => setSel(o.id)} className="cursor-pointer transition hover:bg-brand-50/40">
                  <td className="px-4 py-3 font-bold">#{o.number}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(o.createdAt).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-4 py-3"><ChannelBadge channel={o.channel} /></td>
                  <td className="px-4 py-3">{o.table ? `Table ${o.table}` : o.customer?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td className="px-4 py-3 capitalize text-slate-500">{o.payment}</td>
                  <td className="px-4 py-3 text-right font-semibold">{money(o.total)}</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {shown.length === 0 && <Empty icon={ReceiptText} title="No orders found" text="Try a different filter" />}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm">
          <span className="text-slate-500">Page {page + 1} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="btn-ghost px-3 py-2"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="btn-ghost px-3 py-2"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <Modal open={!!order} onClose={() => setSel(null)} title={order ? `Order #${order.number}` : ''}>
        {order && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2"><StatusBadge status={order.status} /><ChannelBadge channel={order.channel} />{order.table && <span className="chip bg-slate-100">Table {order.table}</span>}<span className="ml-auto text-sm text-slate-500">{timeAgo(order.createdAt)}</span></div>
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div><p className="text-xs text-slate-500">Customer</p><p className="font-semibold">{order.customer?.name || '—'}</p></div>
              <div><p className="text-xs text-slate-500">Phone</p><p className="font-semibold">{order.customer?.phone || '—'}</p></div>
              {order.customer?.address && <div className="sm:col-span-2"><p className="text-xs text-slate-500">Address</p><p className="font-semibold">{order.customer.address}</p></div>}
              {order.rider && <div><p className="text-xs text-slate-500">Rider</p><p className="font-semibold">{state.riders.find((r) => r.id === order.rider)?.name}</p></div>}
              {order.notes && <div className="sm:col-span-2"><p className="text-xs text-slate-500">Notes</p><p className="font-semibold">{order.notes}</p></div>}
            </div>
            <div className="space-y-2">
              {order.items.map((i) => <div key={i.id} className="flex justify-between text-sm"><span>{i.emoji} {i.qty}× {i.name}</span><span className="font-semibold">{money(i.qty * i.price)}</span></div>)}
              <div className="space-y-1 border-t pt-3 text-sm text-slate-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{money(order.discount)}</span></div>}
                <div className="flex justify-between"><span>Tax</span><span>{money(order.tax)}</span></div>
                {order.fee > 0 && <div className="flex justify-between"><span>Delivery</span><span>{money(order.fee)}</span></div>}
                <div className="flex justify-between pt-1 text-base font-bold text-ink-900"><span>Total · <span className="capitalize">{order.payment}</span></span><span>{money(order.total)}</span></div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Update status</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS).map(([k, v]) => (
                  <button key={k} onClick={() => dispatch({ type: 'SET_STATUS', id: order.id, status: k })} className={`rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition ${order.status === k ? 'bg-ink-900 text-white ring-ink-900' : 'ring-slate-200 hover:bg-slate-50'}`}>{v.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
