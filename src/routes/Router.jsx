import { createBrowserRouter } from 'react-router-dom';
import Layout from "./Layout";
import HomeAlternativo from '../components/HomeAlternativo';
import ListaArtistas from '../components/ListaArtistas';
import Canciones from '../components/Canciones';
import Login from "../components/Auth/Login";
import Albums from '../components/Albums';
import NotFound from '../components/NotFound';
import ProtectedRoute from './ProtectedRoute';
import AgregarArtista from '../components/AgregarArtista';
import EditarArtista from '../components/EditarArtista';
import Perfil from '../components/Perfil';
import AgregarAlbum from '../components/Albums/AgregarAlbum';


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomeAlternativo />
            },
            {
                path: "canciones",
                element: <Canciones/>
            },
            {
                path: "/artistas",
                element: <ListaArtistas/>,
            },
            {
                path: "/artistas/agregar",
                element: (
                    <ProtectedRoute>
                        <AgregarArtista />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/artistas/editar/:id",
                element: (
                    <ProtectedRoute>
                        <EditarArtista />
                    </ProtectedRoute>
                )
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "albums",
                element: <Albums />
            },
            {
                path: "/albums/agregar",
                element: (
                    <ProtectedRoute>
                        <AgregarAlbum />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/perfil",
                element: <Perfil/>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default router;
