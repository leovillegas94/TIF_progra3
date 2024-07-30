import React from 'react';
import './Cancion.css';


export default function Cancion({ song }) {
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
        </div>
    );
}

