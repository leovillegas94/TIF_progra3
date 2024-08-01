import {createBrowserRouter} from 'react-router-dom';
import Home from "../components/Home";
import Login from "../components/Auth/Login";
import Layout from "./Layout";


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            }
        ]
    }
]);

export default router;