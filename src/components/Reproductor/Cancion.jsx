import React from "react";
import {FaEdit, FaTrash} from 'react-icons/fa';
import './Cancion.css';
import { useAuth } from '../Contexts/AuthContext';

export default function Cancion({ song }) {

    const { state, actions } = useAuth();
    const { isAuthenticated, user } = state;

    //const [canciones, setCanciones] = useState([]);
    
    const handleDeleteSong = async (id) => {
        const URL = `https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}`;
        const response = await fetch(URL, {method: 'DELETE', headers: {Authorization: `Token ${token}`}});
        const data = await response.json();
        console.log(data);
    
        //setCanciones(canciones =>canciones.filter(cancion => song.id !== id))
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

