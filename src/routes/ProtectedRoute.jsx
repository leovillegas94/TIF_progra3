import PropTypes from 'prop-types';
import { useAuth } from '../components/Contexts/AuthContext';
import IniciarSesion from '../components/IniciarSesion';

export default function ProtectedRoute({ children }) {
    const { state } = useAuth();  
    const { isAuthenticated } = state;

    if (!isAuthenticated) {
        return <IniciarSesion />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
