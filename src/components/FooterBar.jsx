import React from "react";
import "../styles/FooterBar.css"

export default function FooterBar(){
    return (
        <footer className="footer">
            <div>
                <h2 className="redes"> VISITA NUESTRAS REDES
                <img className="icon" src="public\Facebook.png" href="https://facebook.com"></img>
                <img className="icon" src="public\Twitter.png" href="https://twitter.com"></img>
                <img className="icon" src="public\Instagram.png" href="https://instagram.com"></img>
                </h2>
            </div>
        </footer>
    );
}