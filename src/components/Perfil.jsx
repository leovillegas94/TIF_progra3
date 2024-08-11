import { useState, useEffect, useRef } from "react";
import { useAuth } from "./Contexts/AuthContext";
import FotoPerfil from "../assets/Profile.jpg";
import "../components/Perfil.css";
import { FaEdit } from 'react-icons/fa';

//Definimos el componente funconal Perfil.

function Perfil() {

    //Definimos los estados usando el hook useState para manejar el estado del componente.
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state } = useAuth();
    const { token } = state;
    const [editMode, setEditMode] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    //Usamos useRef para guardar referencias a los campos del formulario.
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const dobRef = useRef(null);
    const bioRef = useRef(null);

    //useEffect se utiliza para hacer una solicitud a la API para obtener los datos del perfil del usuario, cuando cambia el token o cuando se carga por primera vez el componente. Esto permite 
    useEffect(() => {
        if (!token) {
            setError("No se pudo obtener el token de autenticación.");
            setLoading(false);
            return;
        }

        fetch(
            `https://sandbox.academiadevelopers.com/users/profiles/profile_data/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                return response.json();
            })
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    //Medinate esta función se envían los datos de perfil a actualizar cuando se envía el formulario. Se usa preventDefault() para evitar que la página se reacargue al realizar el envío del formulario.
    function handleSubmit(event) {
        event.preventDefault();
        if (!userData || !userData.user__id) {
            setError("No se pudo encontrar el ID del usuario.");
            return;
        }

        setLoadingUpdate(true);
        setError(null);
        updateProfile(
            `https://sandbox.academiadevelopers.com/users/profiles/${userData.user__id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    first_name: firstNameRef.current.value,
                    last_name: lastNameRef.current.value,
                    email: emailRef.current.value,
                    dob: dobRef.current.value,
                    bio: bioRef.current.value,
                }),
            }
        );
    }

    //Esta funcion cambia entre modo edición y modo visualización según sea necesario.
    function handleEditMode() {
        setEditMode(!editMode);
    }

    //Esta funcion realiza una solicitud PATCH a la API para actualizar los datos del perfil.
    function updateProfile(url, options) {
        fetch(url, options)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update profile");
                }
                return response.json();
            })
            .then((data) => {
                setUserData(data);
                setEditMode(false);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoadingUpdate(false);
            });
    }

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="perfil">
            {/*verificamos si existen datos del perfil para renderizar*/}
            {userData ? (
                <>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="div-perfil">
                            <div className="div-img">
                                <figure className="figure">
                                    <img
                                        className="image"
                                        src={
                                            userData.image ||
                                            FotoPerfil
                                        }
                                        alt="Profile image"
                                    />
                                </figure>
                            </div>
                            <div className="name-profile">
                                {editMode ? (
                                    <div>
                                        <input
                                            type="text"
                                            ref={firstNameRef}
                                            defaultValue={userData.first_name}
                                        />
                                        <input
                                            type="text"
                                            ref={lastNameRef}
                                            defaultValue={userData.last_name}
                                        />
                                    </div>
                                ) : (
                                    <p>
                                        {firstNameRef.current?.value || userData.first_name}{" "}
                                        {lastNameRef.current?.value || userData.last_name}
                                    </p>
                                )}
                            </div>
                            <button
                                className="button-perfil"
                                onClick={handleEditMode}
                                type="button"
                            >
                                <FaEdit /> {!editMode ? "Modificar" : "Salir"}
                            </button>
                        </div>

                        <div className="content">
                            <div className="div-label">
                                <label className="label-perfil"> Email:</label>
                                <div className="">
                                    <input
                                        className="input-perfil"
                                        type="email"
                                        id="email"
                                        name="email"
                                        ref={emailRef}
                                        defaultValue={userData.email}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label-perfil"> Fecha de Nacimiento:</label>
                                <div>
                                    <input
                                        className="input-perfil"
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        ref={dobRef}
                                        defaultValue={userData.dob}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label-perfil"> Biografía:</label>
                                <div>
                                    <textarea
                                        className="input-perfil"
                                        id="bio"
                                        name="bio"
                                        ref={bioRef}
                                        defaultValue={userData.bio || "Contanos de vos..."}
                                        disabled={!editMode}
                                    />
                                </div>
                            </div>
                            {editMode ? (
                                <div>
                                    <button
                                        className="button-perfil"
                                        type="submit"
                                    >
                                        {loadingUpdate
                                            ? "Enviando..."
                                            : "Enviar"}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </form>
                </>
            ) : (
                <p className="subtitle">No se encontraron datos del usuario.</p>
            )}
        </div>
    );
}

export default Perfil;
