import React, { useState, useEffect } from 'react';
import { FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import Album from './Album';
import './ListaAlbum.css';

const ITEMS_PER_PAGE = 6;

const ListaAlbums = () => {
    const [albums, setAlbums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAlbums = async (url) => {
            const response = await fetch(url);
            const data = await response.json();
            setAlbums(prevAlbums => [...prevAlbums, ...data.results]);
            setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
            if (data.next) {
                fetchAlbums(data.next);
            }
        };
        fetchAlbums('https://sandbox.academiadevelopers.com/harmonyhub/albums/');
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const albumsToShow = albums.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleSearch = () => {
        // Implement search functionality if needed
    };

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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Inserte el ID para buscar un álbum'
                        className='search-input'
                    />
                    <button type='submit' onClick={handleSearch} className='search-button'>
                        <FaSearch />
                    </button>
                </div>
            </div>
            <div className='albums-list'>
                {albumsToShow.map(album => (
                    <Album key={album.id} album={album} />
                ))}
            </div>
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
        </div>
    );
};

export default ListaAlbums;