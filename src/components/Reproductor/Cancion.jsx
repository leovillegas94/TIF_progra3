import React from "react";
import {FaEdit, FaTrash} from 'react-icons/fa';
import './Cancion.css';
import { useAuth } from '../Contexts/AuthContext';

export default function Cancion({ song }) {
    const { state } = useAuth();
    console.log(state)

    const handleDeleteSong = async (id) => {
        const URL = `https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}/`;
        try {
          const response = await fetch(URL, {
            method: 'DELETE',
            headers: {
              Authorization: `Token ${state.token}`,
            }
          });
          
          console.log('Respuesta de la API:', response);
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Detalles del error:', errorData);
            throw new Error(`No se pudo eliminar la canción. Estado: ${response.status}`);
          }
      
          console.log('Canción eliminada con éxito');
        } catch (error) {
          console.error('Error al eliminar la canción:', error.message);
        }
      }

    return (
        <div className="track">
            <div className="track-id">{song.id}</div>
            <div className="track-info">
                <div className="track-details">
                    <h3>{song.title}</h3>
                    <h4>{song.artist} - {song.album}</h4>
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
                <button className="edit-button">
                    <FaEdit /> Modificar
                </button>
                <button className="delete-button" onClick={() => handleDeleteSong(song.id)}>
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}

