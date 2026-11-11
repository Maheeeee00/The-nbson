import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import OnlineStore from './pages/OnlineStore'
import TrackOrder from './pages/TrackOrder'
import POS from './pages/POS'
import Kitchen from './pages/Kitchen'
import Delivery from './pages/Delivery'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Orders from './pages/admin/Orders'
import MenuManager from './pages/admin/MenuManager'
import Inventory from './pages/admin/Inventory'
import Staff from './pages/admin/Staff'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import { DemoSwitcher } from './components/ui'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/order" element={<OnlineStore />} />
        <Route path="/order/track/:id" element={<TrackOrder />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
      <DemoSwitcher />
    </>
  )
}
