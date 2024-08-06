import { useState, useEffect , useContext} from "react";
import { useAuth, AuthContext } from "./Contexts/AuthContext";
import FotoPerfil from "../assets/Profile.jpg"


function Perfil() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    /* const context = useContext(AuthContext);
    const {token} = context.state;
    console.log(context.state);
 */

    
    const {token} = useAuth("state");
    //console.log(token);
 
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

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {userData ? (
                <>
                    <form >
                        <div >
                            <div >
                                <figure className="image is-48x48">
                                    <img
                                        src={
                                            userData.image ||
                                            FotoPerfil
                                        }
                                        alt="Profile image"
                                        
                                    />
                                </figure>
                            </div>
                            <div className="media-content">
                                <p className="title is-4 pb-2">
                                    {userData.first_name} {userData.last_name}
                                </p>
                            </div>
                        </div>

                        <div className="content">
                            Email: {userData.email}
                            <br />
                            Fecha de Nacimiento: {userData.dob}
                            <br />
                            Biografía: {userData.bio || "No disponible"}
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