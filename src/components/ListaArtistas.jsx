import React, { useEffect, useState } from 'react';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import { IoIosAddCircle } from "react-icons/io";
import Artista from './Artista';
import './ListaArtistas.css';

const ITEMS_PER_PAGE = 3;

const ListaArtistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchArtistas = async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            setArtistas(prevCanciones => [...prevCanciones, ...data.results]);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
            if (data.next) {
                fetchArtistas(data.next);
            }
        };
        fetchArtistas('https://sandbox.academiadevelopers.com/harmonyhub/artists');
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const artistasToShow = artistas.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    return (
        <div className="lista-artistas">
            <div>
                <button className="add-artista"> Nuevo
                    <IoIosAddCircle/>
                </button>
            </div>
            {artistasToShow.map(artista => (
                <Artista key={artista.id} artist={artista} />
            ))}
            <div className="pagination">
                <button
                    className='pagination-button'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft />
                </button>
                <span className="pagination-number">{currentPage}</span>
                <button
                    className="pagination-button"
                    onClick ={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default ListaArtistas;