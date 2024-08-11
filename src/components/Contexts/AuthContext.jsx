import React, { createContext, useReducer, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext({  // Crear un contexto de autenticación con un estado y acciones predeterminados
    state: {},
    actions: {},
});

const ACTIONS = {  // Definir las acciones para el reducer
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

function reducer(state, action) {  // Reducer para manejar el estado de autenticación
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {  // Proveedor del contexto de autenticación
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("authToken"),  // Configuración inicial del estado usando localStorage
        user: JSON.parse(localStorage.getItem("user")),
        isAuthenticated: localStorage.getItem("authToken") ? true : false,
    });
    const navigate = useNavigate();  // Hooks para la navegación y la ubicación
    const location = useLocation();

    const actions = {   // Acciones para manejar el inicio y cierre de sesión
        login: (token, user) => {
            dispatch({ type: ACTIONS.LOGIN, payload: { token, user } });
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            const origin = location.state?.from?.pathname || "/";  // Redirigir al usuario a la página de origen o a la raíz
            navigate(origin);   // Redirigir al usuario a la página principal
        },
        logout: () => {
            dispatch({ type: ACTIONS.LOGOUT });
            localStorage.removeItem("authToken"); 
            localStorage.removeItem("user");
            navigate('/');
        },
    };

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {  // Hook personalizado para usar el contexto de autenticación
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}

export { AuthContext, AuthProvider, useAuth };
