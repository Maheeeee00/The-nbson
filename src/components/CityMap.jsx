// Stylised SVG city map used for live rider tracking (no API key needed).
// Restaurant sits in the centre; each order gets a deterministic destination.

export const DELIVERY_MINUTES = 12

export function destinationFor(order) {
  const n = order.number || 1
  const angle = ((n * 137.5) % 360) * (Math.PI / 180)
  const dist = 0.16 + ((n * 7) % 13) / 70
  return { x: 0.5 + Math.cos(angle) * dist, y: 0.5 + Math.sin(angle) * dist * 0.8 }
}

export function progressFor(order, now = Date.now()) {
  if (order.status === 'completed') return 1
  if (!order.dispatchedAt) return 0
  return Math.min(1, (now - order.dispatchedAt) / (DELIVERY_MINUTES * 60000))
}

export function etaFor(order, now = Date.now()) {
  const p = progressFor(order, now)
  return Math.max(0, Math.ceil(DELIVERY_MINUTES * (1 - p)))
}

// Route goes horizontally then vertically like real streets.
function pointOnRoute(dest, p) {
  const sx = 0.5, sy = 0.5
  const dx = Math.abs(dest.x - sx), dy = Math.abs(dest.y - sy)
  const total = dx + dy || 1
  const d = p * total
  if (d <= dx) return { x: sx + Math.sign(dest.x - sx) * d, y: sy }
  return { x: dest.x, y: sy + Math.sign(dest.y - sy) * (d - dx) }
}

export default function CityMap({ orders = [], riders = [], now = Date.now(), highlight, className = '' }) {
  const W = 800, H = 520
  const blocks = []
  for (let x = 0; x < 10; x++) for (let y = 0; y < 7; y++) {
    if ((x * 3 + y * 5) % 11 === 0) continue
    blocks.push({ x: x * 82 + 14, y: y * 76 + 12, w: 62, h: 56, park: (x + y * 2) % 9 === 0 })
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-full w-full ${className}`} preserveAspectRatio="xMidYMid meet" style={{ background: '#eef2f7' }}>
      <rect width={W} height={H} fill="#eef2f7" />
      <path d={`M0 ${H * 0.78} C ${W * 0.3} ${H * 0.7}, ${W * 0.5} ${H * 0.95}, ${W} ${H * 0.82} L ${W} ${H} L 0 ${H} Z`} fill="#cfe3f5" />
      {blocks.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={b.park ? '#d7efd9' : '#ffffff'} stroke="#e2e8f0" />)}
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#fde68a" strokeWidth="10" opacity=".7" />
      <line x1={W / 2} y1="0" x2={W / 2} y2={H} stroke="#fde68a" strokeWidth="10" opacity=".7" />

      {orders.map((o) => {
        const dest = destinationFor(o)
        const p = progressFor(o, now)
        const pos = pointOnRoute(dest, p)
        const rider = riders.find((r) => r.id === o.rider)
        const hl = !highlight || highlight === o.id
        return (
          <g key={o.id} opacity={hl ? 1 : 0.35}>
            <polyline points={`${W / 2},${H / 2} ${dest.x * W},${H / 2} ${dest.x * W},${dest.y * H}`} fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round" />
            <g transform={`translate(${dest.x * W},${dest.y * H})`}>
              <circle r="16" fill="#10b981" opacity=".2" />
              <circle r="8" fill="#10b981" stroke="#fff" strokeWidth="3" />
              <text y="-18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#065f46">#{o.number}</text>
            </g>
            <g transform={`translate(${pos.x * W},${pos.y * H})`} style={{ transition: 'transform 1s linear' }}>
              <circle r="22" fill="#8b5cf6" opacity=".18"><animate attributeName="r" values="14;26;14" dur="2s" repeatCount="indefinite" /></circle>
              <circle r="14" fill="#7c3aed" stroke="#fff" strokeWidth="3" />
              <text y="5" textAnchor="middle" fontSize="14">🛵</text>
              {rider && <text y="32" textAnchor="middle" fontSize="11" fontWeight="700" fill="#4c1d95">{rider.name}</text>}
            </g>
          </g>
        )
      })}

      <g transform={`translate(${W / 2},${H / 2})`}>
        <circle r="26" fill="#fe5011" opacity=".18" />
        <circle r="16" fill="#fe5011" stroke="#fff" strokeWidth="4" />
        <text y="5" textAnchor="middle" fontSize="14">🍽️</text>
      </g>
    </svg>
  )
}
