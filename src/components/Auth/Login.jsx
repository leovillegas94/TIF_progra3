import React, { useRef, useState } from 'react';
import { useAuth } from '../Contexts/AuthContext';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();
    const { actions } = useAuth(); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoading) {
            setIsLoading(true);
            try {
                const token = 'exampleToken';
                actions.login(token); 
            } catch (error) {
                console.error("Login failed", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" ref={usernameRef} />
                <input type="password" placeholder="Password" ref={passwordRef} />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Cargando...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
