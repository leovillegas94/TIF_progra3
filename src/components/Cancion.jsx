import React from 'react';
import './Cancion.css';
import {FaPlay} from 'react-icons/fa';

export default function Cancion({ song }) {
    return (
        <div className="track">
            <div className="track-info">
                <div className="track-id">{song.id}</div>
                    <div className="track-details">
                        <h3>{song.title}</h3>
                        <h4>{song.artist} - {song.album}</h4>
                        <p>{song.year}</p>
                    </div>
                </div>
                <button className="play-button">
                <   FaPlay size={30} color="#000" /> {/* Ícono de play */}
                </button>
        </div>
    );
}
