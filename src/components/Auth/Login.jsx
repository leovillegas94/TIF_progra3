import React, { useRef, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {  // Estado para manejar la carga y errores
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const usernameRef = useRef(); // Referencias para los campos de entrada
    const passwordRef = useRef();
    const { actions } = useAuth();  // Obtención de funciones de autenticación y navegación
    const navigate = useNavigate();

    const handleSubmit = async (event) => {  // Función para manejar el envío del formulario
        event.preventDefault();  // Evitar el comportamiento predeterminado del formulario
        if (!isLoading) {
            setIsLoading(true); // Mostrar el estado de carga
            setError(''); // Limpiar errores previos
            try {  // Solicitud de autenticación a la API
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

                if (!response.ok) { //Manejo de errores de respuesta
                    throw new Error('No se pudo iniciar sesión');
                }

                const data = await response.json();
                const { token } = data;

                if (token) {   // Guardar el token y redirigir al usuario
                    actions.login(token, { username: usernameRef.current.value });
                    navigate('/');
                } else {
                    throw new Error('Token de autenticación no recibido');  // Manejar caso sin token
                }
            } catch (error) {  // Mostrar mensaje de error y registrar en consola
                setError('Error en el inicio de sesión. Verifica tus credenciales');
                console.error("Error en el inicio de sesión", error);
            } finally {
                setIsLoading(false);  // Ocultar el estado de carga
            }
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>  {/* Formulario de inicio de sesión */}
                <h2>Iniciar sesión</h2>  {/* Campo para el nombre de usuario */}
                <input type="text" placeholder="Usuario" ref={usernameRef} />
                <input type="password" placeholder="Contraseña" ref={passwordRef} /> {/* Campo para la contraseña */}
                <button type="submit" disabled={isLoading}>   {/* Botón de envío del formulario */}
                    {isLoading ? 'Cargando...' : 'Login'}
                </button>
                {error && <p className="error">{error}</p>}   {/* Mostrar mensaje de error si existe */}
            </form>
        </div>
    );
};

export default Login;
