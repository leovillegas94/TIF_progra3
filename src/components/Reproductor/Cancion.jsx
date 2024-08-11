import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Cancion.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

export default function Cancion({ song, onDelete }) {
    const [albumDetails, setAlbumDetails] = useState(null);  // Estado para almacenar los detalles del álbum
    const [artistDetails, setArtistDetails] = useState(null);  // Estado para almacenar los detalles del artista
    const navigate = useNavigate();  // Hook para navegación programática
    const { state } = useAuth();

    // Fetch detalles del álbum si el song tiene un album asignado
    useEffect(() => {
        if (song.album) {
            fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${song.album}/`)
                .then(response => response.json())
                .then(data => setAlbumDetails(data))  // Actualiza el estado con los detalles del álbum
                .catch(error => console.error('Error fetching album details:', error));
        }
        // Fetch detalles del artista si el song tiene artistas asignados
        if (song.artists && song.artists.length > 0) {
            fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${song.artists[0]}/`)
                .then(response => response.json())
                .then(data => setArtistDetails(data))  // Actualiza el estado con los detalles del artista
                .catch(error => console.error('Error fetching artist details:', error));
        }
    }, [song]);  // Dependencia en 'song', se ejecutará cada vez que cambie el objeto song

    const handleDeleteSongFromAPI = async (id) => {
        const { isAuthenticated } = state;
        if (!isAuthenticated) {
            navigate("login");
        }else if (window.confirm("¿Estás seguro de que deseas eliminar esta canción?")) {
            const URL = `https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}/`;
            const token = localStorage.getItem('authToken');  // Obtén el token de autenticación del localStorage
            try {
                const response = await fetch(URL, {
                    method: 'DELETE',  // Método de la solicitud
                    headers: {
                        Authorization: `Token ${token}`,  // Autorización con el token
                    }
                });
                if (response.ok || response.status === 404) {
                    alert('Canción eliminada exitosamente');
                    if (onDelete) onDelete(id);  // Llama a la función onDelete pasada como prop si existe
                } else {
                    throw new Error('Error al eliminar la canción');
                }
            } catch (error) {
                console.error('Error al eliminar la canción:', error);
                alert('Error al eliminar la canción: Sólo puedes eliminar canciones creadas por ti' );
            }
        }
    };

    const handleEditSong = (id) => {  // Función para manejar la edición de la canción
        navigate(`/canciones/editar/${id}`);  // Navega a la página de edición de la canción
    };

    return (
        <div className="track"> {/* Muestra el ID de la canción */}
            <div className="track-id">#{song.id}</div>
            <div className="track-info">
                <div className="track-details">
                    <h3>{song.title}</h3> {/* Título de la canción */}
                     {/* Nombre del artista y título del álbum (con valores predeterminados si no están disponibles) */}
                    <h4>{artistDetails?.name || 'Desconocido'} - {albumDetails?.title || 'Desconocido'}</h4>
                    <div className="content">  {/* Reproductor de audio */}
                        <audio controls>
                            <source src={song.song_file} type="audio/mpeg" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                    <p>{song.year}</p>   {/* Año de la canción */}
                </div>
            </div>
            <div className="track-actions">
                <button className="edit-button" onClick={() => handleEditSong(song.id)}>   {/* Botón para editar la canción */}
                    <FaEdit /> Modificar
                </button>
                <button className="delete-button" onClick={() => handleDeleteSongFromAPI(song.id)}>   {/* Botón para eliminar la canción */}
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}
