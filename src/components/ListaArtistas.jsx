import React, { useEffect, useState } from 'react';
import Artista from './Artista';
import '../styles/ListaArtistas.css'

const ListaArtistas = () => {
    const [artistas, setArtistas] = useState([]);

    useEffect(() => {
        const fetchArtistas = async () => {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/artists');
            const data = await response.json();
            setArtistas(data);
        };
        fetchArtistas();
    }, []);

    return (
        <div className="lista-artistas">
            <h2>Lista de Artistas</h2>
            {artistas.map(artista => (
            <Artista key={artista.id} artist={artista} />
        ))}
        </div>

    );
};

export default ListaArtistas;