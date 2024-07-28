import React, { useEffect, useState } from 'react';
import Cancion from './Cancion';

const ListaCanciones = () => {
    const [canciones, setCanciones] = useState([]);

    useEffect(() => {
        const fetchCanciones = async () => {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/songs');
            const data = await response.json();
            setCanciones(data);
        };
        fetchCanciones();
    }, []);

    return (
        <div className="lista-canciones">
            <h2>Lista de Canciones</h2>
            {canciones.map(cancion => (
            <Cancion key={cancion.id} song={cancion} />
        ))}
        </div>
    );
};

export default ListaCanciones;
