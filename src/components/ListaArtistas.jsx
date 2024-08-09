import { useEffect, useState, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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

    // Función para obtener la lista de artistas
    const fetchArtistas = useCallback(async (page = 1) => {
        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists?page=${page}&page_size=${ITEMS_PER_PAGE}`);
            const data = await response.json();
            setArtistas(data.results);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
            setErrorMessage('');
        } catch (error) {
            console.error("Error fetching artists: ", error);
            setErrorMessage('Error al cargar artistas.');
        }
    }, []);

    // Función para buscar artistas
    const fetchSearchResults = useCallback(async () => {
        if (!searchQuery.trim()) return;

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists?name=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (response.ok) {
                setSearchResult(data.results[0] || null);
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
    }, [searchQuery]);

    // Cargar datos al montar el componente o al cambiar la página o la búsqueda
    useEffect(() => {
        if (searchQuery.trim()) {
            fetchSearchResults();
        } else {
            fetchArtistas(currentPage);
        }
    }, [currentPage, searchQuery, fetchArtistas, fetchSearchResults]);

    // Función para manejar el cambio de página
    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }, [totalPages]);

    // Función para manejar el cambio en la consulta de búsqueda
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setSearchResult(null);
        setErrorMessage('');
    };

    // Función para manejar la búsqueda
    const handleSearch = () => {
        fetchSearchResults();
    };

    // Función para limpiar la búsqueda
    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResult(null);
        setErrorMessage('');
        fetchArtistas(currentPage); // Vuelve a cargar la lista de artistas
    };

    // Función para manejar la eliminación de un artista
    const handleDelete = (id) => {
        setArtistas((prevArtistas) => prevArtistas.filter((artista) => artista.id !== id));
        // Actualizar la lista después de la eliminación
        if (!searchQuery.trim()) {
            fetchArtistas(currentPage);
        }
    };

    return (
        <div className="lista-artistas">
            <div className='top-bar'>
                <Link to='/artistas/agregar' className="add-button">
                    <FaPlus /> Agregar 
                </Link>
                <div className='search-container'>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder='Inserte el nombre para buscar un artista'
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
                        <Artista 
                            key={searchResult.id} 
                            artist={searchResult}
                            onDelete={handleDelete}
                        />
                    )}
                    <button className="pagination-button" onClick={handleClearSearch}>
                        Volver a artistas
                    </button>
                </div>
            ) : artistas.length > 0 ? (
                <>
                    {artistas.map(artista => (
                        <Artista 
                            key={artista.id} 
                            artist={artista}
                            onDelete={handleDelete}
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
                        Volver a artistas
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListaArtistas;
