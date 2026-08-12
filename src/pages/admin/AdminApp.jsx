import { useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { signOut, useAuth } from '../../hooks/useAuth'
import { Logo } from '../../components/Logo'
import { FullPageSpinner } from './AdminLogin'
import AdminOrders from './AdminOrders'
import AdminProducts from './AdminProducts'
import AdminDashboard from './AdminDashboard'
import { IconBag, IconClose } from '../../components/Icons'

export default function AdminApp() {
  const { user, isAdmin, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) return <FullPageSpinner />
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-brand-50 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} email={user.email} />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar setMobileOpen={setMobileOpen} email={user.email} />
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function NavItem({ to, active, children, icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
        active ? 'bg-brand-700 text-white' : 'text-brand-500 hover:bg-brand-50 hover:text-brand-700'
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}

function Sidebar({ mobileOpen, setMobileOpen, email }) {
  const loc = useLocation()
  const isActive = (p) => loc.pathname.startsWith(p)

  const nav = (
    <>
      <div className="text-brand-700 mb-6"><Logo /></div>
      <nav className="space-y-1">
        <NavItem to="/admin/dashboard" active={isActive('/admin/dashboard')} icon={<IconChart />}>Dashboard</NavItem>
        <NavItem to="/admin/orders" active={isActive('/admin/orders')} icon={<IconBag />}>Buyurtmalar</NavItem>
        <NavItem to="/admin/products" active={isActive('/admin/products')} icon={<IconBox />}>Mahsulotlar</NavItem>
      </nav>

      <div className="mt-auto pt-6 border-t border-brand-100 text-xs">
        <div className="text-brand-400">Kirgan:</div>
        <div className="font-semibold text-brand-700 truncate">{email}</div>
        <button onClick={() => signOut()} className="mt-3 btn-outline w-full !py-2 !text-xs">Chiqish</button>
        <a href="/" className="mt-2 block text-center text-brand-400 hover:text-brand-700">← Do'konga</a>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden lg:flex w-60 bg-white border-r border-brand-100 p-5 flex-col shrink-0">
        {nav}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 animate-fade" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 flex flex-col animate-drawer">
            <button onClick={() => setMobileOpen(false)} className="self-end w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center -mt-2 -mr-2">
              <IconClose />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  )
}

function TopBar({ setMobileOpen, email }) {
  const loc = useLocation()
  const title = loc.pathname.includes('/products') ? 'Mahsulotlar'
              : loc.pathname.includes('/dashboard') ? 'Dashboard'
              : 'Buyurtmalar'
  return (
    <header className="lg:hidden bg-white border-b border-brand-100 sticky top-0 z-30">
      <div className="h-14 px-4 flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} aria-label="menu" className="w-10 h-10 rounded-full hover:bg-brand-50 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div className="font-bold">{title}</div>
        <div className="ml-auto text-xs text-brand-400 truncate max-w-[40vw]">{email}</div>
      </div>
    </header>
  )
}

function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" /><path d="M3 7l9 4 9-4M12 11v10" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M7 15V9M12 15v-3M17 15V6" />
    </svg>
  )
}
function IconMap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z" /><circle cx="12" cy="9" r="3" />
    </svg>
  )
}
