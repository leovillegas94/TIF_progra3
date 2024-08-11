import PropTypes from 'prop-types';
import { useAuth } from '../components/Contexts/AuthContext';
import IniciarSesion from '../components/IniciarSesion';

//Definimos el componente ProtectedRoute que verifica si el usuario está autenticado, antes de mostrar cierto contenido dentro de una ruta protegida en la aplicación web.
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
