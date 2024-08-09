import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../AgregarArtista.css";

const EditarAlbum = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [artist, setArtist] = useState("");
    const [cover, setCover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}`);
                const data = await response.json();
                setTitle(data.title || "");
                setYear(data.year || "");
                setArtist(data.artist || "");
            } catch (error) {
                console.error('Error fetching album:', error);
                setError('Error al cargar el álbum');
            }
        };

        const fetchAllArtists = async () => {
            const baseURL = 'https://sandbox.academiadevelopers.com/harmonyhub/artists/';
            let artistsData = [];
            let nextURL = baseURL;

            try {
                while (nextURL) {
                    const response = await fetch(nextURL);
                    if (!response.ok) {
                        throw new Error(`Error en la respuesta de la petición: ${response.statusText}`);
                    }
                    const data = await response.json();
                    artistsData = [...artistsData, ...data.results];
                    nextURL = data.next; 
                }
                setArtists(artistsData);
            } catch (error) {
                console.error('Error fetching artists:', error);
                setError('Error al cargar los artistas');
            }
        };

        fetchAlbum();
        fetchAllArtists();
    }, [id]);

    const handleImageChange = (e) => {
        setCover(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("year", year);
        formData.append("artist", artist);
        if (cover) {
            formData.append("cover", cover);
        }

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            navigate("/albums");
        } catch (error) {
            console.error("Error al editar el álbum:", error);
            setError("Error al editar el álbum");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Editar Álbum</h1>
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
                                <option key={artist.id} value={artist.id}>{artist.name || 'No especificado'}</option>
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
                    <button type="submit" disabled={loading} className="edit-artist-button">
                        {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                    {error && <p className="edit-artist-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default EditarAlbum;
