import { useState, useEffect, useCallback } from 'react'
import styles from './PaymentsForm.module.css'

function PaymentsForm({ setPayments }) {
    const [payments, setPaymentsList] = useState([])
    const [debts, setDebts] = useState([])
    const [formData, setFormData] = useState({
        type: 'Bill',
        category: '',
        amount: '',
        date: '',
        notes: ''
    })

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            }

            // Clear category when type changes to avoid invalid selections
            if (name === 'type') {
                newData.category = ''
            }

            return newData
        })
    }, [])

    // Get payments to display
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
                setPaymentsList(paymentsData)
                setPayments(paymentsData)
            } catch (error) {
                console.error('Error fetching payments:', error)
            }
        }
        fetchPayments()
    }, [setPayments])

    // Get debts for dropdown
    useEffect(() => {
        const fetchDebts = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await fetch('/api/debts', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) {
                    throw new Error('Error fetching debts')
                }

                const debtsData = await response.json()
                console.log('Fetched debts:', debtsData) // Debug log
                setDebts(debtsData)
            } catch (error) {
                console.error('Error fetching debts:', error)
            }
        }
        fetchDebts()
    }, [])

    const addPayment = async (data) => {
        const token = localStorage.getItem('token')
        if (!token) {
            throw new Error('No authentication token found')
        }

        const payload = {
            type: data.type,
            category: data.category,
            amount: Number(data.amount),
            date: data.date,
            notes: data.notes,
            debtId: data.type === 'Debt' ? data.category : null
        }

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error adding payment')
            }

            const responseData = await response.json()
            console.log('Payment added successfully:', responseData)
            return responseData
        } catch (error) {
            console.error('Error adding payment:', error)
            throw error
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Format date from YYYY-MM-DD to MM/DD/YYYY
        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US')
        }

        const newItem = {
            'Tipo': formData.type,
            'Categoría': formData.type === 'Debt' 
                ? (() => {
                    const selectedDebt = debts.find(debt => debt._id === formData.category);
                    console.log('Selected debt ID:', formData.category);
                    console.log('Found debt:', selectedDebt);
                    return selectedDebt?.Nombre || 'Deuda no encontrada';
                })()
                : formData.category,
            'Cantidad': formData.amount,
            'Fecha': formatDate(formData.date),
            'Notas': formData.notes
        }

        setPaymentsList(prev => [...prev, newItem])
        setPayments(prev => [...prev, newItem])

        try {
            await addPayment(formData)
        } catch (error) {
            console.error('Error adding payment:', error)
            // Remove from local state if API call failed
            setPaymentsList(prev => prev.filter(item => item !== newItem))
            setPayments(prev => prev.filter(item => item !== newItem))
        }

        // Reset form
        setFormData({
            type: 'Bill',
            category: '',
            amount: '',
            date: '',
            notes: ''
        })
    }

    return (
        <div>
            <h2 className={styles.formTitle}>Agregar Nuevo Pago</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formItem}>
                    <label htmlFor="type">Tipo</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Bill">Factura</option>
                        <option value="Debt">Deuda</option>
                    </select>
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="category">
                        {formData.type === 'Debt' ? 'Seleccionar Deuda' : 'Categoría'}
                    </label>
                    {formData.type === 'Debt' ? (
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option key="default" value="">Seleccione una deuda...</option>
                            {debts.map((debt) => {
                                console.log('Debt object:', debt) // Debug log
                                return (
                                    <option key={debt._id || debt.Nombre} value={debt._id}>
                                        {debt.Nombre} - ${debt.Restante} restante
                                    </option>
                                )
                            })}
                        </select>
                    ) : (
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            placeholder="Ej: Supermercado"
                            required
                        />
                    )}
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="amount">Cantidad</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className={styles.smallInput}
                    />
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="date">Fecha</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="notes">Notas</label>
                    <input
                        type="text"
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Notas adicionales..."
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Guardar
                </button>
            </form>
        </div>
    )
}

export default PaymentsForm