import { createBrowserRouter } from 'react-router-dom';
import Layout from "./Layout";
import HomeAlternativo from '../components/HomeAlternativo';
import ListaArtistas from '../components/ListaArtistas';
import Canciones from '../components/Canciones';
import AgregarCancion from '../components/Reproductor/AgregarCancion';
import Login from "../components/Auth/Login";
import Albums from '../components/Albums';
import NotFound from '../components/NotFound';
import ProtectedRoute from './ProtectedRoute';
import AgregarArtista from '../components/AgregarArtista';
import EditarArtista from '../components/EditarArtista';
import Perfil from '../components/Perfil';
import AgregarAlbum from '../components/Albums/AgregarAlbum';
import EditarAlbum from '../components/Albums/EditarAlbum';
import EditarCancion from '../components/Reproductor/EditarCancion';




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
                path: "/canciones/agregar",
                element: (
                    <ProtectedRoute>
                        <AgregarCancion />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/canciones/editar/:id",
                element: (
                    <ProtectedRoute>
                        <EditarCancion />
                    </ProtectedRoute>
                )
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
                path: "/albums/editar/:id",
                element: (
                    <ProtectedRoute>
                        <EditarAlbum />
                    </ProtectedRoute>
                )
            },
            {
                path: "/perfil",
                element: (
                    <ProtectedRoute>
                        <Perfil/>
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default router;
