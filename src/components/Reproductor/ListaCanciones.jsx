import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import Cancion from './Cancion';
import elementoNoEncontrado from '../../assets/elemento_no_encontrado.jpg';
import './ListaCanciones.css';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 3;

const ListaCanciones = () => {
    const [canciones, setCanciones] = useState([]);
    const [albums, setAlbums] = useState({});
    const [artists, setArtists] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const fetchCanciones = useCallback(async () => {
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`);
            const data = await response.json();
            setCanciones(data.results);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));

            const artistIds = [...new Set(data.results.map(song => song.artist))].filter(id => id);
            const artistResponses = await Promise.all(
                artistIds.map(id => fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${id}`))
            );
            const artistData = await Promise.all(artistResponses.map(res => res.json()));
            const artistMap = artistData.reduce((acc, artist) => {
                acc[artist.id] = artist.name;
                return acc;
            }, {});
            setArtists(artistMap);

            const albumIds = [...new Set(data.results.map(song => song.album))].filter(id => id);
            const albumResponses = await Promise.all(
                albumIds.map(id => fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}`))
            );
            const albumData = await Promise.all(albumResponses.map(res => res.json()));
            const albumMap = albumData.reduce((acc, album) => {
                acc[album.id] = album.title;
                return acc;
            }, {});
            setAlbums(albumMap);

            setErrorMessage('');
        } catch (error) {
            console.error("Error fetching songs or artists: ", error);
            setErrorMessage('Error al cargar canciones.');
        }
    }, [currentPage]);

    useEffect(() => {
        fetchCanciones();
    }, [fetchCanciones]);

    const handleSearchQueryChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs?title=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.results);
                    setErrorMessage('');
                } else if (response.status === 404) {
                    setSearchResults([]);
                    setErrorMessage('No tenemos lo que buscas.');
                } else {
                    throw new Error('Error en la búsqueda');
                }
            } catch (error) {
                console.error("Error en la búsqueda: ", error);
                setSearchResults([]);
                setErrorMessage('Error al buscar la canción.');
            }
        } else {
            setSearchResults([]);
            setErrorMessage('');
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setErrorMessage('');
        setCurrentPage(1);
        fetchCanciones();
    };

    const handleAddSong = () => {
        navigate('/canciones/agregar');
    };

    const handleDeleteSongFromList = useCallback((id) => {
        setCanciones(prevCanciones => prevCanciones.filter(cancion => cancion.id !== id));
        setSearchQuery('');
        setSearchResults([]);
        setErrorMessage('');
        setCurrentPage(1);
        fetchCanciones();
    }, [fetchCanciones]);

    const cancionesToShow = searchResults.length > 0 ? searchResults : canciones;

    return (
        <div className="lista-canciones">
            <div className='top-bar'>
                <div className="agregar-cancion">
                    <button className="add-button" onClick={handleAddSong}>
                        <FaPlus /> Agregar
                    </button>
                </div>
                <div className='search-container'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder='Inserte el título para buscar una canción'
                        className='search-input'
                    />
                    <button type='submit' className="search-button" onClick={handleSearchQueryChange}>
                        <FaSearch />
                    </button>
                </div>
            </div>
            {errorMessage || searchResults.length > 0 ? (
                <div className="no-encontrada">
                    {errorMessage ? (
                        <>
                            <img src={elementoNoEncontrado} alt="No encontrada" className="no-encontrada-img" />
                            <div className="no-encontrada-message">{errorMessage}</div>
                        </>
                    ) : (
                        cancionesToShow.map(cancion => (
                            <Cancion
                                key={cancion.id}
                                song={{ 
                                    ...cancion, 
                                    artistName: artists[cancion.artist] || 'Desconocido', 
                                    albumTitle: albums[cancion.album] || 'Desconocido' 
                                }}
                                onDelete={handleDeleteSongFromList}
                            />
                        ))
                    )}
                    <button className="pagination-button" onClick={handleClearSearch}>
                        Volver a canciones
                    </button>
                </div>
            ) : cancionesToShow.length > 0 ? (
                <>
                    {cancionesToShow.map(cancion => (
                        <Cancion
                            key={cancion.id}
                            song={{ 
                                ...cancion, 
                                artistName: artists[cancion.artist] || 'Desconocido', 
                                albumTitle: albums[cancion.album] || 'Desconocido' 
                            }}
                            onDelete={handleDeleteSongFromList}
                        />
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
