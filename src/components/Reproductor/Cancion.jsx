import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Cancion.css';
import { useNavigate } from 'react-router-dom';

export default function Cancion({ song, onDelete }) {
    const [albumDetails, setAlbumDetails] = useState(null);
    const [artistDetails, setArtistDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (song.album) {
            fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${song.album}/`)
                .then(response => response.json())
                .then(data => setAlbumDetails(data))
                .catch(error => console.error('Error fetching album details:', error));
        }

        if (song.artists && song.artists.length > 0) {
            fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${song.artists[0]}/`)
                .then(response => response.json())
                .then(data => setArtistDetails(data))
                .catch(error => console.error('Error fetching artist details:', error));
        }
    }, [song]);

    const handleDeleteSongFromAPI = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta canción?")) {
            const URL = `https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}/`;
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(URL, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                });
                if (response.ok || response.status === 404) {
                    alert('Canción eliminada exitosamente');
                    if (onDelete) onDelete(id);
                } else {
                    throw new Error('Error al eliminar la canción');
                }
            } catch (error) {
                console.error('Error al eliminar la canción:', error.message);
                alert('Error al eliminar la canción: ' + error.message);
            }
        }
    };

    const handleEditSong = (id) => {
        navigate(`/canciones/editar/${id}`);
    };

    return (
        <div className="track">
            <div className="track-id">#{song.id}</div>
            <div className="track-info">
                <div className="track-details">
                    <h3>{song.title}</h3>
                    <h4>{artistDetails?.name || 'Desconocido'} - {albumDetails?.title || 'Desconocido'}</h4>
                    <div className="content">
                        <audio controls>
                            <source src={song.song_file} type="audio/mpeg" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                    <p>{song.year}</p>
                </div>
            </div>
            <div className="track-actions">
                <button className="edit-button" onClick={() => handleEditSong(song.id)}>
                    <FaEdit /> Modificar
                </button>
                <button className="delete-button" onClick={() => handleDeleteSongFromAPI(song.id)}>
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}
