import './App.css'
import Header from './shared/Header'
import Dashboard from './pages/Dashboard'
import Bills from './pages/Bills'
import Debts from './pages/Debts'
import Payments from './pages/Payments'
import NotFound from './pages/NotFound'

import { Routes, Route } from 'react-router'
import { useState } from 'react'

const debtsUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_DEBTS_TABLE}`
const token = `Bearer ${import.meta.env.VITE_PAT}`

function App() {
  const [billList, setBillList] = useState([])
  const [debtList, setDebtList] = useState([])

  // Statically defined for consistency across components
  const billColumns = ['Nombre', 'Cantidad Mensual', 'Cantidad Quincenal', 'Fecha Debida', 'Pagado?', 'Notas']
  const debtColumns = ['Nombre', 'Total', 'Total Pagado', 'Restante', 'Pago Minimo', 'Fecha de Pago', 'Pagado?', 'Notas']

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard billColumns={billColumns} debtColumns={debtColumns} billList={billList} debtList={debtList} />} />
        <Route path="/bills" element={<Bills billList={billList} setBillList={setBillList} billColumns={billColumns}/>} />
        <Route path="/debts" element={<Debts debtList={debtList} debtColumns={debtColumns} setDebtList={setDebtList} debtsUrl={debtsUrl} token={token} />} />
        <Route path="/payments" element={<Payments debtsUrl={debtsUrl} token={token}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
