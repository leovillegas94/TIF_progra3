import React from "react";
import { useNavigate } from 'react-router-dom';
import './Artista.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import FotoArtista from "../assets/Artista.jpg";

export default function Artista({ artist, onDelete }) {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/artistas/editar/${artist.id}`);
    };

    const handleDeleteClick = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este artista?")) {
            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${artist.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    alert('Artista eliminado exitosamente');
                    if (onDelete) onDelete();
                    navigate('/artistas');
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            } catch (error) {
                console.error('Error al eliminar el artista:', error);
                alert('Error al eliminar el artista.');
            }
        }
    };

    return (
        <div className="artist">
            <div className="artist-img">
                <img src={artist.image || FotoArtista} alt={artist.name} />
            </div>
            <div className="artist-name">
                <h2>#{artist.id} - {artist.name} </h2>
                <p className="artist-bio">{artist.bio}</p>
            </div>
            <div className="button-options">
                <button className="edit-button" onClick={handleEditClick}>
                    <FaEdit /> Modificar
                </button>
                <button className="delete-button" onClick={handleDeleteClick}>
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}