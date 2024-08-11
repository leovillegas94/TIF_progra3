import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import FooterBar from '../components/FooterBar';
import { AuthProvider } from '../components/Contexts/AuthContext';

//Definimos unj layout general para la aplicación web, incluyendo una barra de navegación, el área principal para mostrar el contenido dinámico y un pie de página.Todo esto dentro del contexto proporcionado por AuthProvider.

export default function Layout() {
    return (
        <AuthProvider>
            <div className="layout">
                <NavBar />
                <main className="content">
                    <Outlet />
                </main>
                <FooterBar />
            </div>
        </AuthProvider>
    );
}
