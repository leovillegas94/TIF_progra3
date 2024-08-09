import React from "react";
import {useNavigate} from 'react-router-dom';
import './IniciarSesion.css';
import accesDeniedImage from '../assets/login.jpg';

const IniciarSesion = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    }

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div className='access-denied-container'>
            <img src={accesDeniedImage} alt='Acceso denegado' className='access-denied-image' />
            <h1 className='access-denied-text'>Debes estar logueado para acceder a esta página</h1>
            <div className='access-denied-buttons'>
                <button onClick={handleLogin} className='access-denied-button'>
                    Iniciar sesión
                </button>
                <button onClick={handleGoHome} className='access-denied-button'>
                    Volver al inicio
                </button>
            </div>
        </div>
    );
};

export default IniciarSesion;