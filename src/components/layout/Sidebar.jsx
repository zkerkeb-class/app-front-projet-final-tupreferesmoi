import React from "react";
import "../../styles/Sidebar.css";
import spotifyLogo from "../../assets/spotify-logo.png";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <img src={spotifyLogo} alt="Spotify" />
                <h1 className="logo-text">Spotify</h1>
            </div>

            <nav className="main-nav">
                <ul>
                    <li className="nav-item active">
                        <span className="icon">🏠</span>
                        <span>Accueil</span>
                    </li>
                    <li className="nav-item">
                        <span className="icon">🔍</span>
                        <span>Rechercher</span>
                    </li>
                    <li className="nav-item">
                        <span className="icon">📚</span>
                        <span>Bibliothèque</span>
                    </li>
                </ul>
            </nav>

            <div className="playlist-section">
                <button className="create-playlist-btn">
                    <span className="icon">➕</span>
                    <span>Créer une playlist</span>
                </button>

                <div className="liked-songs">
                    <span className="icon">💜</span>
                    <span>Titres likés</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
