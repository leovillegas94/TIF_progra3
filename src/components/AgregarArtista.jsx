import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgregarArtista.css';
import { useAuth } from './Contexts/AuthContext';

//DEfinimos el componente agregar artista.
const AgregarArtista = () => {

    //DEfinimos los estados iniciales, manejo de navegación, y contexto de autenticación.
    const [nombre, setNombre] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const { state: { token } } = useAuth();
    
    //Cambia el estado con la imagen seleccionada.
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }
    
    //Se invoca al enviar el formulario. Envía una solicitud POST a la API con los datos ingresados en el formulario y la imagen adjunta. Mediante preventDefault evitamos que la página se recargue al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', nombre);
        formData.append('bio', bio);
        formData.append('website', website);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/artists/', {
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

            const newArtist = await response.json();
            console.log('Artista creado', newArtist);
            alert('Artista creado con éxito')
            navigate('/artistas');
        } catch (error) {
            console.error('Error creando al artista:', error);
            setError('Error al crear el artista');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Agregar Artista</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre del Artista:
                        <input
                            type="text"
                            name="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            placeholder='Inserte un nombre'
                        />
                    </label>
                    <br />
                    <label>
                        Biografía:
                        <textarea
                            name="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder='Inserte una pequeña biografía del artista'
                        ></textarea>
                    </label>
                    <br />
                    <label>
                        Página web:
                        <input
                            type="url"
                            name="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder='Inserte la web del artista'
                        />
                    </label>
                    <label>
                        Imagen:
                        <input
                            type="file"
                            name="image"
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={loading} className="add-artist-button">
                        {loading ? 'Agregando...' : 'Agregar'}
                    </button>
                    {error && <p className='add-artist-error'>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default AgregarArtista;
