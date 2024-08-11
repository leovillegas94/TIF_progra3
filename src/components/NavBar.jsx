import React, { useState, useRef, useEffect } from 'react';
import { FaMusic, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import './NavBar.css';

//Definimo el componente NavBar mediante una arrow function
export default function NavBar() {
    //Definimos estados mediante useState, obtenemos contexto completo referido a la autenticación mediente useAuth, usamos useNavigate para poder navegar a otras rutas.
    const [showMenu, setShowMenu] = useState(false);
    const { state, actions } = useAuth(); // Obtén el contexto completo
    const { isAuthenticated, user } = state;
    const navigate = useNavigate();
    const menuRef = useRef(null);

    //Esta funcion cambia el estado de showMenu, controla si se muestra o no.
    const handleMenuToggle = () => {
        setShowMenu(prev => !prev);
    };

    //Esta funcion cierra sesión y redigrige a la ruta raíz.
    const handleLogout = () => {
        actions.logout();
        setShowMenu(false);
        navigate('/');
    };

    //Mediante el useEffect se agrega un event listener para detectar clics fuera del menú desplegable, para ocultarlo automáticamente cuando se hace clic fuera de él.
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
