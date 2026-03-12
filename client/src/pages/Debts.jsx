import Table from '../shared/Table'
import DebtsForm from '../features/DebtsForm'

function Debts({ debtList, setDebtList, debtColumns }) {
    return (
        <div>
            <DebtsForm 
                setDebtList={setDebtList} 
            />
            <Table
                title="Debts"
                columns={debtColumns}
                data={debtList}
            />
        </div>
    )
}

export default Debts