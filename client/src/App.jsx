import './App.css'
import Header from './shared/Header'
import Dashboard from './pages/Dashboard'
import Bills from './pages/Bills'
import Debts from './pages/Debts'
import Payments from './pages/Payments'
import NotFound from './pages/NotFound'
import Index from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { isAuthenticated } from './utils/auth'

import { Routes, Route, useLocation } from 'react-router'
import { useState } from 'react'

const debtsUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_DEBTS_TABLE}`
const token = `Bearer ${import.meta.env.VITE_PAT}`

function App() {
  const location = useLocation()
  const [billList, setBillList] = useState([])
  const [debtList, setDebtList] = useState([])

  // Routes that should NOT show the header
  const noHeaderRoutes = ['/', '/login', '/register']
  const shouldShowHeader = isAuthenticated() && !noHeaderRoutes.includes(location.pathname)

  // Statically defined for consistency across components
  const billColumns = ['Nombre', 'Cantidad Mensual', 'Cantidad Quincenal', 'Fecha Debida', 'Pagado?', 'Notas']
  const debtColumns = ['Nombre', 'Total', 'Total Pagado', 'Restante', 'Pago Minimo', 'Fecha de Pago', 'Pagado?', 'Notas']

  return (
    <div>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Dashboard billColumns={billColumns} debtColumns={debtColumns} billList={billList} debtList={debtList} />
          </ProtectedRoute>
        } />
        <Route path="/bills" element={
          <ProtectedRoute>
            <Bills billList={billList} setBillList={setBillList} billColumns={billColumns}/>
          </ProtectedRoute>
        } />
        <Route path="/debts" element={
          <ProtectedRoute>
            <Debts debtList={debtList} debtColumns={debtColumns} setDebtList={setDebtList} />
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments debtsUrl={debtsUrl} token={token}/>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
