import { useState } from 'react'
import { Save, Store, Receipt, Globe, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../lib/store'
import { Toggle } from '../../components/ui'
import { PageHead } from './AdminLayout'

export default function Settings() {
  const { state, dispatch } = useStore()
  const [f, setF] = useState(state.settings)
  const [saved, setSaved] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = () => {
    dispatch({ type: 'SETTINGS', patch: { ...f, taxRate: +f.taxRate, deliveryFee: +f.deliveryFee } })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl">
      <PageHead title="Settings" sub="Configure your restaurant">
        <button onClick={save} className="btn-primary">{saved ? <><CheckCircle2 className="h-4 w-4" />Saved</> : <><Save className="h-4 w-4" />Save changes</>}</button>
      </PageHead>
      <div className="space-y-5">
        <Card icon={Store} title="Restaurant profile" sub="Shown on receipts and your online store">
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Restaurant name"><input className="input" value={f.restaurantName} onChange={set('restaurantName')} /></F>
            <F label="Tagline"><input className="input" value={f.tagline} onChange={set('tagline')} /></F>
            <F label="Phone"><input className="input" value={f.phone} onChange={set('phone')} /></F>
            <F label="Opening hours"><input className="input" value={f.openHours} onChange={set('openHours')} /></F>
            <div className="sm:col-span-2"><F label="Address"><input className="input" value={f.address} onChange={set('address')} /></F></div>
          </div>
        </Card>
        <Card icon={Receipt} title="Tax, fees & currency">
          <div className="grid gap-4 sm:grid-cols-3">
            <F label="Currency symbol"><select className="input" value={f.currency} onChange={set('currency')}>{['Rs', 'AED', 'A$', '$', '£', '€', 'SAR', '₹'].map((c) => <option key={c}>{c}</option>)}</select></F>
            <F label="Tax rate (%)"><input type="number" className="input" value={f.taxRate} onChange={set('taxRate')} /></F>
            <F label="Delivery fee"><input type="number" className="input" value={f.deliveryFee} onChange={set('deliveryFee')} /></F>
          </div>
        </Card>
        <Card icon={Globe} title="Online ordering">
          <Row title="Accept online orders" text="Customers can order from your website" on={f.onlineOrdering} onChange={(v) => setF({ ...f, onlineOrdering: v })} />
          <Row title="Auto-accept orders" text="Send online orders straight to the kitchen" on={f.autoAccept} onChange={(v) => setF({ ...f, autoAccept: v })} />
        </Card>
      </div>
    </div>
  )
}

const Card = ({ icon: Icon, title, sub, children }) => (
  <div className="card p-6">
    <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span><div><h3 className="font-bold text-ink-900">{title}</h3>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div></div>
    {children}
  </div>
)
const F = ({ label, children }) => <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>{children}</label>
const Row = ({ title, text, on, onChange }) => (
  <div className="flex items-center justify-between border-t border-slate-100 py-4 first:border-0 first:pt-0">
    <div><p className="font-semibold">{title}</p><p className="text-sm text-slate-500">{text}</p></div>
    <Toggle on={on} onChange={onChange} />
  </div>
)
