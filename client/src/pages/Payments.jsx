import Table from '../shared/Table'
import PaymentsForm from '../features/PaymentsForm'
import { useState } from 'react'

function Payments({ paymentsUrl, debtsUrl, token }) {
    const paymentColumns = ['Tipo', 'Categoría', 'Cantidad', 'Fecha de Pago', 'Notas']
    const [payments, setPayments] = useState([])

    return (
        <div>
            <PaymentsForm
                setPayments={setPayments}
                paymentsUrl={paymentsUrl}
                debtsUrl={debtsUrl}
                token={token}
            />
            <Table 
                title="Pagos"
                columns={paymentColumns}
                data={payments}
                showCheckboxColumn={true}
            />
        </div>
    )
}

export default Payments