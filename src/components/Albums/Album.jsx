import React from "react";
import AlbumCover from '../../assets/album.jpg';
import './Album.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function Album({ album, onDelete }) {
    const coverImage = album.cover ? album.cover : AlbumCover;
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/albums/editar/${album.id}`);
    };

    const handleDeleteClick = async() => {
        if(window.confirm("¿Está seguro que desea eliminar el álbum?")){
            const token=localStorage.getItem("authToken");
            try{
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${album.id}`,{
                    method:"DELETE",
                    headers:{
                        "Authorization":`Token ${token}`,
                        "Content-Type":"application/json"
                    },
                });
                if (response.ok){
                    alert("Album eliminado exitosamente");
                    if(onDelete) onDelete();
                    navigate("/albums");
                } else{
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            } catch (error){
                console.error("Error al eliminar el album:", error);
                alert("Error al eliminar el album");
            }
        }
    };

    return (
        <div className='album-card'>
            <div className='album-cover'>
                <img src={coverImage} alt={album.title} />
            </div>
            <div className='album-info'>
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
                <p>{album.year}</p>
                <p>#{album.id}</p>
            </div>
            <div className='button-options'>
                <button className='edit-button' onClick={handleEditClick}>
                    <FaEdit /> Modificar
                </button>
                <button className='delete-button' onClick={handleDeleteClick}>
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}
