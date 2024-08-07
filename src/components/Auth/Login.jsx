import React, { useRef, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { actions } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoading) {
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch('https://sandbox.academiadevelopers.com/api-auth/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameRef.current.value,
                        password: passwordRef.current.value,
                    }),
                });

                if (!response.ok) {
                    throw new Error('No se pudo iniciar sesión');
                }

                const data = await response.json();
                console.log('Respuesta del servidor:', data); // Verifica la respuesta aquí
                const { token } = data;

                if (token) {
                    actions.login(token, { username: usernameRef.current.value });
                    navigate('/');
                } else {
                    throw new Error('Token de autenticación no recibido');
                }
            } catch (error) {
                setError('Error en el inicio de sesión. Verifica tus credenciales');
                console.error("Error en el inicio de sesión", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar sesión</h2>
                <input type="text" placeholder="Usuario" ref={usernameRef} />
                <input type="password" placeholder="Contraseña" ref={passwordRef} />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Cargando...' : 'Login'}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
