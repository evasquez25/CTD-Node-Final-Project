import Table from '../shared/Table'
import PaymentsForm from '../features/PaymentsForm'
import { useState } from 'react'

function Payments() {
    const paymentColumns = ['Tipo', 'Categoría', 'Cantidad', 'Fecha de Pago', 'Notas']
    const [payments, setPayments] = useState([])

    return (
        <div>
            <PaymentsForm
                setPayments={setPayments}
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