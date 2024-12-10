import React from "react";
import "../../styles/TopBar.css";

const TopBar = () => {
    return (
        <header className="topbar">
            <div className="navigation-buttons">
                <button className="nav-btn">
                    <span className="icon">◀</span>
                </button>
                <button className="nav-btn">
                    <span className="icon">▶</span>
                </button>
            </div>

            <div className="search-container">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Que souhaitez-vous écouter ou regarder ?"
                        className="search-input"
                    />
                </div>
            </div>

            <div className="user-controls">
                <button className="premium-btn">Découvrir Premium</button>
                <button className="user-menu-btn">
                    <span className="avatar">K</span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
