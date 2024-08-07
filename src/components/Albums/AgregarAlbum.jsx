import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../AgregarArtista.css";
import { useAuth } from "../Contexts/AuthContext";

const AgregarAlbum = () => {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [artist, setArtist] = useState("");
    const [cover, setCover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { state } = useAuth();
    const token = state?.token;

    const handleImageChange = (e) => {
        setCover(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Asegúrate de que FormData esté en mayúsculas
        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('artist', artist);
        if (cover) {
            formData.append('cover', cover);
        }

        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/albums/', {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const newAlbum = await response.json();
            console.log(newAlbum);
            alert("Álbum creado con éxito");
            navigate('/albums');
        } catch (error) {
            console.error('Error al crear el álbum:', error);
            setError("Error al crear el álbum");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className="form-container">
                <h1>Añadir nuevo álbum</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre del álbum:
                        <input 
                            type="text"
                            name="nombre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Ingrese el nombre del álbum"
                        />
                    </label>
                    <br />
                    <label>
                        Año:
                        <input 
                            type="text"
                            name="año"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            placeholder="Ingrese el año de lanzamiento"
                        />
                    </label>
                    <br />
                    <label>
                        Artista:
                        <input 
                            type="text"
                            name="artista"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            required
                            placeholder="Ingrese el ID del artista"
                        />
                    </label>
                    <label>
                        Imagen:
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={loading} className="add-album-button">
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    {error && <p className="add-album-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AgregarAlbum;
