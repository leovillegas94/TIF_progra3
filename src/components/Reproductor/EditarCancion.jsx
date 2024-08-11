import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarCancion.css';

const EditarCancion = () => {
    const { id } = useParams(); // Obtiene el ID de la canción desde los parámetros de la URL
    const navigate = useNavigate(); // Hook para navegación programática
    const [titulo, setTitulo] = useState('');  // Estado para almacenar el título de la canción
    const [anio, setAnio] = useState('');  // Estado para almacenar el año de la canción
    const [archivoCancion, setArchivoCancion] = useState(null); // Estado para almacenar el archivo de la canción
    const [portada, setPortada] = useState(null);  // Estado para almacenar la portada de la canción
    const [album, setAlbum] = useState('');  // Estado para almacenar el álbum seleccionado
    const [artista, setArtista] = useState(''); // Estado para almacenar el artista seleccionado
    const [cargando, setCargando] = useState(false); // Estado para controlar el estado de carga
    const [error, setError] = useState(null);  // Estado para almacenar los mensajes de error
    const [albumes, setAlbumes] = useState([]);  // Estado para almacenar la lista de álbumes
    const [artistas, setArtistas] = useState([]);  // Estado para almacenar la lista de artistas

    useEffect(() => {
        const fetchData = async () => {
            const baseURL = 'https://sandbox.academiadevelopers.com/harmonyhub/';
            const token = localStorage.getItem('authToken');  // Obtén el token de autenticación del localStorage

            const fetchAllPages = async (url, includeToken = false) => {  // Función para fetch de todas las páginas de la API
                let data = [];
                let next = url;

                while (next) {
                    try {  // Fetch datos de la canción, álbumes y artistas
                        const response = await fetch(next, {
                            headers: includeToken ? { Authorization: `Token ${token}` } : {},
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`Error en la respuesta de la petición: ${errorText}`);
                        }

                        const json = await response.json();
                        data = data.concat(json.results);  // Combina los resultados obtenidos
                        next = json.next; // URL de la siguiente página
                    } catch (error) {
                        console.error(`Error fetching data from ${next}:`, error);
                        setError(`Error al cargar datos de ${url}`);
                        return [];
                    }
                }

                return data;
            };

            try {
                const [cancionResponse, albumesData, artistasData] = await Promise.all([
                    fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${id}/`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    }),
                    fetchAllPages(`${baseURL}albums/`),
                    fetchAllPages(`${baseURL}artists/`)
                ]);

                const cancionData = await cancionResponse.json();
                setTitulo(cancionData.title || '');   // Datos de la canción
                setAnio(cancionData.year || '');  // Actualiza el estado con el título de la canción
                setAlbum(cancionData.album || '');  // Actualiza el estado con el año de la canción
                setArtista(cancionData.artists?.[0] || '');  // Actualiza el estado con el primer artista de la canción
                setAlbumes(albumesData);  // Actualiza el estado con la lista de álbumes
                setArtistas(artistasData);  //Actualiza el estado de la lista de artistas
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError("Error al cargar datos de la canción, álbumes o artistas.");
            }
        };

        fetchData();
    }, [id]); //Ejecuta el efecto cada vez que el ID cambia

    const handleArchivoCancionChange = (e) => {  //aneja el cambio en el archivo de la canción
        setArchivoCancion(e.target.files[0]);
    };

    const handlePortadaChange = (e) => {  //Maneja el cambio en la portada
        setPortada(e.target.files[0]);
    };

    const handleSubmit = async (e) => {  //Maneja el envío del formulario
        e.preventDefault();
        setCargando(true);  //Activa el estado de carga
        setError(null);  //Resetea el error

        const token = localStorage.getItem('authToken');  //Obtiene el token de autenticación

        const formData = new FormData();
        formData.append('title', titulo);  //añade el título del FormData
        formData.append('year', anio);  //Añade el año al FormData
        formData.append('album', album);  //Añade el album al FormData
        formData.append('artists', artista);  //Añade el artista al FormData
        if (archivoCancion) {
            formData.append('song_file', archivoCancion); //Añade el archivo de la canción
        }
        if (portada) {
            formData.append('cover', portada);  //Añade la portada al FormData
        }

        try {  //Envía la solicitud PUT para actualizar la canción
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

            const cancionActualizada = await response.json();  //Datos de la canción actualizada
            console.log('Canción actualizada:', cancionActualizada);
            alert('Canción actualizada con éxito');
            navigate('/canciones');  //Navega a la página de las canciones despues de haber actualizado
        } catch (error) {
            console.error('Error actualizando la canción:', error);  //Manejo de errores, muestra el mensaje de error
            setError('Error actualizando la canción.');
        } finally {
            setCargando(false);  //Desactiva el estado de carga
        }
    };

    return (
        <div className="container">  
            <div className="form-container">
                <h1 style={{ color: 'white'}}>Editar Canción</h1>
                <form onSubmit={handleSubmit}>
                    <label>  {/* Campo para el título de la canción */}
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
                    <label>    {/* Campo para el año de lanzamiento */}
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
                    <label>    {/* Selector para el álbum */}
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
                        Artista:      {/* Selector para el artista */}
                        <select
                            name="artista"
                            value={artista}
                            onChange={(e) => setArtista(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un artista</option>
                            {artistas.map(artista => (
                                <option key={artista.id} value={artista.id}>{artista.name || 'No especificado'}</option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>  {/* Campo para cargar el archivo de la canción */}
                        Archivo de la Canción:  
                        <input
                            type="file"
                            name="archivoCancion"
                            accept='audio/*'
                            onChange={handleArchivoCancionChange}
                        />
                    </label>
                    <br />
                    <label>   {/* Campo para cargar la portada */}
                        Portada:
                        <input
                            type="file"
                            name="portada"
                            accept='image/*'
                            onChange={handlePortadaChange}
                        />
                    </label>   {/* Botón para enviar el formulario */}
                    <br />
                    <button type="submit" disabled={cargando} className="edit-song-button">
                        {cargando ? 'Actualizando...' : 'Actualizar'}
                    </button>   {/* Muestra el mensaje de error si existe */}
                    {error && <p className='edit-song-error'>{error}</p>}
                    <button className="edit-song-button" onClick={() => navigate('/canciones')}>
                    Volver a canciones  {/* Botón para volver a la lista de canciones */}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditarCancion; 