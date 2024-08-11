import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Album from './Album';
import elementoNoEncontrado from '../../assets/elemento_no_encontrado.jpg';
import './ListaAlbum.css';

const ITEMS_PER_PAGE = 6;

const ListaAlbums = () => { // Estado para almacenar los álbumes y artistas
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState({});
    const [currentPage, setCurrentPage] = useState(1); // Página actual de álbumes
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [searchQuery, setSearchQuery] = useState(''); // Consulta de búsqueda
    const [searchResults, setSearchResults] = useState([]); // Resultados de búsqueda
    const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error

    const fetchAlbums = useCallback(async () => {  // Función para obtener los álbumes desde la API
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`);
            const data = await response.json();
            setAlbums(data.results);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE)); // Calcula el total de páginas
            setErrorMessage('');

            // Obtener artistas para los álbumes
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

    const fetchSearchResults = useCallback(async () => {   // Función para buscar álbumes por consulta
        if (!searchQuery.trim()) return; // Evita hacer la si la consulta está vacía
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${searchQuery}`);
            const data = await response.json();
            if (response.ok && data) {
                setSearchResults([data]); 
                setTotalPages(1); // Reiniciar paginación para los resultados de búsqueda
                setCurrentPage(1); // Reiniciar a la primera página de resultados de búsqueda
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

    useEffect(() => {  // Efecto para cargar álbumes o resultados de búsqueda al cambiar la página o la consulta de búsqueda
        if (searchQuery) {
            fetchSearchResults();
        } else {
            fetchAlbums();
        }
    }, [currentPage, searchQuery, fetchAlbums, fetchSearchResults]);

    const handlePageChange = useCallback((newPage) => {  // Manejar el cambio de página
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    const handleSearchQueryChange = useCallback((e) => {   // Manejar el cambio en la consulta de búsqueda
        setSearchQuery(e.target.value);
        if (!e.target.value.trim()) {
            setSearchResults([]);
            setErrorMessage('');
            setCurrentPage(1);
        }
    }, []);

    const handleClearSearch = useCallback(() => {   // Limpiar la búsqueda y reiniciar estado
        setSearchQuery('');
        setSearchResults([]);
        setErrorMessage('');
        setCurrentPage(1);
    }, []);

    const handleDelete = useCallback((id) => {  // Manejar la eliminación de un álbum
        setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== id));
        setCurrentPage(1);
        fetchAlbums(); // Actualizar la lista de álbumes después de la eliminación
    }, [fetchAlbums]);

    const albumsToShow = searchResults.length > 0 ? searchResults : albums;  // Determinar los álbumes a mostrar, dependiendo si hay resultados de búsqueda

    return (
        <div className='lista-albumes'> {/* Barra superior con el botón para agregar álbumes y el contenedor de búsqueda */}
            <div className='top-bar'> {/* Enlace para agregar un nuevo álbum */}
                <Link to="/albums/agregar" className='agregar-album'>
                    <button className='add-button'>
                        <FaPlus /> Agregar
                    </button>
                </Link> {/* Contenedor de búsqueda */}
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
            </div>   {/* Mostrar mensaje de error si existe */}
            {errorMessage ? (  
                <div className='no-encontrada'>
                    <img src={elementoNoEncontrado} alt='No encontrado' className='no-encontrada-img' />
                    <div className='no-encontrada-message'>{errorMessage}</div> {/* Botón para volver a la lista de álbumes */}
                    <button className='pagination-button' onClick={handleClearSearch}>
                        Volver a álbumes
                    </button>
                </div>
            ) : (
                <>  {/* Mostrar lista de álbumes si hay álbumes disponibles */}
                    {albumsToShow.length > 0 ? (
                        <>
                            <div className='albums-list'>
                                {albumsToShow.map((album) => (
                                    <div className='album-card' key={album.id}>
                                        <Album album={album} artistName={artists[album.artist]} onDelete={handleDelete} />
                                    </div>
                                ))}
                            </div>  {/* Mostrar controles de paginación si hay más de una página */}
                            {totalPages > 1 && (
                                <div className='pagination'>  {/* Botón para ir a la página anterior */}
                                    <button
                                        className='pagination-button'
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label='Página anterior'
                                    >
                                        <FaChevronLeft />
                                    </button>  {/* Botón para ir a la página siguiente */}
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
                            <button className='pagination-button' onClick={handleClearSearch}>  {/* Botón para volver a la lista de álbumes */}
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
