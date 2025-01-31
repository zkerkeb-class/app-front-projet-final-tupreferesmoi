"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setMode } from "../../store/slices/playerSlice";
import { PlayerContainer } from "./styles/player.styles";
import { TrackInfo } from "./components/TrackInfo";
import { PlaybackControls } from "./components/PlaybackControls";
import { VolumeControl } from "./components/VolumeControl";
import { FullscreenPlayer } from "./components/FullscreenPlayer";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useFullscreenPlayer } from "./hooks/useFullscreenPlayer";
import { PLAYER_MODES } from "./constants";

export default function AudioPlayer() {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying, volume, mode } = useSelector(
        (state) => state.player
    );

    const {
        duration,
        currentTime,
        isMuted,
        handleProgressChange,
        handleVolumeChange,
        toggleMute,
        handleSkipToStart,
        handleSkipToEnd,
    } = useAudioPlayer();

    const { showFullscreen, showControls, handleMouseMove, toggleFullscreen } =
        useFullscreenPlayer();

    const togglePlay = () => dispatch(setIsPlaying(!isPlaying));

    const toggleMode = () => {
        const modes = Object.values(PLAYER_MODES);
        const currentIndex = modes.indexOf(mode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        dispatch(setMode(nextMode));
    };

    const playerProps = {
        isPlaying,
        currentTrack,
        mode,
        progress: (currentTime / duration) * 100,
        currentTime,
        duration,
        onTogglePlay: togglePlay,
        onSkipToStart: handleSkipToStart,
        onSkipToEnd: handleSkipToEnd,
        onToggleMode: toggleMode,
        onToggleFullscreen: toggleFullscreen,
        onProgressChange: handleProgressChange,
    };

    const volumeProps = {
        volume,
        isMuted,
        onVolumeChange: handleVolumeChange,
        onToggleMute: toggleMute,
    };

    return (
        <>
            <PlayerContainer>
                {currentTrack ? (
                    <TrackInfo track={currentTrack} />
                ) : (
                    <div style={{ gridColumn: 1 }} />
                )}
                <PlaybackControls {...playerProps} disabled={!currentTrack} />
                <VolumeControl {...volumeProps} />
            </PlayerContainer>

            {showFullscreen && (
                <FullscreenPlayer
                    currentTrack={currentTrack}
                    showControls={showControls}
                    onMouseMove={handleMouseMove}
                    onToggleFullscreen={toggleFullscreen}
                    playerProps={playerProps}
                    volumeProps={volumeProps}
                />
            )}
        </>
    );
}
