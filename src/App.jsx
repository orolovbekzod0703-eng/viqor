import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Store from './pages/Store'
import AdminApp from './pages/admin/AdminApp'
import AdminLogin from './pages/admin/AdminLogin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
