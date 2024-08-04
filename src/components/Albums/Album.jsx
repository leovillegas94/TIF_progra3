import React from "react";
import AlbumCover from '../../assets/album.jpg';
import './Album.css';

export default function Album({album}) {
    const coverImage = album.cover ? album.cover : AlbumCover;

    return(
        <div className='album-card'>
            <div className='album-cover'>
                <img src={coverImage} alt={album.title} />
            </div>
            <div className='album-info'>
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <p>{album.year}</p>
            </div>
        </div>
    );
}