import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { IoIosAddCircle } from 'react-icons/io';
import {Link} from 'react-router-dom';
import Artista from './Artista';
import elementoNoEncontrado from '../assets/elemento_no_encontrado.jpg';
import './ListaArtistas.css';

const ITEMS_PER_PAGE = 3;

const ListaArtistas = () => {
    const [artistas, setArtistas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchArtistas = async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            setArtistas(prevArtistas => [...prevArtistas, ...data.results]);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
            if (data.next) {
                fetchArtistas(data.next);
            }
        };
        fetchArtistas('https://sandbox.academiadevelopers.com/harmonyhub/artists');
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const artistasToShow = searchResult ? [searchResult] : artistas.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResult(data);
                setErrorMessage('');
            } else if (response.status === 404) {
                setSearchResult(null);
                setErrorMessage('No tenemos lo que buscas.');
            } else {
                setSearchResult(null);
                setErrorMessage('Error al buscar el artista.');
            }
        } catch (error) {
            console.error("Error en la búsqueda: ", error);
            setSearchResult(null);
            setErrorMessage('Error al buscar el artista.');
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
        <div className="lista-artistas">
            <div className='top-bar'>
                <Link to='/artistas/agregar' className="agregar-artista">
                        Nuevo 
                        <IoIosAddCircle />
                </Link>
                <div className='search-container'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder='Inserte el ID para buscar un artista'
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
                        <Artista key={searchResult.id} artist={searchResult} />
                    )}
                    <button className="pagination-button" onClick={handleClearSearch}>
                        Volver a artistas
                    </button>
                </div>
            ) : artistasToShow.length > 0 ? (
                <>
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
                        Volver a artistas
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListaArtistas;