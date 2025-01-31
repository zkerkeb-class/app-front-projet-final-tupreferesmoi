import React from "react";
import { Volume2, VolumeX } from "react-feather";
import { VolumeControlContainer } from "../styles/volumeControl.styles";
import { ProgressBar } from "../../../styles/common/controls";

export const VolumeControl = ({
    volume,
    isMuted,
    onVolumeChange,
    onToggleMute,
}) => {
    return (
        <VolumeControlContainer>
            <button onClick={onToggleMute}>
                {isMuted ? <VolumeX /> : <Volume2 />}
            </button>
            <ProgressBar
                className="volume-slider"
                type="range"
                value={Number(volume * 100) || 0}
                onChange={onVolumeChange}
                min={0}
                max={100}
            />
        </VolumeControlContainer>
    );
};
