import React from 'react';
import {useNavigate} from 'react-router-dom';
import './NotFound.css';
import notFoundImage from '../assets/404.jpg';

//DEfinimos el componente NotFound mediante una arrow function. Usamos useNavigate para poder navegar hacia otras rutas.
const NotFound = () => {
    const navigate = useNavigate();

    //La siguiente funcion redirige a la ruta raíz cunado se la invoca.
    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className='not-found-container'>
            <img src={notFoundImage} alt='404 Not Found' className='not-found-image' />
            <h1 className='not-found-text'>Página no encontrada</h1>
            <button onClick={handleGoHome} className='not-found-button'>
                Volver al inicio
            </button>
        </div>
    );
};

export default NotFound;