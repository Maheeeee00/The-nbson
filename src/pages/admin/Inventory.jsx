import { useState } from 'react'
import { Plus, Minus, AlertTriangle, Package, Pencil, Wallet } from 'lucide-react'
import { useStore, useMoney } from '../../lib/store'
import { Modal } from '../../components/ui'
import { PageHead } from './AdminLayout'

export default function Inventory() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const [edit, setEdit] = useState(null)
  const inv = state.inventory
  const low = inv.filter((i) => i.qty < i.min)
  const value = inv.reduce((s, i) => s + i.qty * i.cost, 0)

  return (
    <div>
      <PageHead title="Inventory" sub="Track stock levels and get alerted before you run out">
        <button onClick={() => setEdit({ name: '', unit: 'pcs', qty: 0, min: 10, cost: 0 })} className="btn-primary"><Plus className="h-4 w-4" />Add stock item</button>
      </PageHead>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[[Package, 'Stock items', inv.length, 'from-indigo-500 to-violet-500'], [AlertTriangle, 'Low stock', low.length, 'from-rose-500 to-pink-500'], [Wallet, 'Stock value', money(value), 'from-emerald-500 to-teal-500']].map(([Icon, l, v, g]) => (
          <div key={l} className="card flex items-center gap-4 p-5">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${g} text-white shadow-lg`}><Icon className="h-6 w-6" /></span>
            <div><p className="text-sm text-slate-500">{l}</p><p className="font-display text-2xl font-extrabold text-ink-900">{v}</p></div>
          </div>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-3">Item</th><th className="px-5 py-3">Level</th><th className="px-5 py-3">In stock</th><th className="px-5 py-3">Min</th><th className="px-5 py-3">Unit cost</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Adjust</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inv.map((i) => {
              const ratio = Math.min(1, i.qty / (i.min * 2))
              const isLow = i.qty < i.min
              return (
                <tr key={i.id}>
                  <td className="px-5 py-4 font-semibold">{i.name}</td>
                  <td className="w-48 px-5 py-4"><div className="h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${isLow ? 'bg-rose-500' : ratio < 0.7 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${ratio * 100}%` }} /></div></td>
                  <td className="px-5 py-4 font-bold">{i.qty} <span className="font-normal text-slate-500">{i.unit}</span></td>
                  <td className="px-5 py-4 text-slate-500">{i.min} {i.unit}</td>
                  <td className="px-5 py-4 text-slate-500">{money(i.cost)}</td>
                  <td className="px-5 py-4">{isLow ? <span className="chip bg-rose-100 text-rose-700">Reorder</span> : <span className="chip bg-emerald-100 text-emerald-700">Healthy</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => dispatch({ type: 'ADJUST_STOCK', id: i.id, delta: -1 })} className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-slate-200 hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
                      <button onClick={() => dispatch({ type: 'ADJUST_STOCK', id: i.id, delta: 10 })} className="rounded-lg bg-emerald-50 px-2.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100">+10</button>
                      <button onClick={() => dispatch({ type: 'ADJUST_STOCK', id: i.id, delta: 1 })} className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-slate-200 hover:bg-slate-50"><Plus className="h-4 w-4" /></button>
                      <button onClick={() => setEdit(i)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit stock item' : 'New stock item'}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'SAVE_STOCK', item: { ...edit, qty: +edit.qty, min: +edit.min, cost: +edit.cost } }); setEdit(null) }} className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Name</span><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              {[['qty', 'Quantity'], ['min', 'Minimum level'], ['cost', 'Unit cost']].map(([k, l]) => <label key={k} className="block"><span className="mb-1.5 block text-sm font-semibold">{l}</span><input type="number" step="any" className="input" value={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} /></label>)}
              <label className="block"><span className="mb-1.5 block text-sm font-semibold">Unit</span><select className="input" value={edit.unit} onChange={(e) => setEdit({ ...edit, unit: e.target.value })}>{['pcs', 'kg', 'g', 'L', 'ml', 'balls', 'packs'].map((u) => <option key={u}>{u}</option>)}</select></label>
            </div>
            <button className="btn-primary w-full py-3">Save</button>
          </form>
        )}
      </Modal>
    </div>
  )
}
