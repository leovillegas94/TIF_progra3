import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
    const [showMenu, setShowMenu] = useState(false);
    const state= useAuth("state");
    const actions= useAuth("actions");
    const { isAuthenticated, user } = state;
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const handleMenuToggle = () => {
        setShowMenu(prev => !prev);
    };

    const handleLogout = () => {
        actions.logout();
        setShowMenu(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <FaMusic className="navbar-icon" />
                <span className="navbar-title">Harmony Hub</span>
            </div>
            <div className="navbar-right">
                <Link to="/" className="navbar-link">Inicio</Link>
                <Link to="/canciones" className="navbar-link">Canciones</Link>
                <Link to="/artistas" className="navbar-link">Artistas</Link>
                <Link to="/albums" className="navbar-link">Albums</Link>
                {isAuthenticated && user ? (
                    <div className='navbar-user'>
                        <FaUser 
                            className='navbar-user-icon' 
                            onClick={handleMenuToggle}
                            aria-expanded={showMenu}
                            aria-controls="navBar-dropdown"
                        />
                        <Link to="/perfil" className="navbar-username">{user.username}</Link>
                        {showMenu && (
                            <div className='navbar-dropdown' ref={menuRef}>
                                <button onClick={handleLogout} className='navbar-dropdown-item'>
                                    <FaSignOutAlt className='dropdown-icon' />
                                    <span className='dropdown-text'>Cerrar sesión</span>
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
