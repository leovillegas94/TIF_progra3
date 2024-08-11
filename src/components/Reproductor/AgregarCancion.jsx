import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarCancion.css';
import { useAuth } from "../Contexts/AuthContext";

const AgregarCancion = () => {   // Estados para gestionar los datos del formulario y el estado de la carga
    const [titulo, setTitulo] = useState('');
    const [anio, setAnio] = useState('');
    const [archivoCancion, setArchivoCancion] = useState(null);
    const [portada, setPortada] = useState(null);
    const [album, setAlbum] = useState('');
    const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [albumes, setAlbumes] = useState([]);
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();
    const { state } = useAuth();
    const token = state?.token;

    useEffect(() => {  // Efecto para cargar artistas y álbumes al montar el componente
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

        const fetchAlbumes = async () => {
            let allAlbumes = [];
            let page = 1;
            let hasNextPage = true;

            try {
                while (hasNextPage) {
                    const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/?page=${page}`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    });
                    if (!response.ok) {
                        throw new Error("Error al obtener la lista de albumes");
                    }

                    const data = await response.json();
                    allAlbumes = allAlbumes.concat(data.results);

                    if (data.next) {
                        page++;
                    } else {
                        hasNextPage = false;
                    }
                }

                setAlbumes(allAlbumes);
            } catch (error) {
                console.error("Error al cargar los albumes:", error);
                setError("Error al cargar los albumes");
            }
        };

        fetchArtists();
        fetchAlbumes();
    }, [token]);

    const handleArchivoCancionChange = (e) => {  // Manejador de cambios en el archivo de la canción
        setArchivoCancion(e.target.files[0]);
    };

    const handlePortadaChange = (e) => {  // Manejador de cambios en el archivo de la portada
        setPortada(e.target.files[0]);
    };

    const handleArtistaChange = (e) => {   // Manejador de cambios en los artistas seleccionados
        const { options } = e.target;
        const selectedArtistas = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setArtistasSeleccionados(selectedArtistas);
    };

    const handleSubmit = async (e) => {   // Manejador de cambios en los artistas seleccionados
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

            for (let artistId of artistasSeleccionados) {   // Asociar artistas a la canción
                await associateArtistToSong(nuevaCancion.id, artistId, 'Artista');  // Obtener la canción actualizada
            }

            const updatedSongResponse = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${nuevaCancion.id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (!updatedSongResponse.ok) {
                const errorText = await updatedSongResponse.text();
                throw new Error(errorText); // Lanza un error si la respuesta no es exitosa
            }

            const updatedSong = await updatedSongResponse.json();  // Obtiene la canción actualizada
            console.log('Canción actualizada:', updatedSong);
            console.log('Canción actualizada:', updatedSong);

            alert('Canción creada con éxito'); //Muestra el mensaje de éxito al crear la canción
            navigate('/canciones'); // Redirige a la lista de canciones
        } catch (error) {
            console.error('Error creando la canción:', error);
            setError('Error creando la canción.');  //Muestra mensaje de error al crear la canción
        } finally {
            setCargando(false);  // Establece el estado de carga en falso
        }
    };

    const associateArtistToSong = async (songId, artistId, role) => {  // Función para asociar un artista a una canción
        const URL = 'https://sandbox.academiadevelopers.com/harmonyhub/song-artists/';
        const token = localStorage.getItem('authToken');
        try {   // Función para asociar un artista a una canción
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'  // Obtiene el resultado de la asociación
                },
                body: JSON.stringify({
                    song: songId,
                    artist: artistId,
                    role: role
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la respuesta de la API: ${errorText}`);  // Lanza un error si la respuesta no es exitosa
            }

            const result = await response.json();  //Obtiene el resultado de la asociación
            console.log('Artista asociado exitosamente:', result);
        } catch (error) {
            console.error('Error al asociar artista a la canción:', error); //Muestra un mensaje de error cuando falla la asociación
        }
    };

    return (
        <div className="container">
            <div className="form-container">  {/* Contenedor principal para el formulario de agregar canción */}
                <h1 style={{ color: 'white'}}>Agregar Canción</h1>  {/* Encabezado del formulario */}
                <form onSubmit={handleSubmit} className="formulario"> 
                    <div className="columna">
                        <label>
                            Título de la Canción:   {/* Campo para el título de la canción */}
                            <input
                                type="text"
                                name="titulo"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                                placeholder='Inserte el título de la canción'
                            />
                        </label>

                        <label>  {/* Campo para el año de la canción */}
                            Año:
                            <input
                                type="number"
                                name="anio"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                                placeholder='Inserte el año de lanzamiento'
                            />
                        </label>

                        <label>  {/* Campo para seleccionar el Album */}
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

                        <label>  {/* Campo para seleccionar el artista */}
                            Artista(s):
                            <select
                                name="artistas"
                                multiple
                                value={artistasSeleccionados}
                                onChange={handleArtistaChange} 
                                required
                            >
                                {artists.map(artist => (
                                    <option key={artist.id} value={artist.id}>{artist.name}</option>
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
                         {/* Botón de envío del formulario */}
                        <button type="submit" disabled={cargando} className="add-song-button">
                            {cargando ? 'Agregando...' : 'Agregar'}
                        </button>   {/* Muestra el mensaje de error si existe */}
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
