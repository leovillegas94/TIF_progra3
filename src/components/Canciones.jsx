import React from 'react';
import ListaCanciones from './Reproductor/ListaCanciones';

//Definimos el componente Canciones para poder englobar el componente lista de canciones.
const Canciones= () => {
    return (
        <div>
            <ListaCanciones />
        </div>
    );
};

export default Canciones;