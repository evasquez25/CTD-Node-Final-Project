import styles from './Header.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../utils/auth'

function Header() {
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header>
            <img src="/Logo.png" alt="Budget Helper Logo" />
            <nav>
                <NavLink to="/home" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Dashboard</NavLink>
                <NavLink to="/bills" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Bills</NavLink>
                <NavLink to="/debts" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Debts</NavLink>
                <NavLink to="/payments" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Payments</NavLink>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </nav>
        </header>
    )
}

export default Header