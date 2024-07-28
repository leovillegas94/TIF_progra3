import React, {useState} from "react";
import "../styles/NavBar.css"
import { MdMargin } from "react-icons/md";

export default function NavBar(){
    const [clicked, setClicked] = useState(false)
    const handleClick = () => {
        setClicked(!clicked)
    }

    return (
        <header className="header">
            <div  className="logo">
                <img src="public\Play.png"/>
                <h2 className="name">Harmony Hub</h2>
            </div>
            <nav>
                <ul className="nav-links">
                    <li><a className="a">Canciones</a></li>
                    <li><a className="a">Artistas</a></li>
                    <li><a className="a">Albums</a></li>
                    <li><a className="a">Generos</a></li>
                </ul>
            </nav>
            <a className="button-log"><button>Login</button></a>
        </header>
    );
}