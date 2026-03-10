import styles from './Header.module.css'
import { NavLink } from 'react-router'

function Header() {
    return (
        <header>
            <img src="/Logo.png" alt="Budget Helper Logo" />
            <nav>
                <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Dashboard</NavLink>
                <NavLink to="/Bills" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Bills</NavLink>
                <NavLink to="Debts" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Debts</NavLink>
                <NavLink to="Payments" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Payments</NavLink>
            </nav>
        </header>
    )
}

export default Header