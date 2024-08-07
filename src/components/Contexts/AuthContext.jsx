import React, { createContext, useReducer, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

function reducer(state, action) {
    console.log('reducer action: ', action)
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

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("authToken"),
        user: JSON.parse(localStorage.getItem("user")),
        isAuthenticated: localStorage.getItem("authToken") ? true : false,
    });
    console.log('initial state: ', state);
    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (token, user) => {
            console.log('login action: ', { token, user });
            dispatch({ type: ACTIONS.LOGIN, payload: { token, user } });
            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            const origin = location.state?.from?.pathname || "/";
            console.log('redirecting to:', origin);
            navigate(origin);
        },
        logout: () => {
            console.log("logout action");
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

function useAuth(type) {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth Siempre debe usarse useAuth con el AuthProvider");
    }
    return context[type];
}

export { AuthContext, AuthProvider, useAuth };
