import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Volume2, VolumeX } from "react-feather";
import { useTranslation } from "react-i18next";
import { VolumeControlContainer } from "../styles/volumeControl.styles";
import { ProgressBar } from "../../../styles/common/controls";
import { IconButton } from "../../../components/common";

export const VolumeControl = ({
    volume = 1,
    isMuted = false,
    onVolumeChange,
    onToggleMute,
}) => {
    const { t } = useTranslation();
    const [isVolumeOpen, setIsVolumeOpen] = useState(false);
    const volumeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (volumeRef.current && !volumeRef.current.contains(event.target)) {
                setIsVolumeOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleVolumeClick = () => {
        setIsVolumeOpen(!isVolumeOpen);
    };

    return (
        <VolumeControlContainer ref={volumeRef} $isOpen={isVolumeOpen}>
            <IconButton 
                onClick={handleVolumeClick}
                $active={isMuted}
                title={isMuted ? t('player.unmute') : t('player.mute')}
            >
                {isMuted ? <VolumeX /> : <Volume2 />}
            </IconButton>
            <ProgressBar
                className="volume-slider"
                type="range"
                value={Number(volume * 100) || 0}
                onChange={onVolumeChange}
                min={0}
                max={100}
                title={t('player.volume')}
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
