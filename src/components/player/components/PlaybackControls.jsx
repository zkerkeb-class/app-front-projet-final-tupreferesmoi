import React from "react";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Maximize,
} from "react-feather";
import { ControlsContainer } from "../styles/playbackControls.styles";
import { ProgressBar, TimeDisplay } from "../../../styles/common/controls";

export const PlaybackControls = ({
    isPlaying,
    currentTrack,
    mode,
    progress,
    currentTime,
    duration,
    onTogglePlay,
    onSkipToStart,
    onSkipToEnd,
    onToggleMode,
    onToggleFullscreen,
    onProgressChange,
}) => {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <ControlsContainer disabled={!currentTrack}>
            <div className="control-buttons">
                <button
                    onClick={onToggleMode}
                    disabled={!currentTrack}
                    className={mode === "repeat" ? "active" : ""}
                >
                    {mode === "shuffle" ? <Shuffle /> : <Repeat />}
                </button>
                <button onClick={onSkipToStart} disabled={!currentTrack}>
                    <SkipBack />
                </button>
                <button
                    className="play-pause"
                    onClick={onTogglePlay}
                    disabled={!currentTrack}
                >
                    {isPlaying ? <Pause /> : <Play />}
                </button>
                <button onClick={onSkipToEnd} disabled={!currentTrack}>
                    <SkipForward />
                </button>
                <button onClick={onToggleFullscreen} disabled={!currentTrack}>
                    <Maximize />
                </button>
            </div>
            <div className="progress-container">
                <ProgressBar
                    type="range"
                    value={Number(progress) || 0}
                    onChange={onProgressChange}
                    min={0}
                    max={100}
                    disabled={!currentTrack}
                />
                <TimeDisplay>
                    <span>{formatTime(currentTime || 0)}</span>
                    <span>{formatTime(duration || 0)}</span>
                </TimeDisplay>
            </div>
        </ControlsContainer>
    );
};
