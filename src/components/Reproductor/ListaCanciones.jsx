import React, { useEffect, useState } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import Cancion from './Cancion';
import elementoNoEncontrado from '../../assets/elemento_no_encontrado.jpg';
import './ListaCanciones.css';

const ITEMS_PER_PAGE = 3;

const ListaCanciones = () => {
    const [canciones, setCanciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

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
    const cancionesToShow = searchResult ? [searchResult] : canciones.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${searchQuery}/`);
            if (response.ok) {
                const data = await response.json();
                setSearchResult(data);
                setErrorMessage('');
            } else if (response.status === 404) {
                setSearchResult(null);
                setErrorMessage('No tenemos lo que buscas.');
            } else {
                setSearchResult(null);
                setErrorMessage('Error al buscar la canción.');
            }
        } catch (error) {
            console.error("Error en la búsqueda: ", error);
            setSearchResult(null);
            setErrorMessage('Error al buscar la canción.');
        }
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setSearchResult(null);
        setErrorMessage('');
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResult(null);
        setErrorMessage('');
    };

    return (
        <div className="lista-canciones">
            <div className='top-bar'>
                <div className="agregar-cancion">
                    <button className="add-button">
                        <FaPlus /> Agregar
                    </button>
                </div>
                <div className='search-container'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder='Inserte el ID para buscar una canción'
                        className='search-input'
                    />
                    <button type='submit' className="search-button" onClick={handleSearch}>
                        <FaSearch />
                    </button>
                </div>
            </div>
            {errorMessage || searchResult ? (
                <div className="no-encontrada">
                    {errorMessage ? (
                        <>
                            <img src={elementoNoEncontrado} alt="No encontrada" className="no-encontrada-img" />
                            <div className="no-encontrada-message">{errorMessage}</div>
                        </>
                    ) : (
                        <Cancion key={searchResult.id} song={searchResult} />
                    )}
                    <button className="pagination-button" onClick={handleClearSearch}>
                        Volver a canciones
                    </button>
                </div>
            ) : cancionesToShow.length > 0 ? (
                <>
                    {cancionesToShow.map(cancion => (
                        <Cancion key={cancion.id} song={cancion} />
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </>
            ) : (
                <div className="no-encontrada">
                    <img src={elementoNoEncontrado} alt="No encontrada" className="no-encontrada-img" />
                    <div className="no-encontrada-message">No tenemos lo que buscas</div>
                    <button className="pagination-button" onClick={handleClearSearch}>
                        Volver a canciones
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListaCanciones;
