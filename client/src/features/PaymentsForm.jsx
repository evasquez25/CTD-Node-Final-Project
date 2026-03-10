import { useState, useEffect, useCallback } from 'react'
import styles from './PaymentsForm.module.css'

const paymentsUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_PAYMENTS_TABLE}`

// Format date from YYYY-MM-DD to MM/DD/YYYY
function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US')
}

function PaymentsForm({ setPayments, debtsUrl, token }) {
    const [debts, setDebts] = useState([])  // [{id, name}]
    const [bills] = useState([{id: '123', name: 'Coming Soon!'}])  // [{id, name}]
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

    // Get debts to display
    useEffect(() => {
        const fetchDebts = async () => {
            const options = {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }

            try {
                const resp = await fetch(encodeURI(debtsUrl), options)
                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
                }

                const data = await resp.json()

                const fetchedDebts = data.records.map((record) => {
                    const debt = {
                        id: record.id,
                        name: record.fields.Name
                    }
                    return debt
                })
                setDebts(fetchedDebts)
            } catch(err) {
                console.error(err)
            }
        }
        fetchDebts()
    }, [setDebts, debtsUrl, token])

    // Get payments to display on table
    useEffect(() => {
        const fetchPayments = async () => {
            const options = {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }

            try {
                const resp = await fetch(encodeURI(paymentsUrl), options)
                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
                }

                const data = await resp.json()

                const fetchedPayments = data.records.map((record) => {
                    const payment = {
                        'Tipo': record.fields.Type,
                        'Categoría': debts.find(d => d.id === record.fields.Debt[0])?.name,
                        'Cantidad': record.fields.Amount,
                        'Fecha de Pago': record.fields.Date,
                        'Notas': record.fields.Name
                    }
                    return payment
                })
                setPayments(fetchedPayments)
            } catch(err) {
                console.error(err)
            }
        }
        fetchPayments()
    }, [setPayments, token, debts])

    const addPayment = async (data) => {
        const payload = {
            records: [
                {
                    fields: {
                        'Type': data.type,
                        'Debt': [data.category],
                        'Amount': Number(data.amount),
                        'Date': data.date,
                        'Name': data.notes
                    }
                }
            ]
        }
        
        const options = {
            method: 'POST',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }

        try {
            const response = await fetch(paymentsUrl, options)
            if (!response.ok) {
                const body = await response.text();
                console.error('Error posting data:', response.status, body);
                throw new Error('Error posting data');
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

        const newItem = {
            'Tipo': formData.type,
            'Categoría': formData.category,
            'Cantidad': formData.amount,
            'Fecha de Pago': formatDate(formData.date),
            'Notas': formData.notes
        }

        // Update local state immediately so table updates
        setPayments(prev => [...prev, newItem])

        try {
            // Send to Airtable with current form data
            await addPayment(formData)

            // Reset form only after successful API call
            setFormData({
                type: 'Bill',
                category: '',
                amount: '',
                date: '',
                notes: ''
        })
        } catch (error) {
            console.error('Error adding payment:', error)
            // Remove from local state if API call failed
            setPayments(prev => prev.filter(item => item !== newItem))
        }
    }

    return (
        <div>
            <h2 className={styles.formTitle}>Agregar Nueva Entrada</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formItem}>
                    <label htmlFor="type">Tipo</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                    >
                        <option value="Bill">Bill</option>
                        <option value="Deuda">Deuda</option>
                    </select>
                </div>

                <div className={styles.formItem}>
                    <label htmlFor="category">
                        {formData.type === 'Deuda' ? 'Deuda' : 'Bill'}
                    </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="">...</option>
                            {formData.type === 'Deuda' ? (
                                debts.map((debt) => (
                                    <option key={debt.id} value={debt.id}>
                                        {debt.name}
                                    </option>
                                ))
                            ) : (
                                bills.map((bill) => (
                                    <option key={bill.id} value={bill.id}>
                                        {bill.name}
                                    </option>
                                ))
                            )}
                        </select>
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

export default PaymentsForm