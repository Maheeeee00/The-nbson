import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, MonitorSmartphone, ChefHat, Bike, BarChart3, Boxes, Users, Zap, ShieldCheck, Globe, Check,
  ArrowRight, Play, Sparkles, Clock, Wallet, QrCode, Printer, ChevronDown, Menu, X, TrendingUp, Percent,
  Smartphone, Store, Flame, Timer, MapPin,
} from 'lucide-react'
import { Logo } from '../components/ui'

const NAV = [['Features', '#features'], ['Modules', '#modules'], ['How it works', '#how'], ['Pricing', '#pricing'], ['FAQ', '#faq']]

export default function Landing() {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto mt-3 max-w-7xl px-4">
          <nav className="flex items-center justify-between rounded-2xl bg-ink-900/70 px-4 py-2.5 ring-1 ring-white/10 backdrop-blur-xl">
            <Logo dark />
            <div className="hidden items-center gap-1 lg:flex">
              {NAV.map(([l, h]) => (
                <a key={h} href={h} onClick={(e) => { e.preventDefault(); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }) }} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">{l}</a>
              ))}
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">Log in</Link>
              <Link to="/admin" className="btn-primary">Try live demo <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <button className="text-white lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </nav>
          {open && (
            <div className="mt-2 rounded-2xl bg-ink-900 p-3 ring-1 ring-white/10 lg:hidden">
              {NAV.map(([l, h]) => (
                <a key={h} href={h} onClick={(e) => { e.preventDefault(); setOpen(false); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }) }} className="block rounded-lg px-3 py-2.5 text-slate-200 hover:bg-white/10">{l}</a>
              ))}
              <Link to="/admin" className="btn-primary mt-2 w-full">Try live demo</Link>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-900 pb-24 pt-36 text-white">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-brand-200 ring-1 ring-white/10">
            <Sparkles className="h-3.5 w-3.5" /> The all-in-one restaurant operating system
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Run your entire restaurant <span className="bg-gradient-to-r from-brand-300 via-brand-500 to-amber-400 bg-clip-text text-transparent">from one screen</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            POS, commission-free online ordering, kitchen display, delivery tracking and real-time analytics — beautifully connected. Set up in minutes, no training needed.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/admin" className="btn-primary px-6 py-3.5 text-base">Explore the live demo <ArrowRight className="h-5 w-5" /></Link>
            <Link to="/order" className="btn px-6 py-3.5 text-base bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"><Play className="h-4 w-4" /> See customer ordering</Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {['0% commission on orders', 'Works on any device', '15-day free trial'].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" />{t}</span>
            ))}
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="border-b border-slate-100 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400">Built for every kind of food business</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[['☕', 'Cafés'], ['🍔', 'Quick service'], ['🍽️', 'Fine dining'], ['🏭', 'Cloud kitchens'], ['🍕', 'Pizzerias'], ['🥐', 'Bakeries'], ['🚚', 'Food trucks'], ['🏢', 'Multi-branch chains']].map(([e, t]) => (
              <span key={t} className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">{e} {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead eyebrow="Features" title="Everything you need. Nothing you don’t." text="Replace five different tools with one platform your whole team will actually enjoy using." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [MonitorSmartphone, 'Lightning-fast POS', 'Take dine-in, takeaway and delivery orders in seconds. Split bills, discounts, cash or card.', 'from-orange-500 to-rose-500'],
              [ShoppingBag, 'Commission-free online ordering', 'Your own branded ordering website. Keep 100% of the revenue — no aggregator fees.', 'from-emerald-500 to-teal-500'],
              [ChefHat, 'Kitchen display system', 'Orders flow straight to the kitchen with live timers. No lost tickets, no shouting.', 'from-amber-500 to-orange-500'],
              [Bike, 'Delivery & rider tracking', 'Assign riders, see live positions and give customers real-time order tracking.', 'from-violet-500 to-indigo-500'],
              [BarChart3, 'Real-time analytics', 'Sales, best sellers, peak hours and channel performance at a glance.', 'from-sky-500 to-blue-600'],
              [Boxes, 'Inventory control', 'Track stock levels and get low-stock alerts before you run out.', 'from-pink-500 to-fuchsia-500'],
              [Users, 'Staff management', 'Roles, PIN logins, shifts and performance — all in one place.', 'from-lime-500 to-green-600'],
              [QrCode, 'QR table ordering', 'Guests scan, browse and order from their table. Faster turns, fewer errors.', 'from-cyan-500 to-sky-600'],
              [Globe, 'Multi-branch ready', 'Manage every location from a single dashboard with per-branch reporting.', 'from-slate-600 to-slate-900'],
            ].map(([Icon, t, d, grad]) => (
              <div key={t} className="group relative rounded-3xl bg-white p-7 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg`}><Icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-lg font-bold text-ink-900">{t}</h3>
                <p className="mt-2 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <Modules />

      {/* STATS */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {[[Zap, '10 min', 'Average setup time'], [Percent, '0%', 'Commission on your online orders'], [Clock, '24/7', 'Customer support'], [ShieldCheck, '99.9%', 'Uptime target, cloud-hosted']].map(([Icon, v, l]) => (
            <div key={l} className="rounded-3xl bg-gradient-to-br from-slate-50 to-white p-7 ring-1 ring-slate-200">
              <Icon className="h-6 w-6 text-brand-500" />
              <p className="mt-4 font-display text-4xl font-extrabold text-ink-900">{v}</p>
              <p className="mt-1 text-slate-600">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHead eyebrow="How it works" title="Live in three simple steps" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ['01', 'Add your menu', 'Upload items, prices and categories — or let our team import your menu for you.', Store],
              ['02', 'Connect your devices', 'Use any tablet, laptop or phone. Plug in your receipt printer and you’re ready.', Printer],
              ['03', 'Start taking orders', 'Accept orders in-store and online. Watch sales roll into your dashboard live.', TrendingUp],
            ].map(([n, t, d, Icon]) => (
              <div key={n} className="relative rounded-3xl bg-white p-8 ring-1 ring-slate-200">
                <span className="font-display text-6xl font-extrabold text-slate-100">{n}</span>
                <Icon className="absolute right-8 top-8 h-7 w-7 text-brand-500" />
                <h3 className="mt-2 text-xl font-bold text-ink-900">{t}</h3>
                <p className="mt-2 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-16 text-center text-white sm:px-16">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/40 blur-[90px]" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-[90px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold sm:text-5xl">Ready to take control of your restaurant?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">Start your 15-day free trial today. No credit card required.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/admin" className="btn-primary px-6 py-3.5 text-base">Start free trial <ArrowRight className="h-5 w-5" /></Link>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn px-6 py-3.5 text-base bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15">Book a demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 pb-28 pt-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-slate-600">The modern operating system for restaurants — POS, online ordering, kitchen and delivery in one place.</p>
          </div>
          {[
            ['Product', [['POS', '/pos'], ['Online ordering', '/order'], ['Kitchen display', '/kitchen'], ['Delivery', '/delivery']]],
            ['Platform', [['Dashboard', '/admin'], ['Reports', '/admin/reports'], ['Inventory', '/admin/inventory'], ['Staff', '/admin/staff']]],
            ['Company', [['About', '/'], ['Pricing', '/'], ['Contact', '/'], ['Privacy', '/']]],
          ].map(([h, links]) => (
            <div key={h}>
              <p className="font-semibold text-ink-900">{h}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map(([l, to]) => <li key={l}><Link to={to} className="text-slate-600 hover:text-brand-600">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-slate-100 px-4 pt-6 text-sm text-slate-500">© {new Date().getFullYear()} Servora. All rights reserved.</div>
      </footer>
    </div>
  )
}

function SectionHead({ eyebrow, title, text, dark }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-500">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-5xl ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</h2>
      {text && <p className={`mt-4 text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>}
    </div>
  )
}

function HeroPreview() {
  const bars = [40, 62, 48, 75, 58, 90, 82, 70, 96, 64, 78, 88]
  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-brand-500/30 to-indigo-500/30 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl bg-ink-800 p-2 ring-1 ring-white/10 shadow-2xl">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400">app.servora.io/dashboard</span>
        </div>
        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-left text-slate-800 md:grid-cols-4">
          {[['Today’s revenue', 'Rs 284,500', '+18.2%'], ['Orders', '312', '+9.4%'], ['Avg. ticket', 'Rs 912', '+4.1%'], ['Online share', '46%', '+6.0%']].map(([l, v, c]) => (
            <div key={l} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p className="text-xs font-medium text-slate-500">{l}</p>
              <p className="mt-1 font-display text-xl font-extrabold text-ink-900">{v}</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600">{c} vs yesterday</p>
            </div>
          ))}
          <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 md:col-span-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Sales by hour</p>
              <span className="chip bg-brand-50 text-brand-600">Live</span>
            </div>
            <div className="mt-4 flex h-36 items-end gap-2">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-500 to-brand-300" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-2 rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold">Live orders</p>
            {[['#1284', 'Preparing', 'bg-amber-100 text-amber-700'], ['#1285', 'New', 'bg-sky-100 text-sky-700'], ['#1286', 'On the way', 'bg-violet-100 text-violet-700'], ['#1287', 'Ready', 'bg-emerald-100 text-emerald-700']].map(([n, s, c]) => (
              <div key={n} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold">{n}</span><span className={`chip ${c}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -left-6 top-32 hidden animate-float rounded-2xl bg-white p-3 text-left text-slate-800 shadow-2xl lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><ShoppingBag className="h-5 w-5" /></div>
          <div><p className="text-xs text-slate-500">New online order</p><p className="text-sm font-bold">Rs 2,340 · 0% fee</p></div>
        </div>
      </div>
      <div className="absolute -right-6 bottom-16 hidden animate-float rounded-2xl bg-white p-3 text-left text-slate-800 shadow-2xl [animation-delay:1.5s] lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600"><Bike className="h-5 w-5" /></div>
          <div><p className="text-xs text-slate-500">Rider Imran</p><p className="text-sm font-bold">Arriving in 4 min</p></div>
        </div>
      </div>
    </div>
  )
}

const MOD_TABS = [
  { key: 'pos', label: 'Point of Sale', icon: MonitorSmartphone, to: '/pos', title: 'A POS your staff learns in 5 minutes', points: ['Dine-in, takeaway & delivery in one flow', 'Table map with live occupancy', 'Discounts, notes, split payments', 'Cash, card and online payments', 'Printable receipts'], emoji: '🧾' },
  { key: 'online', label: 'Online Ordering', icon: Smartphone, to: '/order', title: 'Your own branded ordering website', points: ['Mobile-first, beautiful menu', 'Commission-free — keep every rupee', 'Delivery or pickup checkout', 'Live order tracking for customers', 'Deals & popular items highlighted'], emoji: '📱' },
  { key: 'kitchen', label: 'Kitchen Display', icon: ChefHat, to: '/kitchen', title: 'A calm, organised kitchen', points: ['Orders appear instantly', 'Colour-coded timers for late tickets', 'One-tap bump to ready', 'Item-level notes', 'Works on any screen'], emoji: '👨‍🍳' },
  { key: 'delivery', label: 'Delivery', icon: Bike, to: '/delivery', title: 'Delivery without the chaos', points: ['Assign riders in one tap', 'Live rider map & ETA', 'Dispatch board for ready orders', 'Rider performance stats', 'Customer tracking link'], emoji: '🛵' },
  { key: 'admin', label: 'Dashboard', icon: BarChart3, to: '/admin', title: 'Know your numbers, in real time', points: ['Revenue, orders & avg. ticket', 'Best sellers and peak hours', 'Menu, inventory & staff management', 'Detailed reports with export', 'Settings for tax, fees & currency'], emoji: '📊' },
]

function Modules() {
  const [tab, setTab] = useState(MOD_TABS[0])
  return (
    <section id="modules" className="relative overflow-hidden bg-ink-900 py-24 text-white">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHead dark eyebrow="Modules" title="One platform, five powerful apps" text="Every module is live in this demo. Click through and try it yourself." />
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {MOD_TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab.key === t.key ? 'bg-brand-500 text-white shadow-glow' : 'bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
        <div key={tab.key} className="mt-10 grid animate-slideIn items-center gap-10 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 lg:grid-cols-2 lg:p-12">
          <div>
            <h3 className="text-3xl font-extrabold">{tab.title}</h3>
            <ul className="mt-6 space-y-3">
              {tab.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-slate-200"><span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/20 text-brand-300"><Check className="h-4 w-4" /></span>{p}</li>
              ))}
            </ul>
            <Link to={tab.to} className="btn-primary mt-8">Open {tab.label} <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/30 via-ink-700 to-indigo-500/30 ring-1 ring-white/10">
            <span className="text-[8rem] drop-shadow-2xl">{tab.emoji}</span>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-ink-900/70 px-4 py-3 backdrop-blur">
              <span className="flex items-center gap-2 text-sm font-semibold"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-emerald-400" /><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>Live demo available</span>
              <tab.icon className="h-5 w-5 text-brand-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [yearly, setYearly] = useState(true)
  const plans = [
    { name: 'Starter', price: 4999, desc: 'For single cafés and small outlets', features: ['1 POS terminal', 'Online ordering website', 'Kitchen display', 'Basic reports', 'Email support'] },
    { name: 'Growth', price: 9999, desc: 'For busy restaurants with delivery', popular: true, features: ['Up to 5 terminals', 'Everything in Starter', 'Delivery & rider tracking', 'Inventory management', 'Staff roles & PINs', 'Advanced analytics', '24/7 priority support'] },
    { name: 'Enterprise', price: null, desc: 'For chains and multi-branch groups', features: ['Unlimited terminals', 'Everything in Growth', 'Multi-branch dashboard', 'Custom integrations', 'Dedicated account manager', 'On-site onboarding'] },
  ]
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHead eyebrow="Pricing" title="Simple, transparent pricing" text="No setup fees. No commission. Cancel anytime." />
        <div className="mt-8 flex items-center justify-center gap-3 text-sm font-semibold">
          <span className={yearly ? 'text-slate-400' : 'text-ink-900'}>Monthly</span>
          <button onClick={() => setYearly(!yearly)} className={`relative h-7 w-12 rounded-full transition ${yearly ? 'bg-brand-500' : 'bg-slate-300'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${yearly ? 'left-6' : 'left-1'}`} /></button>
          <span className={yearly ? 'text-ink-900' : 'text-slate-400'}>Yearly <span className="chip ml-1 bg-emerald-100 text-emerald-700">Save 20%</span></span>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-3xl p-8 ${p.popular ? 'bg-ink-900 text-white shadow-2xl ring-2 ring-brand-500 lg:-translate-y-4' : 'bg-white ring-1 ring-slate-200'}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white"><Flame className="mr-1 inline h-3.5 w-3.5" />Most popular</span>}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.popular ? 'text-slate-300' : 'text-slate-500'}`}>{p.desc}</p>
              <div className="mt-6">
                {p.price ? (
                  <><span className="font-display text-4xl font-extrabold">Rs {(yearly ? Math.round(p.price * 0.8) : p.price).toLocaleString()}</span><span className={p.popular ? 'text-slate-400' : 'text-slate-500'}> /month</span></>
                ) : <span className="font-display text-4xl font-extrabold">Custom</span>}
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {p.features.map((f) => <li key={f} className="flex items-center gap-2.5 text-sm"><Check className={`h-4 w-4 ${p.popular ? 'text-brand-400' : 'text-emerald-500'}`} />{f}</li>)}
              </ul>
              <Link to="/admin" className={`mt-8 ${p.popular ? 'btn-primary' : 'btn-ghost'}`}>{p.price ? 'Start free trial' : 'Contact sales'}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const items = [
    ['Do I need special hardware?', 'No. Servora runs in the browser on any tablet, laptop, desktop or phone. It works with standard thermal receipt printers and cash drawers.'],
    ['Do you charge commission on online orders?', 'Never. You pay a flat monthly subscription and keep 100% of the revenue from orders placed on your own ordering website.'],
    ['Can I manage multiple branches?', 'Yes. The Enterprise plan includes a multi-branch dashboard with consolidated and per-branch reporting.'],
    ['How long does setup take?', 'Most restaurants are taking orders within the same day. Our team can import your menu and train your staff for you.'],
    ['Is my data secure?', 'Your data is stored in the cloud with encrypted connections and daily backups. You can export your data at any time.'],
    ['Can I try it before paying?', 'Absolutely — every plan comes with a 15-day free trial. You can also explore the full live demo right now.'],
  ]
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHead eyebrow="FAQ" title="Questions? Answers." />
        <div className="mt-12 space-y-3">
          {items.map(([q, a], i) => (
            <div key={q} className="rounded-2xl bg-white ring-1 ring-slate-200">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-ink-900">
                {q}<ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="animate-slideIn px-6 pb-5 text-slate-600">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
