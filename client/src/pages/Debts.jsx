import Table from '../shared/Table'
import DebtsForm from '../features/DebtsForm'

function Debts({ debtList, setDebtList, debtColumns }) {
    const handleDeleteDebt = async (debtId) => {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('You must be logged in to delete a debt')
            return
        }

        try {
            const response = await fetch(`/api/debts/${debtId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error deleting debt')
            }

            // Remove from local state
            setDebtList(prev => prev.filter(debt => debt._id !== debtId))
            
            alert('Debt deleted successfully')
        } catch (error) {
            console.error('Error deleting debt:', error)
            alert('Error deleting debt: ' + error.message)
        }
    }

    return (
        <div>
            <DebtsForm 
                setDebtList={setDebtList} 
            />
            <Table
                title="Debts"
                columns={debtColumns}
                data={debtList}
                onDelete={handleDeleteDebt}
            />
        </div>
    )
}

export default Debts