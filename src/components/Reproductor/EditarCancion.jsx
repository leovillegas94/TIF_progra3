import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AgregarCancion.css';

const EditarCancion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [anio, setAnio] = useState('');
    const [duracion, setDuracion] = useState('');
    const [archivoCancion, setArchivoCancion] = useState(null);
    const [portada, setPortada] = useState(null);
    const [album, setAlbum] = useState('');
    const [artista, setArtista] = useState('');
    const [genero, setGenero] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [albumes, setAlbumes] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');

                const [cancionResponse, albumesResponse, artistasResponse, generosResponse] = await Promise.all([
                    fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    }),
                    fetch('https://sandbox.academiadevelopers.com/harmonyhub/albums/', {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    }),
                    fetch('https://sandbox.academiadevelopers.com/harmonyhub/artists/', {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    }),
                    fetch('https://sandbox.academiadevelopers.com/harmonyhub/genres/', {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    })
                ]);

                const cancionData = await cancionResponse.json();
                const albumesData = await albumesResponse.json();
                const artistasData = await artistasResponse.json();
                const generosData = await generosResponse.json();

                setTitulo(cancionData.title || '');
                setAnio(cancionData.year || '');
                setDuracion(cancionData.duration || '');
                setAlbum(cancionData.album || '');
                setArtista(cancionData.artists?.[0] || '');
                setGenero(cancionData.genres?.[0] || '');
                setAlbumes(albumesData.results);
                setArtistas(artistasData.results);
                setGeneros(generosData.results);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError("Error al cargar datos de la canción, álbumes, artistas o géneros.");
            }
        };

        fetchData();
    }, [id]);

    const handleArchivoCancionChange = (e) => {
        setArchivoCancion(e.target.files[0]);
    };

    const handlePortadaChange = (e) => {
        setPortada(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        const token = localStorage.getItem('authToken');

        const formData = new FormData();
        formData.append('title', titulo);
        formData.append('year', anio);
        formData.append('duration', duracion);
        formData.append('album', album);
        formData.append('artists', artista);
        formData.append('genres', genero);
        if (archivoCancion) {
            formData.append('song_file', archivoCancion);
        }
        if (portada) {
            formData.append('cover', portada);
        }

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const cancionActualizada = await response.json();
            console.log('Canción actualizada:', cancionActualizada);
            alert('Canción actualizada con éxito');
            navigate('/canciones');
        } catch (error) {
            console.error('Error actualizando la canción:', error);
            setError('Error actualizando la canción.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Editar Canción</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Título de la Canción:
                        <input
                            type="text"
                            name="titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                            placeholder='Inserte el título de la canción'
                        />
                    </label>
                    <br />
                    <label>
                        Año:
                        <input
                            type="number"
                            name="anio"
                            value={anio}
                            onChange={(e) => setAnio(e.target.value)}
                            placeholder='Inserte el año de lanzamiento'
                        />
                    </label>
                    <br />
                    <label>
                        Duración:
                        <input
                            type="text"
                            name="duracion"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                            placeholder='Inserte la duración de la canción (en segundos)'
                        />
                    </label>
                    <br />
                    <label>
                        Álbum:
                        <select
                            name="album"
                            value={album}
                            onChange={(e) => setAlbum(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un álbum</option>
                            {albumes.map(album => (
                                <option key={album.id} value={album.id}>{album.title}</option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        Artista:
                        <select
                            name="artista"
                            value={artista}
                            onChange={(e) => setArtista(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un artista</option>
                            {artistas.map(artista => (
                                <option key={artista.id} value={artista.id}>{artista.name}</option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        Género:
                        <select
                            name="genero"
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un género</option>
                            {generos.map(genero => (
                                <option key={genero.id} value={genero.id}>{genero.name}</option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        Archivo de la Canción:
                        <input
                            type="file"
                            name="archivoCancion"
                            accept='audio/*'
                            onChange={handleArchivoCancionChange}
                        />
                    </label>
                    <br />
                    <label>
                        Portada:
                        <input
                            type="file"
                            name="portada"
                            accept='image/*'
                            onChange={handlePortadaChange}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={cargando} className="add-song-button">
                        {cargando ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    {error && <p className='add-song-error'>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default EditarCancion;
