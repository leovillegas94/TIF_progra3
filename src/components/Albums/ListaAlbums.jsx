import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import Album from './Album';
import elementoNoEncontrado from '../../assets/elemento_no_encontrado.jpg';
import './ListaAlbum.css';

const ITEMS_PER_PAGE = 6;

const ListaAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`);
                const data = await response.json();
                setAlbums(data.results);
                setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
                setErrorMessage('');
            } catch (error) {
                console.error("Error fetching albums: ", error);
                setErrorMessage('Error al cargar álbumes.');
            }
        };

        // Solo hace la búsqueda si no hay resultado de búsqueda
        if (!searchResult) {
            fetchAlbums();
        }
    }, [currentPage, searchResult]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums?title=${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                if (data.results.length > 0) {
                    setSearchResult(data.results[0]); // Suponiendo que queremos solo el primer resultado
                    setErrorMessage('');
                    setTotalPages(1); // Resetear totalPages a 1 para mostrar solo el resultado
                    setCurrentPage(1); // Resetear página actual al resultado de búsqueda
                } else {
                    setSearchResult(null);
                    setErrorMessage('No tenemos lo que buscas.');
                }
            } else {
                setSearchResult(null);
                setErrorMessage('Error al buscar el álbum.');
            }
        } catch (error) {
            console.error("Error en la búsqueda: ", error);
            setSearchResult(null);
            setErrorMessage('Error al buscar el álbum.');
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
        setCurrentPage(1); // Resetear a la página 1 al limpiar búsqueda
    };

    // Calcula el rango de álbumes a mostrar según la página actual
    const getAlbumsToShow = () => {
        if (searchResult) {
            return [searchResult]; // Si hay un resultado de búsqueda, mostrar solo ese
        }
        return albums;
    };

    const albumsToShow = getAlbumsToShow();

    return (
        <div className='lista-albumes'>
            <div className='top-bar'>
                <div className='agregar-album'>
                    <button className='add-button'>
                        <FaPlus /> Agregar
                    </button>
                </div>
                <div className='search-container'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder='Inserte el título para buscar un álbum'
                        className='search-input'
                    />
                    <button type='submit' onClick={handleSearch} className='search-button'>
                        <FaSearch />
                    </button>
                </div>
            </div>
            {errorMessage || searchResult ? (
                <div className='no-encontrada'>
                    {errorMessage ? (
                        <>
                            <img src={elementoNoEncontrado} alt='No encontrado' className='no-encontrada-img' />
                            <div className='no-encontrada-message'>{errorMessage}</div>
                        </>
                    ) : (
                        <Album key={searchResult.id} album={searchResult} />
                    )}
                    <button className='pagination-button' onClick={handleClearSearch}>
                        Volver a álbumes
                    </button>
                </div>
            ) : albumsToShow.length > 0 ? (
                <>
                    <div className='albums-list'>
                        {albumsToShow.map((album) => (
                            <div className='album-card' key={album.id}>
                                <Album album={album} />
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className='pagination'>
                            <button
                                className='pagination-button'
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </button>
                            <span className='pagination-number'>{currentPage}</span>
                            <button
                                className='pagination-button'
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className='no-encontrada'>
                    <img src={elementoNoEncontrado} alt='No encontrado' className="no-encontrada-img" />
                    <div className='no-encontrada-message'>No tenemos lo que buscas</div>
                    <button className='pagination-button' onClick={handleClearSearch}>
                        Volver a álbumes
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListaAlbums;
