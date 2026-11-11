import { useState } from 'react'
import { Plus, Pencil, Trash2, KeyRound } from 'lucide-react'
import { useStore, useMoney } from '../../lib/store'
import { Modal, ConfirmButton } from '../../components/ui'
import { PageHead } from './AdminLayout'

const ROLES = ['Manager', 'Cashier', 'Waiter', 'Chef', 'Rider']
const COLORS = ['#fe5011', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9', '#8b5cf6']
const STATUS_CLS = { 'On shift': 'bg-emerald-100 text-emerald-700', Break: 'bg-amber-100 text-amber-700', Off: 'bg-slate-100 text-slate-600' }

export default function Staff() {
  const { state, dispatch } = useStore()
  const money = useMoney()
  const [edit, setEdit] = useState(null)
  const sales = (name) => state.orders.filter((o) => o.cashier === name && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <div>
      <PageHead title="Staff" sub={`${state.staff.filter((s) => s.status === 'On shift').length} of ${state.staff.length} on shift`}>
        <button onClick={() => setEdit({ name: '', role: 'Waiter', status: 'On shift', pin: '', color: COLORS[state.staff.length % COLORS.length] })} className="btn-primary"><Plus className="h-4 w-4" />Add staff</button>
      </PageHead>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.staff.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-extrabold text-white shadow-lg" style={{ background: s.color }}>{s.name.split(' ').map((x) => x[0]).join('')}</span>
              <div className="flex-1">
                <p className="text-lg font-bold text-ink-900">{s.name}</p>
                <p className="text-sm text-slate-500">{s.role}</p>
                <span className={`chip mt-2 ${STATUS_CLS[s.status]}`}>{s.status}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEdit(s)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                <ConfirmButton onConfirm={() => dispatch({ type: 'DELETE_STAFF', id: s.id })} armedLabel="Remove?" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></ConfirmButton>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
              <div><p className="text-xs text-slate-500">POS PIN</p><p className="flex items-center gap-1.5 font-mono font-semibold"><KeyRound className="h-3.5 w-3.5 text-slate-400" />{s.pin ? '•'.repeat(s.pin.length) : '—'}</p></div>
              <div><p className="text-xs text-slate-500">POS sales</p><p className="font-semibold">{money(sales(s.name))}</p></div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit staff member' : 'Add staff member'}>
        {edit && (
          <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'SAVE_STAFF', member: edit }); setEdit(null) }} className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Full name</span><input required className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-1.5 block text-sm font-semibold">Role</span><select className="input" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></label>
              <label className="block"><span className="mb-1.5 block text-sm font-semibold">Status</span><select className="input" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>{Object.keys(STATUS_CLS).map((r) => <option key={r}>{r}</option>)}</select></label>
            </div>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">4-digit POS PIN</span><input required pattern="\d{4}" maxLength={4} className="input font-mono" value={edit.pin} onChange={(e) => setEdit({ ...edit, pin: e.target.value.replace(/\D/g, '') })} /></label>
            <div className="flex gap-2">{COLORS.map((c) => <button type="button" key={c} onClick={() => setEdit({ ...edit, color: c })} className={`h-8 w-8 rounded-full ${edit.color === c ? 'ring-2 ring-ink-900 ring-offset-2' : ''}`} style={{ background: c }} />)}</div>
            <button className="btn-primary w-full py-3">Save</button>
          </form>
        )}
      </Modal>
    </div>
  )
}
