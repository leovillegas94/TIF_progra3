import { useState, useEffect , useRef} from "react";
import { useAuth } from "./Contexts/AuthContext";
import FotoPerfil from "../assets/Profile.jpg"
import "../components/Perfil.css"
import {FaEdit } from 'react-icons/fa';


function Perfil() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth("state");
    const [editMode, setEditMode] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState (false)

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const dobRef = useRef(null);
    const bioRef = useRef(null);

    useEffect(() => {
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
    }, []);


    function handleSubmit(event) {
        event.preventDefault();
        setLoadingUpdate(true)
        setError(null)
        updateProfile(
            `https://sandbox.academiadevelopers.com/users/profiles/${
                userData.user__id
            }`,
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

    function handleEditMode() {
        setEditMode(!editMode);
    }

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="perfil">
            {userData ? (
                <>
                    <form className= "form" onSubmit={handleSubmit}>
                        <div className="div-perfil" >
                            <div >
                                <figure className="figure">
                                    <img className="image"
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
                                ):(
                                    <p >
                                        {firstNameRef.current?.value || userData.first_name}{" "}
                                        {lastNameRef.current?.value || userData.last_name}
                                    </p>
                                )}
                            </div>
                            <button className="button-perfil" onClick={handleEditMode}
                            >
                                <FaEdit /> {!editMode ? "Modificar" : "Salir"}
                            </button>
                        </div>

                        <div className="content">
                            <div>
                                <label className="label-perfil" > Email:</label>
                                <div>
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
                                    <input
                                        className="input-perfil"
                                        type="textarea"
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
                                        {error
                                            ? "Ocurrió un error al enviar el formulario"
                                            : null}
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