import { Link } from 'react-router-dom'
import styles from './Index.module.css'

function Index() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Welcome to Bill Tracker</h1>
                <p>Manage your bills and payments easily</p>
                <div className={styles.buttons}>
                    <Link to="/login" className={styles.btn}>Login</Link>
                    <Link to="/register" className={styles.btnSecondary}>Register</Link>
                </div>
            </div>
        </div>
    )
}

export default Index