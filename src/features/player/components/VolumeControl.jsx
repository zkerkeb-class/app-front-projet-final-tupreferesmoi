import React from "react";
import PropTypes from "prop-types";
import { Volume2, VolumeX } from "react-feather";
import { VolumeControlContainer } from "../styles/volumeControl.styles";
import { ProgressBar } from "../../../styles/common/controls";
import { IconButton } from "../../../components/common";

export const VolumeControl = ({
    volume = 1,
    isMuted = false,
    onVolumeChange,
    onToggleMute,
}) => {
    return (
        <VolumeControlContainer>
            <IconButton onClick={onToggleMute} $active={isMuted}>
                {isMuted ? <VolumeX /> : <Volume2 />}
            </IconButton>
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

VolumeControl.propTypes = {
    volume: PropTypes.number,
    isMuted: PropTypes.bool,
    onVolumeChange: PropTypes.func.isRequired,
    onToggleMute: PropTypes.func.isRequired,
};

export default VolumeControl;
