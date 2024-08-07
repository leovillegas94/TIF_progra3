import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
                    setSearchResult(data.results[0]); 
                    setErrorMessage('');
                    setTotalPages(1);
                    setCurrentPage(1);
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
    };

    const handleDelete = (id) => {
        setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== id));
        setCurrentPage(1);
    }

    const getAlbumsToShow = () => {
        if (searchResult) {
            return [searchResult]; 
        }
        return albums;
    };

    const albumsToShow = getAlbumsToShow();

    return (
        <div className='lista-albumes'>
            <div className='top-bar'>
                <Link to="/albums/agregar" className='agregar-album'>
                    <button className='add-button'>
                        <FaPlus /> Agregar
                    </button>
                </Link>
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
                        <Album key={searchResult.id} album={searchResult} onDelete={handleDelete} />
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
