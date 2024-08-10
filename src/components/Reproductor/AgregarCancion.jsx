import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarCancion.css';

const AgregarCancion = () => {
    const [titulo, setTitulo] = useState('');
    const [anio, setAnio] = useState('');
    const [archivoCancion, setArchivoCancion] = useState(null);
    const [portada, setPortada] = useState(null);
    const [album, setAlbum] = useState('');
    const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [albumes, setAlbumes] = useState([]);
    const [artistas, setArtistas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const baseURL = 'https://sandbox.academiadevelopers.com/harmonyhub/';
            const token = localStorage.getItem('authToken');

            const fetchAllPages = async (url, includeToken = false) => {
                let data = [];
                let next = url;

                while (next) {
                    try {
                        const response = await fetch(next, {
                            headers: includeToken ? { Authorization: `Token ${token}` } : {},
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Error en la respuesta de la petición: ${errorText}`);
                        }

                        const json = await response.json();
                        data = data.concat(json.results);
                        next = json.next; 
                    } catch (error) {
                        console.error(`Error fetching data from ${next}:`, error);
                        setError(`Error al cargar datos de ${url}`);
                        return [];
                    }
                }

                return data;
            };

            try {
                const [albumesData, artistasData] = await Promise.all([
                    fetchAllPages(`${baseURL}albums/`),
                    fetchAllPages(`${baseURL}artists/`)
                ]);

                setAlbumes(albumesData);
                setArtistas(artistasData);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError("Error al cargar datos de álbumes, artistas.");
            }
        };

        fetchData();
    }, []);

    const handleArchivoCancionChange = (e) => {
        setArchivoCancion(e.target.files[0]);
    };

    const handlePortadaChange = (e) => {
        setPortada(e.target.files[0]);
    };

    const handleArtistaChange = (e) => {
        const { options } = e.target;
        const selectedArtistas = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setArtistasSeleccionados(selectedArtistas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        const token = localStorage.getItem('authToken');

        const formData = new FormData();
        formData.append('title', titulo);
        formData.append('year', anio);
        formData.append('album', album);
        if (archivoCancion) {
            formData.append('song_file', archivoCancion);
        }
        if (portada) {
            formData.append('cover', portada);
        }

        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/songs/', {
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

            const nuevaCancion = await response.json();
            console.log('Canción creada:', nuevaCancion);

            for (let artistId of artistasSeleccionados) {
                await associateArtistToSong(nuevaCancion.id, artistId, 'Artista');
            }

            const updatedSongResponse = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${nuevaCancion.id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (!updatedSongResponse.ok) {
                const errorText = await updatedSongResponse.text();
                throw new Error(errorText);
            }

            const updatedSong = await updatedSongResponse.json();
            console.log('Canción actualizada:', updatedSong);

            alert('Canción creada con éxito');
            navigate('/canciones');
        } catch (error) {
            console.error('Error creando la canción:', error);
            setError('Error creando la canción.');
        } finally {
            setCargando(false);
        }
    };

    const associateArtistToSong = async (songId, artistId, role) => {
        const URL = 'https://sandbox.academiadevelopers.com/harmonyhub/song-artists/';
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    song: songId,
                    artist: artistId,
                    role: role
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la respuesta de la API: ${errorText}`);
            }

            const result = await response.json();
            console.log('Artista asociado exitosamente:', result);
        } catch (error) {
            console.error('Error al asociar artista a la canción:', error);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Agregar Canción</h1>
                <form onSubmit={handleSubmit} className="formulario">
                    <div className="columna">
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

                        <label>
                            Artista(s):
                            <select
                                name="artistas"
                                multiple
                                value={artistasSeleccionados}
                                onChange={handleArtistaChange}
                                required
                            >
                                {artistas.map(artista => (
                                    <option key={artista.id} value={artista.id}>{artista.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="columna">
                        <label>
                            Archivo de la Canción:
                            <input
                                type="file"
                                name="archivoCancion"
                                accept='audio/*'
                                onChange={handleArchivoCancionChange}
                            />
                        </label>
                        <label>
                            Portada:
                            <input
                                type="file"
                                name="portada"
                                accept='image/*'
                                onChange={handlePortadaChange}
                            />
                        </label>

                        <button type="submit" disabled={cargando} className="add-song-button">
                            {cargando ? 'Agregando...' : 'Agregar'}
                        </button>
                        {error && <p className='add-song-error'>{error}</p>}
                    </div>
                </form>
                <button className="add-song-button" onClick={() => navigate('/canciones')}>
                    Volver a canciones
                </button>
            </div>
        </div>
    );
};

export default AgregarCancion;
