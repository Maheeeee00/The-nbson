import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid } from 'recharts'
import { TrendingUp, TrendingDown, Wallet, ReceiptText, Users, Activity, ArrowRight, AlertTriangle, MonitorSmartphone } from 'lucide-react'
import { useStore, useMoney, timeAgo, CHANNEL } from '../../lib/store'
import { inRange, summary, pct, dailySeries, byHour, byChannel, topItems, startOfDay, COLORS } from '../../lib/analytics'
import { StatusBadge, ChannelBadge } from '../../components/ui'
import { PageHead } from './AdminLayout'

export default function Dashboard() {
  const { state } = useStore()
  const money = useMoney()
  const { orders, inventory } = state
  const today = startOfDay()
  const t = summary(inRange(orders, today))
  const y = summary(inRange(orders, today - 86400000, Date.now() - 86400000))
  const series = dailySeries(orders, 14)
  const hours = byHour(inRange(orders, today - 6 * 86400000))
  const channels = byChannel(inRange(orders, today - 29 * 86400000))
  const top = topItems(inRange(orders, today - 29 * 86400000), 5)
  const live = orders.filter((o) => ['new', 'preparing', 'ready', 'out'].includes(o.status)).slice().reverse()
  const low = inventory.filter((i) => i.qty < i.min)
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const kpis = [
    { label: 'Revenue today', value: money(t.revenue), change: pct(t.revenue, y.revenue), icon: Wallet, grad: 'from-brand-500 to-rose-500' },
    { label: 'Orders today', value: t.count, change: pct(t.count, y.count), icon: ReceiptText, grad: 'from-indigo-500 to-violet-500' },
    { label: 'Average ticket', value: money(t.avg), change: pct(t.avg, y.avg), icon: TrendingUp, grad: 'from-emerald-500 to-teal-500' },
    { label: 'Live orders', value: live.length, sub: `${live.filter((o) => o.status === 'new').length} waiting to accept`, icon: Activity, grad: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <PageHead title={`${greet}, Ayesha 👋`} sub="Here’s what’s happening at your restaurant today.">
        <Link to="/pos" className="btn-primary"><MonitorSmartphone className="h-4 w-4" />Open POS</Link>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card relative overflow-hidden p-5">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${k.grad} opacity-10`} />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{k.label}</p>
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${k.grad} text-white shadow-lg`}><k.icon className="h-5 w-5" /></span>
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold text-ink-900">{k.value}</p>
            {k.change !== undefined ? (
              <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${k.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {k.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{Math.abs(k.change).toFixed(1)}% <span className="font-normal text-slate-400">vs same time yesterday</span>
              </p>
            ) : <p className="mt-1 text-xs text-slate-500">{k.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div><h3 className="font-bold text-ink-900">Revenue</h3><p className="text-sm text-slate-500">Last 14 days</p></div>
            <p className="font-display text-xl font-extrabold">{money(series.reduce((s, d) => s + d.revenue, 0))}</p>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ left: -10, right: 8 }}>
                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fe5011" stopOpacity={0.35} /><stop offset="1" stopColor="#fe5011" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => money(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="revenue" stroke="#fe5011" strokeWidth={3} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-ink-900">Sales by channel</h3>
          <p className="text-sm text-slate-500">Last 30 days</p>
          <div className="relative mt-2 h-52">
            <ResponsiveContainer>
              <PieChart><Pie data={channels} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={3} stroke="none">{channels.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip formatter={(v) => money(v)} /></PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-xs text-slate-500">Total</p><p className="font-display font-extrabold">{money(channels.reduce((s, c) => s + c.value, 0))}</p></div></div>
          </div>
          <div className="mt-2 space-y-2">
            {channels.map((c, i) => {
              const tot = channels.reduce((s, x) => s + x.value, 0)
              return <div key={c.name} className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} /><span className="flex-1">{CHANNEL[c.name]?.label}</span><span className="font-semibold">{((c.value / tot) * 100).toFixed(0)}%</span></div>
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink-900">Live orders</h3>
            <Link to="/admin/orders" className="flex items-center gap-1 text-sm font-semibold text-brand-600">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-400"><th className="pb-3">Order</th><th className="pb-3">Channel</th><th className="pb-3">Customer</th><th className="pb-3">Time</th><th className="pb-3 text-right">Total</th><th className="pb-3 text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {live.slice(0, 7).map((o) => (
                  <tr key={o.id} className="animate-slideIn">
                    <td className="py-3 font-bold">#{o.number}</td>
                    <td className="py-3"><ChannelBadge channel={o.channel} /></td>
                    <td className="py-3 text-slate-600">{o.table ? `Table ${o.table}` : o.customer?.name}</td>
                    <td className="py-3 text-slate-500">{timeAgo(o.createdAt)}</td>
                    <td className="py-3 text-right font-semibold">{money(o.total)}</td>
                    <td className="py-3 text-right"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {live.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No live orders right now</p>}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-ink-900">Best sellers</h3>
          <p className="text-sm text-slate-500">Last 30 days</p>
          <div className="mt-4 space-y-3">
            {top.map((i, idx) => (
              <div key={i.id} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-xl">{i.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{i.name}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-amber-400" style={{ width: `${(i.revenue / top[0].revenue) * 100}%` }} /></div>
                </div>
                <div className="text-right"><p className="text-sm font-bold">{money(i.revenue)}</p><p className="text-xs text-slate-500">{i.qty} sold</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-bold text-ink-900">Peak hours</h3>
          <p className="text-sm text-slate-500">Orders by hour, last 7 days</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer>
              <BarChart data={hours} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#fff4ed' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between"><h3 className="font-bold text-ink-900">Low stock</h3><Link to="/admin/inventory" className="text-sm font-semibold text-brand-600">Manage</Link></div>
          <div className="mt-4 space-y-2">
            {low.length === 0 && <p className="py-6 text-center text-sm text-slate-500">All stock levels healthy ✅</p>}
            {low.map((i) => (
              <div key={i.id} className="flex items-center gap-3 rounded-xl bg-rose-50 p-3">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <div className="flex-1"><p className="text-sm font-semibold">{i.name}</p><p className="text-xs text-slate-500">Min {i.min} {i.unit}</p></div>
                <span className="font-bold text-rose-600">{i.qty} {i.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
