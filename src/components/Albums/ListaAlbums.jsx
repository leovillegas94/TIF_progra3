import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Album from './Album';
import elementoNoEncontrado from '../../assets/elemento_no_encontrado.jpg';
import './ListaAlbum.css';

const ITEMS_PER_PAGE = 6;

const ListaAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAlbums = useCallback(async () => {
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`);
            const data = await response.json();
            setAlbums(data.results);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
            setErrorMessage('');

            // Fetch artists for the albums
            const artistIds = [...new Set(data.results.map(album => album.artist))];
            const artistRequests = artistIds.map(id =>
                fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${id}`).then(res => res.json())
            );
            const artistResponses = await Promise.all(artistRequests);

            const artistMap = artistResponses.reduce((acc, artist) => {
                acc[artist.id] = artist.name;
                return acc;
            }, {});
            setArtists(artistMap);

        } catch (error) {
            console.error("Error fetching albums: ", error);
            setErrorMessage('Error al cargar álbumes.');
        }
    }, [currentPage]);

    const fetchSearchResults = useCallback(async () => {
        if (!searchQuery.trim()) return;
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${searchQuery}`);
            const data = await response.json();
            if (response.ok && data) {
                setSearchResults([data]); 
                setTotalPages(1); // Reset pagination for search results
                setCurrentPage(1); // Reset to the first page of search results
                setErrorMessage('');
            } else {
                setSearchResults([]);
                setErrorMessage('No se encontró el álbum.');
            }
        } catch (error) {
            console.error("Error en la búsqueda: ", error);
            setSearchResults([]);
            setErrorMessage('Error al buscar el álbum.');
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery) {
            fetchSearchResults();
        } else {
            fetchAlbums();
        }
    }, [currentPage, searchQuery, fetchAlbums, fetchSearchResults]);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    const handleSearchQueryChange = useCallback((e) => {
        setSearchQuery(e.target.value);
        if (!e.target.value.trim()) {
            setSearchResults([]);
            setErrorMessage('');
            setCurrentPage(1);
        }
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setErrorMessage('');
        setCurrentPage(1);
    }, []);

    const handleDelete = useCallback((id) => {
        setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== id));
        setCurrentPage(1);
        fetchAlbums(); // Refresh the album list after deletion
    }, [fetchAlbums]);

    const albumsToShow = searchResults.length > 0 ? searchResults : albums;

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
                        placeholder='Ingrese el #ID, sin el # para buscar'
                        className='search-input'
                    />
                    <button type='submit' onClick={fetchSearchResults} className='search-button'>
                        <FaSearch />
                    </button>
                </div>
            </div>
            {errorMessage ? (
                <div className='no-encontrada'>
                    <img src={elementoNoEncontrado} alt='No encontrado' className='no-encontrada-img' />
                    <div className='no-encontrada-message'>{errorMessage}</div>
                    <button className='pagination-button' onClick={handleClearSearch}>
                        Volver a álbumes
                    </button>
                </div>
            ) : (
                <>
                    {albumsToShow.length > 0 ? (
                        <>
                            <div className='albums-list'>
                                {albumsToShow.map((album) => (
                                    <div className='album-card' key={album.id}>
                                        <Album album={album} artistName={artists[album.artist]} onDelete={handleDelete} />
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className='pagination'>
                                    <button
                                        className='pagination-button'
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label='Página anterior'
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <span className='pagination-number'>{currentPage}</span>
                                    <button
                                        className='pagination-button'
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        aria-label='Página siguiente'
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
                </>
            )}
        </div>
    );
};

export default ListaAlbums;
