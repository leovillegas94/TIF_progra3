import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import FooterBar from '../components/FooterBar';
import { AuthProvider } from '../components/Contexts/AuthContext';

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
