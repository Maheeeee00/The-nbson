// Demo seed data for Servora. Everything here can be edited from the Admin panel.

export const CATEGORIES = [
  { id: 'deals', name: 'Deals', emoji: '🔥' },
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'bbq', name: 'BBQ & Grill', emoji: '🍢' },
  { id: 'wraps', name: 'Wraps', emoji: '🌯' },
  { id: 'sides', name: 'Sides', emoji: '🍟' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
]

const g = (a, b) => `linear-gradient(135deg, ${a}, ${b})`

export const MENU = [
  { id: 'm1', cat: 'deals', name: 'Family Feast', price: 3990, emoji: '🍱', bg: g('#fde68a', '#fb923c'), desc: '2 large pizzas, 6 wings, fries & 1.5L drink', popular: true },
  { id: 'm2', cat: 'deals', name: 'Solo Combo', price: 1150, emoji: '🥡', bg: g('#fecaca', '#f97316'), desc: 'Zinger burger, regular fries & a soft drink' },
  { id: 'm3', cat: 'deals', name: 'Midnight Deal', price: 2450, emoji: '🌙', bg: g('#c7d2fe', '#6366f1'), desc: '2 burgers, 2 fries, 2 drinks — after 11pm' },
  { id: 'm4', cat: 'burgers', name: 'Smash Classic', price: 890, emoji: '🍔', bg: g('#fed7aa', '#ea580c'), desc: 'Double smashed beef, cheddar, house sauce', popular: true },
  { id: 'm5', cat: 'burgers', name: 'Crispy Zinger', price: 750, emoji: '🍔', bg: g('#fef08a', '#f59e0b'), desc: 'Crunchy fried chicken, lettuce, mayo' },
  { id: 'm6', cat: 'burgers', name: 'Truffle Mushroom', price: 1190, emoji: '🍄', bg: g('#e7e5e4', '#78716c'), desc: 'Beef patty, sautéed mushrooms, truffle aioli' },
  { id: 'm7', cat: 'burgers', name: 'Inferno Burger', price: 990, emoji: '🌶️', bg: g('#fecaca', '#dc2626'), desc: 'Jalapeños, ghost pepper sauce, pepper jack' },
  { id: 'm8', cat: 'pizza', name: 'Margherita', price: 1290, emoji: '🍕', bg: g('#fecaca', '#ef4444'), desc: 'San Marzano tomato, mozzarella, basil' },
  { id: 'm9', cat: 'pizza', name: 'Chicken Tikka Pizza', price: 1590, emoji: '🍕', bg: g('#fed7aa', '#f97316'), desc: 'Tikka chunks, onions, green chilli', popular: true },
  { id: 'm10', cat: 'pizza', name: 'Pepperoni Supreme', price: 1690, emoji: '🍕', bg: g('#fca5a5', '#b91c1c'), desc: 'Double pepperoni, extra cheese' },
  { id: 'm11', cat: 'pizza', name: 'Veggie Garden', price: 1390, emoji: '🫑', bg: g('#bbf7d0', '#16a34a'), desc: 'Peppers, olives, onion, sweetcorn' },
  { id: 'm12', cat: 'bbq', name: 'Seekh Kebab Platter', price: 1450, emoji: '🍢', bg: g('#fdba74', '#c2410c'), desc: '6 beef seekh, naan, mint raita' },
  { id: 'm13', cat: 'bbq', name: 'Malai Boti', price: 1350, emoji: '🍗', bg: g('#fef3c7', '#d97706'), desc: 'Creamy marinated chicken, charcoal grilled', popular: true },
  { id: 'm14', cat: 'bbq', name: 'Peri Peri Wings (12)', price: 1250, emoji: '🍗', bg: g('#fecaca', '#e11d48'), desc: 'Flame-grilled wings, peri peri glaze' },
  { id: 'm15', cat: 'wraps', name: 'Chicken Shawarma', price: 590, emoji: '🌯', bg: g('#fef9c3', '#ca8a04'), desc: 'Garlic sauce, pickles, fries inside' },
  { id: 'm16', cat: 'wraps', name: 'Paratha Roll', price: 520, emoji: '🌯', bg: g('#ffedd5', '#ea580c'), desc: 'Chicken chatni, onion, flaky paratha' },
  { id: 'm17', cat: 'sides', name: 'Loaded Fries', price: 650, emoji: '🍟', bg: g('#fef08a', '#eab308'), desc: 'Cheese sauce, jalapeños, chicken bits' },
  { id: 'm18', cat: 'sides', name: 'Onion Rings', price: 390, emoji: '🧅', bg: g('#fde68a', '#b45309'), desc: 'Beer-battered, chipotle dip' },
  { id: 'm19', cat: 'sides', name: 'Garlic Bread', price: 350, emoji: '🥖', bg: g('#fef3c7', '#a16207'), desc: 'Herb butter, mozzarella' },
  { id: 'm20', cat: 'desserts', name: 'Molten Lava Cake', price: 550, emoji: '🍫', bg: g('#d6d3d1', '#57534e'), desc: 'Warm chocolate centre, vanilla scoop', popular: true },
  { id: 'm21', cat: 'desserts', name: 'Kunafa', price: 690, emoji: '🍯', bg: g('#fde68a', '#d97706'), desc: 'Cheese-filled, pistachio, syrup' },
  { id: 'm22', cat: 'drinks', name: 'Mint Margarita', price: 350, emoji: '🍹', bg: g('#bbf7d0', '#059669'), desc: 'Fresh mint, lime, crushed ice' },
  { id: 'm23', cat: 'drinks', name: 'Cold Coffee', price: 450, emoji: '🧋', bg: g('#e7e5e4', '#92400e'), desc: 'Espresso, milk, ice cream' },
  { id: 'm24', cat: 'drinks', name: 'Soft Drink', price: 180, emoji: '🥤', bg: g('#bfdbfe', '#2563eb'), desc: '345ml can — choice of flavour' },
].map((m) => ({ available: true, popular: false, ...m }))

export const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `T${i + 1}`,
  seats: [2, 4, 4, 6, 2, 4, 8, 4, 2, 6, 4, 4][i],
  zone: i < 6 ? 'Main Hall' : i < 10 ? 'Terrace' : 'Family',
}))

export const INVENTORY = [
  { id: 'i1', name: 'Beef patties', unit: 'pcs', qty: 140, min: 60, cost: 120 },
  { id: 'i2', name: 'Chicken fillet', unit: 'kg', qty: 18, min: 10, cost: 950 },
  { id: 'i3', name: 'Burger buns', unit: 'pcs', qty: 45, min: 80, cost: 25 },
  { id: 'i4', name: 'Mozzarella', unit: 'kg', qty: 9, min: 8, cost: 2200 },
  { id: 'i5', name: 'Pizza dough', unit: 'balls', qty: 60, min: 40, cost: 70 },
  { id: 'i6', name: 'Potatoes', unit: 'kg', qty: 52, min: 30, cost: 110 },
  { id: 'i7', name: 'Cooking oil', unit: 'L', qty: 6, min: 15, cost: 560 },
  { id: 'i8', name: 'Soft drink cans', unit: 'pcs', qty: 210, min: 100, cost: 95 },
  { id: 'i9', name: 'Tomato sauce', unit: 'L', qty: 14, min: 6, cost: 380 },
  { id: 'i10', name: 'Takeaway boxes', unit: 'pcs', qty: 320, min: 200, cost: 18 },
]

export const STAFF = [
  { id: 's1', name: 'Ayesha Khan', role: 'Manager', status: 'On shift', pin: '1111', color: '#fe5011' },
  { id: 's2', name: 'Bilal Ahmed', role: 'Cashier', status: 'On shift', pin: '2222', color: '#6366f1' },
  { id: 's3', name: 'Sara Malik', role: 'Waiter', status: 'On shift', pin: '3333', color: '#10b981' },
  { id: 's4', name: 'Usman Raza', role: 'Chef', status: 'On shift', pin: '4444', color: '#f59e0b' },
  { id: 's5', name: 'Hamza Ali', role: 'Chef', status: 'Off', pin: '5555', color: '#ec4899' },
  { id: 's6', name: 'Zain Hussain', role: 'Waiter', status: 'Break', pin: '6666', color: '#0ea5e9' },
]

export const RIDERS = [
  { id: 'r1', name: 'Imran', phone: '0300-1112233', vehicle: 'Bike · LEA-2231' },
  { id: 'r2', name: 'Faisal', phone: '0301-4445566', vehicle: 'Bike · LEB-8812' },
  { id: 'r3', name: 'Kashif', phone: '0302-7778899', vehicle: 'Bike · LEC-1190' },
  { id: 'r4', name: 'Danish', phone: '0303-2223344', vehicle: 'Car · LED-5521' },
]

export const DEFAULT_SETTINGS = {
  restaurantName: 'Spice Route Kitchen',
  tagline: 'Grill · Pizza · Burgers',
  currency: 'Rs',
  taxRate: 16,
  deliveryFee: 150,
  serviceCharge: 0,
  phone: '+92 300 0000000',
  address: 'Main Boulevard, Gulberg, Lahore',
  openHours: '12:00 PM – 2:00 AM',
  onlineOrdering: true,
  autoAccept: false,
}

const NAMES = ['Ali R.', 'Fatima S.', 'Ahmed K.', 'Hira M.', 'Omar F.', 'Zara A.', 'Saad T.', 'Mariam J.', 'Hassan N.', 'Noor B.', 'Talha Q.', 'Iqra W.']
const ADDRS = ['House 12, Block C, DHA', 'Flat 4B, Askari 11', '45-A, Model Town', '78 Johar Town', 'Street 9, Cantt', '22-K, Gulberg III']

// Simple seeded random so demo history looks the same every reset.
function rng(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) / 2147483647)
}

export function buildHistory(taxRate = 16) {
  const r = rng(42)
  const orders = []
  const now = Date.now()
  let num = 1000
  for (let d = 29; d >= 0; d--) {
    const dayCount = 18 + Math.floor(r() * 22) + (d < 7 ? 8 : 0)
    for (let k = 0; k < dayCount; k++) {
      const hour = [12, 13, 14, 19, 20, 21, 22, 23, 15, 18][Math.floor(r() * 10)]
      const created = new Date(now - d * 86400000)
      created.setHours(hour, Math.floor(r() * 60), 0, 0)
      if (created.getTime() > now) continue
      const n = 1 + Math.floor(r() * 4)
      const items = []
      for (let j = 0; j < n; j++) {
        const m = MENU[Math.floor(r() * MENU.length)]
        const ex = items.find((x) => x.id === m.id)
        if (ex) ex.qty++
        else items.push({ id: m.id, name: m.name, price: m.price, qty: 1, emoji: m.emoji })
      }
      const channel = ['dine-in', 'takeaway', 'delivery', 'online', 'online', 'dine-in'][Math.floor(r() * 6)]
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
      const tax = Math.round((subtotal * taxRate) / 100)
      const fee = channel === 'delivery' || channel === 'online' ? 150 : 0
      orders.push({
        id: `o${num}`,
        number: num++,
        channel,
        table: channel === 'dine-in' ? `T${1 + Math.floor(r() * 12)}` : null,
        customer: { name: NAMES[Math.floor(r() * NAMES.length)], phone: '03xx-xxxxxxx', address: ADDRS[Math.floor(r() * ADDRS.length)] },
        items,
        subtotal,
        tax,
        fee,
        discount: 0,
        total: subtotal + tax + fee,
        payment: ['cash', 'card', 'online'][Math.floor(r() * 3)],
        status: r() < 0.03 ? 'cancelled' : 'completed',
        createdAt: created.getTime(),
      })
    }
  }
  return { orders, nextNumber: num }
}

export function buildLiveOrders(startNumber) {
  const now = Date.now()
  const mk = (n, channel, status, mins, itemIds, extra = {}) => {
    const items = itemIds.map(([id, qty]) => {
      const m = MENU.find((x) => x.id === id)
      return { id, name: m.name, price: m.price, qty, emoji: m.emoji }
    })
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const tax = Math.round(subtotal * 0.16)
    const fee = channel === 'delivery' || channel === 'online' ? 150 : 0
    return {
      id: `o${n}`, number: n, channel, table: null, items, subtotal, tax, fee, discount: 0,
      total: subtotal + tax + fee, payment: 'cash', status, createdAt: now - mins * 60000,
      customer: { name: NAMES[n % NAMES.length], phone: '0300-1234567', address: ADDRS[n % ADDRS.length] },
      ...extra,
    }
  }
  return [
    mk(startNumber, 'online', 'new', 1, [['m9', 1], ['m17', 1], ['m24', 2]]),
    mk(startNumber + 1, 'dine-in', 'preparing', 6, [['m4', 2], ['m22', 2]], { table: 'T3' }),
    mk(startNumber + 2, 'delivery', 'preparing', 9, [['m1', 1]]),
    mk(startNumber + 3, 'takeaway', 'ready', 14, [['m15', 3], ['m18', 1]]),
    mk(startNumber + 4, 'online', 'out', 22, [['m12', 1], ['m20', 2]], { rider: 'r1', dispatchedAt: now - 7 * 60000 }),
    mk(startNumber + 5, 'dine-in', 'preparing', 3, [['m13', 1], ['m8', 1], ['m23', 2]], { table: 'T7' }),
  ]
}
