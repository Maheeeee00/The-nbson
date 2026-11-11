import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react'
import { useStore, useMoney } from '../../lib/store'
import { Modal, Toggle, ConfirmButton } from '../../components/ui'
import { PageHead } from './AdminLayout'

const EMOJIS = ['🍔', '🍕', '🌯', '🍗', '🍢', '🍟', '🥗', '🍝', '🍜', '🍣', '🌮', '🥪', '🍰', '🍩', '🍦', '🍫', '🥤', '🧋', '☕', '🍹']
const BGS = ['linear-gradient(135deg,#fed7aa,#ea580c)', 'linear-gradient(135deg,#fecaca,#dc2626)', 'linear-gradient(135deg,#fef08a,#ca8a04)', 'linear-gradient(135deg,#bbf7d0,#16a34a)', 'linear-gradient(135deg,#bfdbfe,#2563eb)', 'linear-gradient(135deg,#ddd6fe,#7c3aed)', 'linear-gradient(135deg,#e7e5e4,#57534e)']
const BLANK = { name: '', price: '', cat: 'burgers', desc: '', emoji: '🍔', bg: BGS[0], available: true, popular: false }

export default function MenuManager() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState(null)
  const items = state.menu.filter((m) => (cat === 'all' || m.cat === cat) && m.name.toLowerCase().includes(q.toLowerCase()))

  const save = (e) => {
    e.preventDefault()
    dispatch({ type: 'SAVE_ITEM', item: { ...edit, price: Number(edit.price) } })
    setEdit(null)
  }

  return (
    <div>
      <PageHead title="Menu" sub={`${state.menu.length} items · ${state.menu.filter((m) => !m.available).length} unavailable`}>
        <button onClick={() => setEdit({ ...BLANK, cat: cat === 'all' ? 'burgers' : cat })} className="btn-primary"><Plus className="h-4 w-4" />Add item</button>
      </PageHead>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-9" placeholder="Search items" />
        </div>
        <div className="scrollbar-thin flex gap-2 overflow-x-auto">
          <button onClick={() => setCat('all')} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${cat === 'all' ? 'bg-ink-900 text-white' : 'bg-white ring-1 ring-slate-200'}`}>All</button>
          {state.categories.map((c) => <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${cat === c.id ? 'bg-ink-900 text-white' : 'bg-white ring-1 ring-slate-200'}`}>{c.emoji} {c.name}</button>)}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className={`card overflow-hidden transition ${!m.available ? 'opacity-60' : ''}`}>
            <div className="relative grid h-32 place-items-center text-6xl" style={{ background: m.bg }}>
              {m.emoji}
              {m.popular && <span className="absolute left-3 top-3 chip bg-white/90 text-amber-600"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />Popular</span>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-bold text-ink-900">{m.name}</p><p className="text-xs text-slate-500">{state.categories.find((c) => c.id === m.cat)?.name}</p></div>
                <p className="font-bold text-brand-600">{money(m.price)}</p>
              </div>
              <p className="mt-2 line-clamp-2 h-8 text-xs text-slate-500">{m.desc}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Toggle on={m.available} onChange={() => dispatch({ type: 'TOGGLE_ITEM', id: m.id })} />{m.available ? 'Available' : 'Sold out'}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEdit(m)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                  <ConfirmButton onConfirm={() => dispatch({ type: 'DELETE_ITEM', id: m.id })} armedLabel="Delete?" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></ConfirmButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit item' : 'New menu item'}>
        {edit && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid h-28 place-items-center rounded-2xl text-6xl" style={{ background: edit.bg }}>{edit.emoji}</div>
            <div className="flex flex-wrap gap-1.5">{EMOJIS.map((e) => <button type="button" key={e} onClick={() => setEdit({ ...edit, emoji: e })} className={`grid h-9 w-9 place-items-center rounded-lg text-xl ${edit.emoji === e ? 'bg-brand-100 ring-2 ring-brand-500' : 'bg-slate-100'}`}>{e}</button>)}</div>
            <div className="flex gap-2">{BGS.map((b) => <button type="button" key={b} onClick={() => setEdit({ ...edit, bg: b })} className={`h-8 w-8 rounded-full ${edit.bg === b ? 'ring-2 ring-ink-900 ring-offset-2' : ''}`} style={{ background: b }} />)}</div>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Name</span><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-1.5 block text-sm font-semibold">Price ({state.settings.currency})</span><input required type="number" min="0" className="input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value })} /></label>
              <label className="block"><span className="mb-1.5 block text-sm font-semibold">Category</span><select className="input" value={edit.cat} onChange={(e) => setEdit({ ...edit, cat: e.target.value })}>{state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            </div>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Description</span><textarea rows={2} className="input" value={edit.desc} onChange={(e) => setEdit({ ...edit, desc: e.target.value })} /></label>
            <div className="flex gap-6 text-sm font-semibold">
              <span className="flex items-center gap-2"><Toggle on={edit.available} onChange={(v) => setEdit({ ...edit, available: v })} />Available</span>
              <span className="flex items-center gap-2"><Toggle on={edit.popular} onChange={(v) => setEdit({ ...edit, popular: v })} />Mark as popular</span>
            </div>
            <button className="btn-primary w-full py-3">Save item</button>
          </form>
        )}
      </Modal>
    </div>
  )
}
