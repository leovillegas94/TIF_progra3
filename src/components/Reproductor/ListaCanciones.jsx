import React, { useEffect, useState, useCallback } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import Cancion from './Cancion';
import elementoNoEncontrado from '../../assets/elemento_no_encontrado.jpg';
import './ListaCanciones.css';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 3;  //Número de canciones a mostrar por página

const ListaCanciones = () => {   // Estados para manejar canciones, álbumes, artistas, paginación, búsqueda, errores y navegación
    const [canciones, setCanciones] = useState([]);
    const [albums, setAlbums] = useState({});
    const [artists, setArtists] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  // Hook para la navegación

    const fetchCanciones = useCallback(async () => {  // Función para obtener canciones, álbumes y artistas desde la API
        try {   // Fetch de canciones con paginación
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`);
            const data = await response.json();  
            setCanciones(data.results);  // Actualiza el estado con las canciones obtenidas
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));  // Calcula el número total de páginas

            const artistIds = [...new Set(data.results.map(song => song.artist))].filter(id => id);  // Fetch de artistas únicos
            const artistResponses = await Promise.all(
                artistIds.map(id => fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${id}`))
            );
            const artistData = await Promise.all(artistResponses.map(res => res.json()));
            const artistMap = artistData.reduce((acc, artist) => {
                acc[artist.id] = artist.name;
                return acc;
            }, {});
            setArtists(artistMap);   //Actualiza el estado con los artistas obtenidos

            const albumIds = [...new Set(data.results.map(song => song.album))].filter(id => id);  // Fetch de álbumes únicos
            const albumResponses = await Promise.all(
                albumIds.map(id => fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}`))
            );
            const albumData = await Promise.all(albumResponses.map(res => res.json()));
            const albumMap = albumData.reduce((acc, album) => {
                acc[album.id] = album.title;
                return acc;
            }, {});
            setAlbums(albumMap);  // Actualiza el estado con los álbumes obtenidos

            setErrorMessage('');  // Actualiza el estado con los álbumes obtenidos
        } catch (error) {
            console.error("Error fetching songs or artists: ", error);
            setErrorMessage('Error al cargar canciones.');  // Establece un mensaje de error en caso de excepción
        }
    }, [currentPage]);  // Dependencia en `currentPage` para actualizar los datos cuando cambie la página

    useEffect(() => {
        fetchCanciones();  // Llama a la función para obtener datos cuando el componente se monta o cambia la página
    }, [fetchCanciones]);  

    const handlePageChange = (newPage) => {  //Maneja el cambio de página
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);  //Actualiza la página actual si está dentro del rango válido
        }
    };
    
    const handleSearchQueryChange = async (e) => {  // Maneja el cambio en el campo de búsqueda
        const query = e.target.value;
        setSearchQuery(query);  // Actualiza la consulta de búsqueda

        if (query.trim()) {
            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs?title=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.results);  // Actualiza los resultados de búsqueda
                    setErrorMessage('');  // Limpia el mensaje de error si la búsqueda es exitosa
                } else if (response.status === 404) {
                    setSearchResults([]);
                    setErrorMessage('No tenemos lo que buscas.');  // Mensaje de error si no se encuentran resultados
                } else {
                    throw new Error('Error en la búsqueda');
                }
            } catch (error) {
                console.error("Error en la búsqueda: ", error);
                setSearchResults([]);
                setErrorMessage('Error al buscar la canción.'); // Establece un mensaje de error en caso de excepción
            }
        } else {
            setSearchResults([]);
            setErrorMessage('');   // Limpia los resultados y el mensaje de error si la búsqueda está vacía
        }
    };

    const handleClearSearch = () => {   // Limpia la búsqueda y vuelve a la lista completa de canciones
        setSearchQuery('');
        setSearchResults([]);
        setErrorMessage('');
        setCurrentPage(1);
        fetchCanciones();   // Vuelve a cargar la lista completa de canciones
    };

    const handleAddSong = () => {   // Navega a la página para agregar una nueva canción
        navigate('/canciones/agregar');
    };

    const handleDeleteSongFromList = useCallback((id) => {   // Maneja la eliminación de una canción de la lista
        setCanciones(prevCanciones => prevCanciones.filter(cancion => cancion.id !== id));
        setSearchQuery('');
        setSearchResults([]);
        setErrorMessage('');
        setCurrentPage(1);
        fetchCanciones();   // Vuelve a cargar la lista completa de canciones
    }, [fetchCanciones]);

    const cancionesToShow = searchResults.length > 0 ? searchResults : canciones;     // Determina qué canciones mostrar en función de la búsqueda

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
