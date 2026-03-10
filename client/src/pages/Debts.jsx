import Table from '../shared/Table'
import DebtsForm from '../features/DebtsForm'

function Debts({ debtList, setDebtList, debtColumns, debtsUrl, token }) {
    return (
        <div>
            <DebtsForm 
                setDebtList={setDebtList} 
                debtsUrl={debtsUrl} 
                token={token} 
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