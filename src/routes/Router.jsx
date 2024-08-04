import {createBrowserRouter} from 'react-router-dom';
import Layout from "./Layout";
import HomeAlternativo from '../components/HomeAlternativo';
import ListaArtistas from '../components/ListaArtistas';
import Canciones from '../components/Canciones';
import Login from "../components/Auth/Login";
import NotFound from '../components/NotFound';
import ListaAlbums from '../Albums/ListaAlbums';


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomeAlternativo />
            },
            {
                path:"/canciones",
                element: <Canciones/>
            },
            {
                path: "/artistas",
                element: <ListaArtistas/>
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/albums",
                element: <ListaAlbums />
            }
        ]
    },
]);



export default router;