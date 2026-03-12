import Table from '../shared/Table'
import PaymentsForm from '../features/PaymentsForm'
import { useState, useEffect } from 'react'

function Payments() {
    const paymentColumns = ['Tipo', 'Categoría', 'Cantidad', 'Fecha de Pago', 'Notas', 'Acciones']
    const [payments, setPayments] = useState([])

    // Fetch payments when component mounts and after deletion
    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await fetch('/api/payments', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    throw new Error('Error fetching payments')
                }

                const paymentsData = await response.json()
                setPayments(paymentsData)
            } catch (error) {
                console.error('Error fetching payments:', error)
            }
        }
        fetchPayments()
    }, [])

    const handleDeletePayment = async (paymentId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('You must be logged in to delete a payment')
            return
        }

        try {
            const response = await fetch(`/api/payments/${paymentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error deleting payment')
            }

            // Refresh payments from server instead of filtering local state
            const refreshResponse = await fetch('/api/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (refreshResponse.ok) {
                const updatedPayments = await refreshResponse.json()
                setPayments(updatedPayments)
            }
            
            alert('Payment deleted successfully')
        } catch (error) {
            console.error('Error deleting payment:', error)
            alert('Error deleting payment: ' + error.message)
        }
    }

    return (
        <div>
            <PaymentsForm
                setPayments={setPayments}
            />
            <Table 
                title="Pagos"
                columns={paymentColumns}
                data={payments}
                onDelete={handleDeletePayment}
            />
        </div>
    )
}

export default Payments