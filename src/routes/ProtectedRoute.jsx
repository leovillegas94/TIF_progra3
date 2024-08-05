import {useAuth} from '../components/Contexts/AuthContext';
import IniciarSesion from '../components/IniciarSesion';

export default function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth("state");

    if (!isAuthenticated) {
        return <IniciarSesion />;
    }

    return children;
}