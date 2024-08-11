import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../AgregarArtista.css"; //Importa los estilos específicos para este componente

const EditarAlbum = () => {
    const { id } = useParams(); // Obtiene el ID del álbum desde la URL
    const [title, setTitle] = useState(""); // Estado para el título del álbum
    const [year, setYear] = useState(""); // Estado para el año de lanzamiento del álbum
    const [artist, setArtist] = useState(""); // Estado para el artista seleccionado
    const [cover, setCover] = useState(null); // Estado para la imagen de la portada
    const [loading, setLoading] = useState(false); // Estado para indicar si la solicitud está en proceso
    const [error, setError] = useState(null); // Estado para manejar errores
    const [artists, setArtists] = useState([]); // Estado para almacenar la lista de artistas disponibles
    const navigate = useNavigate(); // Hook para navegar programáticamente entre rutas

    useEffect(() => { // Hook useEffect para cargar los datos del álbum y la lista de artistas cuando se monta el componente
        // Función para obtener los datos del álbum por su ID
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}`);
                const data = await response.json();
                // Actualiza los estados con los datos obtenidos del álbum
                setTitle(data.title || "");
                setYear(data.year || "");
                setArtist(data.artist || "");
            } catch (error) {
                console.error('Error fetching album:', error);
                setError('Error al cargar el álbum'); // Manejo de errores
            }
        };
        // Función para obtener la lista completa de artistas disponibles
        const fetchAllArtists = async () => {
            const baseURL = 'https://sandbox.academiadevelopers.com/harmonyhub/artists/';
            let artistsData = [];  // Almacena los datos de los artistas
            let nextURL = baseURL; // URL para la siguiente página de resultados

            try { // Bucle para recorrer todas las páginas de resultados
                while (nextURL) {
                    const response = await fetch(nextURL); 
                    if (!response.ok) {
                        throw new Error(`Error en la respuesta de la petición: ${response.statusText}`);
                    }
                    const data = await response.json(); // Agrega los resultados actuales a la lista completa de artistas
                    artistsData = [...artistsData, ...data.results];
                    nextURL = data.next; // Actualiza la URL para la siguiente página
                }
                setArtists(artistsData); // Actualiza el estado con la lista completa de artistas
            } catch (error) { // Manejo de errores
                console.error('Error fetching artists:', error);
                setError('Error al cargar los artistas');
            }
        };

        fetchAlbum(); // Llama a las funciones para cargar el álbum y los artistas
        fetchAllArtists();
    }, [id]);

    const handleImageChange = (e) => { // Maneja el cambio de la imagen de portada
        setCover(e.target.files[0]); // Actualiza el estado con el archivo seleccionado
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); // Evita el comportamiento por defecto del formulario
        setLoading(true); // Indica que la solicitud está en proceso
        setError(null); // Resetea el estado de error

        const token = localStorage.getItem("authToken"); // Obtiene el token de autenticación del almacenamiento local

        const formData = new FormData(); // Crea un objeto FormData para enviar los datos
        formData.append("title", title); // Agrega el título del álbum
        formData.append("year", year); // Agrega el año de lanzamiento
        formData.append("artist", artist); // Agrega el ID del artista
        if (cover) {
        if (cover) {
            formData.append("cover", cover); // Agrega la imagen de portada si está presente
        }

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}`, {
                method: "PATCH", // Utiliza el método PATCH para actualizar el álbum
                headers: {
                    Authorization: `Token ${token}`, // Añade el token de autenticación a los headers
                },
                body: formData, // Envía los datos del formulario
            });

            if (!response.ok) {
                const errorText = await response.text(); // Obtiene el texto de error si la respuesta no es correcta
                throw new Error(errorText);
            }
            navigate("/albums"); // Navega de vuelta a la lista de álbumes después de la edición exitosa
        } catch (error) { //Manejo de errores
            console.error("Error al editar el álbum:", error);
            setError("Error al editar el álbum");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container"> return (  {/* Contenedor principal que envuelve todo el formulario */}
            <div className="container">
                <div className="form-container">  {/* Título del formulario */}
                    <h1>Editar Álbum</h1>   {/* Formulario para editar un álbum */}
                    <form onSubmit={handleSubmit}>
                        <label> {/* Campo para ingresar el nombre del álbum */}
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
                            Año: {/* Campo para ingresar el año de lanzamiento */}
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
                        <label>  {/* Selector para elegir un artista */}
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
                        <label>  {/* Campo para subir una imagen */}
                            Imagen:
                            <input
                                type="file"
                                name="imagen"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>   {/* Botón para enviar el formulario */}
                        <br />
                        <button type="submit" disabled={loading} className="edit-artist-button">
                            {loading ? "Actualizando..." : "Actualizar"}
                        </button>  {/* Mensaje de error, si hay alguno */}
                        {error && <p className="edit-artist-error">{error}</p>}
                    </form>
                </div>
            </div>
        );

    export default EditarAlbum;
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
};

export default EditarAlbum;
