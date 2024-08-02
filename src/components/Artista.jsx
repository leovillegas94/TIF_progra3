import React from "react";
import './Artista.css';
import { AiFillEdit } from "react-icons/ai";
import {FaTrash} from 'react-icons/fa';


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
            <div >
                <button >
                    <AiFillEdit />
                </button>
                <button >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}