import React from 'react';
import { FaMusic } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
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
                <Link to="/login" className="navbar-link">Iniciar sesión</Link>
            </div>
        </nav>
    );
}
