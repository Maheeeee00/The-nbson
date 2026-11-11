import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { Download } from 'lucide-react'
import { useStore, useMoney, CHANNEL } from '../../lib/store'
import { inRange, summary, dailySeries, byPayment, byCategory, topItems, startOfDay, toCSV, download, COLORS, valid } from '../../lib/analytics'
import { PageHead } from './AdminLayout'

const RANGES = [['Today', 1], ['7 days', 7], ['30 days', 30]]

export default function Reports() {
  const { state } = useStore()
  const money = useMoney()
  const [days, setDays] = useState(7)
  const from = startOfDay() - (days - 1) * 86400000
  const orders = inRange(state.orders, from)
  const s = summary(orders)
  const daily = dailySeries(state.orders, Math.max(days, 7))
  const pay = byPayment(orders)
  const cats = byCategory(orders, state.menu, state.categories)
  const items = topItems(orders, 10)
  const cancelled = orders.filter((o) => o.status === 'cancelled').length
  const tax = valid(orders).reduce((a, o) => a + o.tax, 0)
  const disc = valid(orders).reduce((a, o) => a + (o.discount || 0), 0)
  const channelRows = Object.keys(CHANNEL).map((k) => { const x = summary(orders.filter((o) => o.channel === k)); return { k, ...x } })

  return (
    <div className="space-y-6">
      <PageHead title="Reports" sub="Detailed sales performance">
        <div className="flex rounded-xl bg-white p-1 ring-1 ring-slate-200">
          {RANGES.map(([l, d]) => <button key={d} onClick={() => setDays(d)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${days === d ? 'bg-ink-900 text-white' : 'text-slate-600'}`}>{l}</button>)}
        </div>
        <button onClick={() => download(`servora-report-${days}d.csv`, toCSV(orders))} className="btn-ghost"><Download className="h-4 w-4" />Export</button>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {[['Gross sales', money(s.revenue)], ['Orders', s.count], ['Avg. ticket', money(s.avg)], ['Items sold', s.items], ['Tax collected', money(tax)], ['Cancelled', cancelled]].map(([l, v]) => (
          <div key={l} className="card p-4"><p className="text-xs font-medium text-slate-500">{l}</p><p className="mt-1 font-display text-xl font-extrabold text-ink-900">{v}</p></div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-bold">Daily revenue & orders</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={daily} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="l" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v, n) => (n === 'revenue' ? money(v) : v)} contentStyle={{ borderRadius: 12 }} />
                <Line yAxisId="l" type="monotone" dataKey="revenue" stroke="#fe5011" strokeWidth={3} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={false} strokeDasharray="5 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Payment methods</h3>
          <div className="h-48"><ResponsiveContainer><PieChart><Pie data={pay} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} stroke="none" paddingAngle={3}>{pay.map((_, i) => <Cell key={i} fill={COLORS[i + 1]} />)}</Pie><Tooltip formatter={(v) => money(v)} /></PieChart></ResponsiveContainer></div>
          <div className="space-y-2">{pay.map((p, i) => <div key={p.name} className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i + 1] }} /><span className="flex-1 capitalize">{p.name}</span><span className="font-semibold">{money(p.value)}</span></div>)}</div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold">Sales by category</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={cats} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip formatter={(v) => money(v)} cursor={{ fill: '#fff4ed' }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>{cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Channel performance</h3>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-slate-400"><tr><th className="pb-3">Channel</th><th className="pb-3 text-right">Orders</th><th className="pb-3 text-right">Avg.</th><th className="pb-3 text-right">Revenue</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {channelRows.map((r) => <tr key={r.k}><td className="py-3 font-semibold">{CHANNEL[r.k].label}</td><td className="py-3 text-right">{r.count}</td><td className="py-3 text-right">{money(r.avg)}</td><td className="py-3 text-right font-bold">{money(r.revenue)}</td></tr>)}
            </tbody>
          </table>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Discounts given: <b className="text-ink-900">{money(disc)}</b></div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold">Item sales</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-slate-400"><tr><th className="pb-3">#</th><th className="pb-3">Item</th><th className="pb-3 text-right">Qty sold</th><th className="pb-3 text-right">Revenue</th><th className="pb-3 text-right">Share</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((i, idx) => <tr key={i.id}><td className="py-3 text-slate-400">{idx + 1}</td><td className="py-3 font-semibold">{i.emoji} {i.name}</td><td className="py-3 text-right">{i.qty}</td><td className="py-3 text-right font-bold">{money(i.revenue)}</td><td className="py-3 text-right text-slate-500">{s.revenue ? ((i.revenue / s.revenue) * 100).toFixed(1) : 0}%</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
