import React from "react";
import PropTypes from "prop-types";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Maximize,
    RotateCw,
} from "react-feather";
import { ControlsContainer } from "../styles/playbackControls.styles";
import { ProgressBar, TimeDisplay } from "../../../styles/common/controls";
import { IconButton } from "../../../components/common";
import { formatTime } from "../../../utils/formatTime";
import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setMode } from "../../../store/slices/playerSlice";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { PLAYER_MODES } from "../constants";

export const PlaybackControls = ({ disabled, onToggleFullscreen }) => {
    const dispatch = useDispatch();
    const { isPlaying, mode, progress, currentTime, duration, currentTrack } =
        useSelector((state) => state.player);
    const { handleProgressChange, handleSkipToStart, handleSkipToEnd } =
        useAudioPlayer();

    const handleTogglePlay = () => {
        if (!currentTrack) return;
        dispatch(setIsPlaying(!isPlaying));
    };

    const handleToggleMode = () => {
        if (!currentTrack) return;
        const modes = [
            PLAYER_MODES.NORMAL,
            PLAYER_MODES.REPEAT,
            PLAYER_MODES.REPEAT_ONE,
            PLAYER_MODES.SHUFFLE,
        ];
        const currentIndex =
            modes.indexOf(mode) !== -1 ? modes.indexOf(mode) : 0;
        const nextIndex = (currentIndex + 1) % modes.length;
        dispatch(setMode(modes[nextIndex]));
    };

    const getRepeatIcon = () => {
        switch (mode) {
            case PLAYER_MODES.REPEAT_ONE:
                return <RotateCw />;
            case PLAYER_MODES.REPEAT:
                return <Repeat />;
            case PLAYER_MODES.SHUFFLE:
                return <Shuffle />;
            default:
                return <Repeat />;
        }
    };

    const getModeTitle = () => {
        switch (mode) {
            case PLAYER_MODES.REPEAT_ONE:
                return "Répéter le morceau";
            case PLAYER_MODES.REPEAT:
                return "Répéter la liste";
            case PLAYER_MODES.SHUFFLE:
                return "Mode aléatoire";
            default:
                return "Mode normal";
        }
    };

    return (
        <ControlsContainer disabled={disabled}>
            <div className="control-buttons">
                <IconButton
                    onClick={handleToggleMode}
                    disabled={disabled}
                    $active={mode !== PLAYER_MODES.NORMAL}
                    title={getModeTitle()}
                >
                    {getRepeatIcon()}
                </IconButton>
                <IconButton
                    onClick={handleSkipToStart}
                    disabled={disabled}
                    title="Précédent"
                >
                    <SkipBack />
                </IconButton>
                <IconButton
                    variant="primary"
                    onClick={handleTogglePlay}
                    disabled={disabled}
                    size="large"
                    title={isPlaying ? "Pause" : "Lecture"}
                >
                    {isPlaying ? <Pause /> : <Play />}
                </IconButton>
                <IconButton
                    onClick={handleSkipToEnd}
                    disabled={disabled}
                    title="Suivant"
                >
                    <SkipForward />
                </IconButton>
                <IconButton
                    onClick={onToggleFullscreen}
                    disabled={disabled}
                    title="Plein écran"
                >
                    <Maximize />
                </IconButton>
            </div>
            <div className="progress-container">
                <ProgressBar
                    type="range"
                    value={Number(progress) || 0}
                    onChange={handleProgressChange}
                    min={0}
                    max={100}
                    disabled={disabled}
                />
                <TimeDisplay>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </TimeDisplay>
            </div>
        </ControlsContainer>
    );
};

PlaybackControls.propTypes = {
    disabled: PropTypes.bool,
    onToggleFullscreen: PropTypes.func.isRequired,
};

export default PlaybackControls;
