import React, {useState} from 'react';
import { FaMusic, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar({isAuthenticated, username, onLogout}) {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuToggle = () => setShowMenu(prev => !prev);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <FaMusic className="navbar-icon" />
                <span className="navbar-title">Harmony Hub</span>
            </div>
            <div className="navbar-right">
                <Link to="/" className="navbar-link">Inicio</Link>
                <Link to="/artistas" className="navbar-link">Artistas</Link>
                <Link to="/albums" className="navbar-link">Albums</Link>
                {isAuthenticated ? (
                    <div className='navbar-user'>
                        <FaUser 
                            className='navbar-user-icon' 
                            onClick={handleMenuToggle}
                            aria-expanded={showMenu}
                            aria-controls="navBar-dropdown"
                        />
                        <span className="navbar-username">{username}</span>
                        {showMenu && (
                            <div className='navbar-dropdown'>
                                <button onClick={onLogout} className='navbar-dropdown-item'>
                                    <FaSignOutAlt className='dropdown-icon' />Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="navbar-link">Iniciar sesión</Link>
                )}
            </div>
        </nav>
    );
}