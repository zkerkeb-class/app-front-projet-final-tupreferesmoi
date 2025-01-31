import React from "react";
import { ControlsContainer } from "./styles/playbackControls.styles";

const PlaybackControls = ({ disabled }) => {
    return (
        <ControlsContainer disabled={disabled}>
            {disabled && <span style={{ color: "white" }}>test</span>}
            <div className="control-buttons">{/* Existing buttons */}</div>
            <div className="progress-container">
                {/* Existing progress bar */}
            </div>
        </ControlsContainer>
    );
};

export default PlaybackControls;
