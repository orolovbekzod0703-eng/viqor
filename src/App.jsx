import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Store from './pages/Store'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import AdminApp from './pages/admin/AdminApp'
import AdminLogin from './pages/admin/AdminLogin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
