import { useState, useEffect } from 'react'
import styles from './DebtsForm.module.css'

function DebtsForm({ setDebtList }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        minPayment: '',
        date: '',
        notes: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Get debts to display on table
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

                const debts = await response.json()
                setDebtList(debts)
            } catch (error) {
                console.error('Error fetching debts:', error)
            }
        }
        fetchDebts()
    }, [setDebtList])

    const addDebt = async (data) => {
        const token = localStorage.getItem('token')
        if (!token) {
            throw new Error('No authentication token found')
        }

        const payload = {
            name: data.name,
            amount: Number(data.amount),
            minPayment: Number(data.minPayment),
            date: data.date,
            notes: data.notes
        }

        try {
            const response = await fetch('/api/debts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error adding debt')
            }

            const responseData = await response.json()
            return responseData
        } catch (error) {
            console.error('Error adding debt:', error)
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
            'Nombre': formData.name,
            'Total': formData.amount,
            'Total Pagado': 0,
            'Restante': formData.amount,
            'Pago Minimo': formData.minPayment,
            'Fecha de Pago': formatDate(formData.date),
            'Pagado?': '❌',
            Notas: formData.notes
        }

        setDebtList(prev => [...prev, newItem])

        try {
            await addDebt(formData)
        } catch (error) {
            console.error('Error adding debt:', error)
            // Remove from local state if API call failed
            setDebtList(prev => prev.filter(item => item !== newItem))
        }

        // Reset form
        setFormData({
            name: '',
            amount: '',
            minPayment: '',
            date: '',
            notes: ''
        })
    }

    return (
        <div>
            <h2 className={styles.formTitle}>Agregar Nueva Deuda</h2>
            <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.formItem}>
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Amazon Credit Card"
                        required
                    />
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="amount">Total</label>
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
                    <label htmlFor="minPayment">Pago Minimo</label>
                    <input
                        type="number"
                        id="minPayment"
                        name="minPayment"
                        value={formData.minPayment}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={styles.smallInput}
                    />
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="date">Fecha de Pago</label>
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

export default DebtsForm