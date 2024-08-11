import React from "react";
import AlbumCover from '../../assets/album.jpg'; // Importa una imagen predeterminada para la portada del álbum
import './Album.css'; // Importa los estilos CSS específicos para este componente
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importa iconos para editar y eliminar
import { useNavigate } from "react-router-dom"; // Hook para navegar programáticamente entre rutas

export default function Album({ album, artistName, onDelete }) { // Utiliza la imagen de la portada si existe, de lo contrario usa una imagen predeterminada
    const coverImage = album.cover ? album.cover : AlbumCover;
    const navigate = useNavigate(); // Hook para realizar la navegación

    const handleEditClick = () => { // Navega a la ruta de edición del álbum utilizando su ID
        navigate(`/albums/editar/${album.id}`);
    };

    const handleDeleteClick = async () => { // Confirmación antes de eliminar el álbum
        if (window.confirm("¿Está seguro que desea eliminar el álbum?")) {
            const token = localStorage.getItem("authToken"); // Obtiene el token de autenticación del almacenamiento local
            try { // Realiza una solicitud DELETE a la API para eliminar el álbum
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${album.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Token ${token}`, // Añade el token de autenticación a los headers
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) { // Si la eliminación fue exitosa, muestra una alerta y navega a la lista de álbumes
                    alert("Álbum eliminado exitosamente");
                    if (onDelete) onDelete(); // Llama a la función onDelete si está definida para actualizar la lista
                    navigate("/albums");
                } else {   // Si hubo un error en la respuesta, lanza una excepción con el texto del error
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            } catch (error) { //Muestra un mensaje de error en la consola y una alerta al usuario
                console.error("Error al eliminar el álbum:", error);
                alert("Error al eliminar el álbum");
            }
        }
    };

    return (
        <div className='album-card'>
            <div className='album-cover'> {/* Muestra la imagen de la portada del álbum */}
                <img src={coverImage} alt={album.title} />
            </div>
            <div className='album-info'> {/* Muestra el título, nombre del artista, año y ID del álbum */}
                <h3>{album.title}</h3>
                <p>{artistName}</p>
                <p>{album.year}</p>
                <p>#{album.id}</p>
            </div>
            <div className='button-options'> 
                <button className='edit-button' onClick={handleEditClick}> {/* Botón para editar el álbum, usando el icono FaEdit */}
                    <FaEdit /> Modificar
                </button> 
                <button className='delete-button' onClick={handleDeleteClick}>  {/* Botón para eliminar el álbum, usando el icono FaTrash */}
                    <FaTrash /> Eliminar
                </button>
            </div>
        </div>
    );
}
