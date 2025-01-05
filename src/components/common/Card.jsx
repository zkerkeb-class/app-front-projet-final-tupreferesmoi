import React from "react";
import "../../styles/Card.css";

const Card = ({ image, title, description }) => {
    return (
        <div className="card">
            <div className="card-image-container">
                <img src={image} alt={title} className="card-image" />
                <button className="play-button">
                    <span className="play-icon">▶</span>
                </button>
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );
};

export default Card;
