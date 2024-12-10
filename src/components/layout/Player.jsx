import React from "react";
import "../../styles/Player.css";

const Player = () => {
    return (
        <div className="player">
            <div className="now-playing">
                <img
                    src="https://via.placeholder.com/300"
                    alt="Album cover"
                    className="track-image"
                />
                <div className="track-info">
                    <div className="track-name">Nom de la piste</div>
                    <div className="artist-name">Nom de l&apos;artiste</div>
                </div>
                <button className="like-button">
                    <span className="icon">♡</span>
                </button>
            </div>

            <div className="player-controls">
                <div className="control-buttons">
                    <button className="control-btn">🔀</button>
                    <button className="control-btn">⏮</button>
                    <button className="play-pause-btn">▶</button>
                    <button className="control-btn">⏭</button>
                    <button className="control-btn">🔁</button>
                </div>
                <div className="progress-bar">
                    <span className="time-elapsed">0:00</span>
                    <div className="progress-bar-container">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fg"
                                style={{ width: "30%" }}
                            ></div>
                        </div>
                    </div>
                    <span className="time-total">3:45</span>
                </div>
            </div>

            <div className="player-options">
                <button className="option-btn">📜</button>
                <button className="option-btn">🔊</button>
                <div className="volume-control">
                    <div className="volume-bar">
                        <div
                            className="volume-level"
                            style={{ width: "70%" }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
