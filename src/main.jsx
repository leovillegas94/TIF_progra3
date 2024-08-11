import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import router from "./routes/Router";

//Configuración del punto de entrada para la aplicación web utilizando React y react-router-dom para manejar las rutas. El método `createRoot` renderiza el componente que provee las rutas especificadas por medio de router.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);