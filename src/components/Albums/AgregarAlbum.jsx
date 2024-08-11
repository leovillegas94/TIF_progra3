import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../AgregarArtista.css";
import { useAuth } from "../Contexts/AuthContext";

const AgregarAlbum = () => {
    //Estado que almacena el nombre del albun, el año, el artista, cover, loading, error, artists, state y código
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
        //Definimos la función asincrónica fetchArtists para obtener la lista de artistas
        const fetchArtists = async () => {
            let allArtists = []; //Arreglo o array para almacenar todos los artistas obtenidos
            let page = 1; // Comenzamos en la primera página de la API
            let hasNextPage = true; // Variable para verificar si hay más páginas disponibles

            try {
                // Mientras existan más páginas de artistas, realizamos la petición a la API para obtener artistas de una página específica
                while (hasNextPage) {
                    const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/?page=${page}`, {
                        headers: {
                            Authorization: `Token ${token}`,
                        }
                    });
                    // Verificamos si la respuesta de la API fue exitosa
                    if (!response.ok) {
                        throw new Error("Error al obtener la lista de artistas"); //Si la respuesta no fue exitosa, lanzamos un mensaje de error
                    }
                    // Convertimos la respuesta a JSON para obtener los datos que se volcaron en ella
                    const data = await response.json();
                    // Concatenamos los nuevos artistas obtenidos con el array allArtists
                    allArtists = allArtists.concat(data.results);
                    // Si existe una siguiente página, incrementamos el número de página; si no hay más páginas, terminamos el ciclo
                    if (data.next) {
                        page++;
                    } else {
                        hasNextPage = false;
                    }
                }
                 // Actualizamos el estado con todos los artistas que trajo la petición
                setArtists(allArtists);
            } catch (error) {
                console.error("Error al cargar los artistas:", error);
                setError("Error al cargar los artistas");
            }
        };
        // Ejecutamos la función fetchArtists cuando el efecto se ejecute
        fetchArtists();
    }, [token]);// El efecto se ejecuta cada vez que el valor del token cambie

    const handleImageChange = (e) => {
        //Función para manejar el cambio de la imagen de portada
        //Actualiza el estado con el primer archivo que sea seleccionado
        setCover(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenimos el comportamiento predeterminado del formulario (recargar la página)
        setLoading(true); // Activamos el estado de carga para deshabilitar el botón de envío
        setError(null); // Reiniciamos el estado de error para eliminar mensajes de error previos


        const formData = new FormData(); // Creamos un nuevo objeto FormData para enviar los datos del formulario
        formData.append('title', title); //Añadimos el título al álbun
        formData.append('year', year); //Añadimos el año de lanzamiento
        formData.append('artist', artist); //Añadimos el ID del artísta
        if (cover) {
            formData.append('cover', cover); //Cuando se selecciona una imagen para la portada, con este if se añade al FormData
        }

        try {  
        // Enviamos una solicitud POST a la API para crear un nuevo álbum
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/albums/', {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`, // Incluimos el token de autorización en los headers
                },
                body: formData, // Enviamos los datos del formulario
            });

            if (!response.ok) {
                // Si la respuesta no es exitosa, obtenemos el texto del error y lanzamos una excepción
                const errorText = await response.text();
                throw new Error(errorText);
            }
            // Si la respuesta no es exitosa, obtenemos el texto del error y lanzamos una excepción
            alert("Álbum creado con éxito");
            navigate('/albums');
        } catch (error) {
            //Registramos el error en la consola y actualizamos el estado de error
            console.error('Error al crear el álbum:', error);
            setError("Error al crear el álbum");
        } finally {
            // Al final de la operación, desactivamos el estado de carga sin importar si hubo éxito o fallo
            setLoading(false);
        }
    };

    return (
        <div className='container'> {/* Contenedor principal para centrar el formulario */}
            <div className="form-container"> {/* Título del formulario */}
                <h1>Añadir nuevo álbum</h1> {/* Formulario para añadir un nuevo álbum, se ejecuta handleSubmit al enviar */}
                <form onSubmit={handleSubmit}> {/* Etiqueta y campo de entrada para el nombre del álbum */}
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
                    <label> {/* Etiqueta y campo de entrada para el año de lanzamiento */}
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
                    <label>  {/* Etiqueta y lista desplegable para seleccionar el artista */}
                        Artista:
                        <select
                            name="artista"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un artista</option>  {/* Mapeo de los artistas disponibles para generar opciones en el select */}
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label> {/* Etiqueta y campo de entrada para seleccionar una imagen de portada */}
                        Imagen:
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={loading} className="add-album-button"> {/* Botón para enviar el formulario, deshabilitado si está en proceso de carga */}
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>  {/* Muestra un mensaje de error si ocurre un error al enviar el formulario */}
                    {error && <p className="add-album-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AgregarAlbum;
