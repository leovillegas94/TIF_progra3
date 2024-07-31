import React, { useRef, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import'./Login.css';

const Login = ({onLogin}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [isMenuOpen, setisMenuOpen] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { actions } = useAuth(); 
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoading) {
            setIsLoading(true);
            try {
                const response = await fetch('https://sandbox.academiadevelopers.com/api-auth/', {
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: usernameRef.current.value,
                        password: passwordRef.current.value,
                    }),
                });

                if(!response.ok) {
                    throw new Error('Falló el inicio de sesión');
                }

                const data = await response.json();
                const {token} = data;

                actions.login(token);
                setUsername(usernameRef.current.value);
                navigate('/');
            } catch (error) {
                console.error("Login failed", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLogout = () => {
        actions.logout();
        setUsername("");
        setisMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setisMenuOpen(prev => !prev);
    }

    return (
        <div className="login-container">
            {!username ? (
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Iniciar sesión</h2>
                    <input type="text" placeholder="Usuario" ref={usernameRef} />
                    <input type="password" placeholder="Contraseña" ref={passwordRef} />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Login'}
                    </button>
                </form>
            ) : (
                <div className="user-info">
                    <FaUser className="user-icon" onClick={toggleMenu} />
                    <span className="username">{username}</span>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Login;