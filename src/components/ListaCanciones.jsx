import React, { useEffect, useState } from 'react';
import Cancion from './Cancion';
import './ListaCanciones.css';

const ITEMS_PER_PAGE = 3;

const ListaCanciones = () => {
    const [canciones, setCanciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCanciones = async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            setCanciones(prevCanciones => [...prevCanciones, ...data.results]);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
            if (data.next) {
                fetchCanciones(data.next);
            }
        };
        fetchCanciones('https://sandbox.academiadevelopers.com/harmonyhub/songs');
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const cancionesToShow = canciones.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    return (
        <div className="lista-canciones">
            {cancionesToShow.map(cancion => (
                <Cancion key={cancion.id} song={cancion} />
            ))}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ListaCanciones;
