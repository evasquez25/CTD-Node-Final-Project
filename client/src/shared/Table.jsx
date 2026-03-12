import styles from './Table.module.css'

function Table({ title, columns, data = [], children, onDelete = null }) {
    return (
        <>
            <h2 className={styles.tableTitle}>{title}</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={`header-${column}`}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => {
                            const rowId = row.id || row.Nombre || `row-${rowIndex}`;
                            return (
                                <tr key={rowId}>
                                    {Object.entries(row).filter(([key]) => key !== '_id').map(([columnName, cellValue]) => (
                                        <td key={`${rowId}-${columnName}`}>
                                            {cellValue}
                                        </td>
                                    ))}
                                    {onDelete && (
                                        <td key={`${rowId}-delete`}>
                                            <button 
                                                onClick={() => onDelete(row._id)}
                                                className={styles.deleteButton}
                                                title="Delete debt"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                                {children || 'No data available'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}

export default Table
