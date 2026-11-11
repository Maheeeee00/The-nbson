import { Link, useParams } from 'react-router-dom'
import { Check, ChefHat, Package, Bike, PartyPopper, ArrowLeft, Phone, ClipboardList } from 'lucide-react'
import { useStore, useMoney, useNow } from '../lib/store'
import CityMap, { etaFor } from '../components/CityMap'

export default function TrackOrder() {
  const { id } = useParams()
  const { state } = useStore()
  const money = useMoney()
  const now = useNow(1000)
  const order = state.orders.find((o) => o.id === id)

  if (!order) {
    return <div className="grid min-h-screen place-items-center p-6 text-center"><div><p className="text-xl font-bold">Order not found</p><Link to="/order" className="btn-primary mt-4">Back to menu</Link></div></div>
  }

  const isDelivery = order.channel === 'online' || order.channel === 'delivery'
  const steps = [
    { key: 'new', label: 'Order received', icon: ClipboardList },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: isDelivery ? 'Packed' : 'Ready for pickup', icon: Package },
    ...(isDelivery ? [{ key: 'out', label: 'On the way', icon: Bike }] : []),
    { key: 'completed', label: isDelivery ? 'Delivered' : 'Collected', icon: PartyPopper },
  ]
  const idx = Math.max(0, steps.findIndex((s) => s.key === order.status))
  const rider = state.riders.find((r) => r.id === order.rider)
  const headline = {
    new: 'We’ve got your order!', preparing: 'Your food is being prepared', ready: isDelivery ? 'Packed and waiting for a rider' : 'Ready for pickup!',
    out: `Arriving in ~${etaFor(order, now)} min`, completed: 'Enjoy your meal! 🎉', cancelled: 'Order cancelled',
  }[order.status]

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className="bg-ink-900 px-4 pb-24 pt-6 text-white">
        <div className="mx-auto max-w-3xl">
          <Link to="/order" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to menu</Link>
          <p className="mt-8 text-sm font-semibold text-brand-300">Order #{order.number}</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{headline}</h1>
          <p className="mt-2 text-slate-300">Updates live — keep this page open. Try moving the order along from the Kitchen screen.</p>
        </div>
      </div>
      <div className="mx-auto -mt-16 max-w-3xl space-y-4 px-4">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            {steps.map((s, i) => {
              const done = i <= idx && order.status !== 'cancelled'
              return (
                <div key={s.key} className="relative flex flex-1 flex-col items-center text-center">
                  {i > 0 && <div className={`absolute right-1/2 top-5 h-1 w-full -translate-y-1/2 rounded ${i <= idx ? 'bg-brand-500' : 'bg-slate-200'}`} />}
                  <div className={`relative z-10 grid h-10 w-10 place-items-center rounded-full transition ${done ? 'bg-brand-500 text-white shadow-glow' : 'bg-slate-100 text-slate-400'}`}>
                    {i < idx ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${done ? 'text-ink-900' : 'text-slate-400'}`}>{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {order.status === 'out' && (
          <div className="card overflow-hidden">
            <div className="h-72"><CityMap orders={[order]} riders={state.riders} now={now} /></div>
            {rider && (
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-violet-100 text-xl">🛵</div>
                  <div><p className="font-bold">{rider.name} is on the way</p><p className="text-sm text-slate-500">{rider.vehicle}</p></div>
                </div>
                <a href={`tel:${rider.phone}`} className="btn-ghost"><Phone className="h-4 w-4" />Call</a>
              </div>
            )}
          </div>
        )}

        <div className="card p-6">
          <h3 className="font-bold">Order summary</h3>
          <div className="mt-4 space-y-3">
            {order.items.map((i) => (
              <div key={i.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="text-xl">{i.emoji}</span>{i.qty}× {i.name}</span>
                <span className="font-semibold">{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t pt-4 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{money(order.tax)}</span></div>
            {order.fee > 0 && <div className="flex justify-between"><span>Delivery</span><span>{money(order.fee)}</span></div>}
            <div className="flex justify-between pt-2 text-base font-bold text-ink-900"><span>Total</span><span>{money(order.total)}</span></div>
          </div>
          {order.customer?.address && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"><b>Deliver to:</b> {order.customer.address}</p>}
        </div>
      </div>
    </div>
  )
}
