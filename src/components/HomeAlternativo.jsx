import React, { useEffect, useState } from "react";
import Cancion from './Reproductor/Cancion';
import "./HomeAlternativo.css"

//Definimos el componente home
const HomeAlternativo = () => {
    //Definimos estados iniciales mediante useState
    const [canciones, setCanciones] = useState([]);

    //ESta funcion realiza una solicitud asíncrona a la API
    const fetchCanciones = async () => {
        const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/songs/?page=1&page_size=800');
        const data = await response.json();

        //Seleccionamos 3 canciones aleatorias y se actualiza el estado de canciones.
        const cancionesAleat = [];
        for (let i = 0; i < 3; i++){
            const indiceAleatorio = Math.floor(Math.random() * data.results.length);
            cancionesAleat.push(data.results[indiceAleatorio]);
            data.results.splice(indiceAleatorio,1);
        }
        setCanciones(cancionesAleat);
    };
    //Mediante useEffect llamamos a la función `fetchCanciones` cuando el componente es montado.
    useEffect(() => {
        fetchCanciones()
    }, []);

    return (
        <div className="home">
            <h2 className="home-title">Bienvenido al mundo de la música! Estos son nuestros recomendados de hoy</h2>
            <div className="home-body">
                <div className="home-img">
                    <img src="Play.png"/>
                </div>
                <div className="home-list">
                    {canciones.map(cancion => (
                    <Cancion key={cancion.id} song={cancion}/>
            ))}
                </div>
            </div>
        </div>
    );
};
export default HomeAlternativo;
