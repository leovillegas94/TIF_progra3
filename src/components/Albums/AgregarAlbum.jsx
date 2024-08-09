import React, { useState, useEffect } from "react";
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
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();
    const { state } = useAuth();
    const token = state?.token;

    useEffect(() => {
        const fetchArtists = async () => {
            let allArtists = [];
            let page = 1;
            let hasNextPage = true;

            try {
                while (hasNextPage) {
                    const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/?page=${page}`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    });
                    if (!response.ok) {
                        throw new Error("Error al obtener la lista de artistas");
                    }

                    const data = await response.json();
                    allArtists = allArtists.concat(data.results);

                    if (data.next) {
                        page++;
                    } else {
                        hasNextPage = false;
                    }
                }

                setArtists(allArtists);
            } catch (error) {
                console.error("Error al cargar los artistas:", error);
                setError("Error al cargar los artistas");
            }
        };

        fetchArtists();
    }, [token]);

    const handleImageChange = (e) => {
        setCover(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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
                        <select
                            name="artista"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un artista</option>
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
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
