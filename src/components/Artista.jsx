import React from "react";
import '../styles/Artista.css'



export default function Artista({artist}) {
    return (
        <div className="artist">
            <div className="artist-img">
                <img src={artist.image} alt=""/>
            </div>
            <div className="artist-name">
                <h2>{artist.name}</h2>
                <p className="artist-bio">{artist.bio}</p>
            </div>
        </div>
    );
}