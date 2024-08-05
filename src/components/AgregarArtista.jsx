import React from 'react';

const AgregarArtista = () => {
    return (
        <div>
            <h1>Agregar Artista</h1>
            <form>
                {/* Formulario para agregar artista */}
                <label>
                    Nombre del Artista:
                    <input type="text" name="nombre" />
                </label>
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};

export default AgregarArtista;
