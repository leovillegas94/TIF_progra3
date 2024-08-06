import React from "react";
import './Artista.css';
import {FaTrash, FaEdit} from 'react-icons/fa';
import FotoArtista from "../assets/Artista.jpg"


export default function Artista({artist}) {
    return (
        <div className="artist">
            <div className="artist-img">
                <img src={artist.image || FotoArtista} alt=""/>
            </div>
            <div className="artist-name">
                <h2>{artist.name}</h2>
                <p className="artist-bio">{artist.bio}</p>
            </div>
            <div className="button-options">
                <button className="edit-button">
                    <FaEdit /> Modificar
                </button>
                <button className="delete-button">
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}