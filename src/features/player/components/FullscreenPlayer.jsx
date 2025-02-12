import React from "react";
import Image from "next/image";
import { FullscreenContainer } from "../styles/fullscreenPlayer.styles";
import { PlaybackControls } from "./PlaybackControls";
import { VolumeControl } from "./VolumeControl";
import { DEFAULT_IMAGE } from "../constants";

export const FullscreenPlayer = ({
    currentTrack,
    showControls,
    onMouseMove,
    onToggleFullscreen,
    playerProps,
    volumeProps,
}) => {
    // On passe la fonction onToggleFullscreen aux contrôles
    const playerPropsWithFullscreen = {
        ...playerProps,
        onToggleFullscreen,
        isFullscreen: true // Pour indiquer qu'on est en mode plein écran
    };

    return (
        <FullscreenContainer
            onMouseMove={onMouseMove}
            $showControls={showControls}
        >
            <Image
                className="background-image"
                src={currentTrack?.coverUrl || DEFAULT_IMAGE}
                alt=""
                fill
                priority
            />

            <div className="main-content">
                <div className="content">
                    <Image
                        src={currentTrack?.coverUrl || DEFAULT_IMAGE}
                        alt={currentTrack?.title}
                        width={300}
                        height={300}
                        priority
                    />
                    <div className="track-info">
                        <div className="title">{currentTrack?.title}</div>
                        <div className="artist">{currentTrack?.artist}</div>
                    </div>
                </div>
            </div>

            <div className="player-section">
                <div className="controls-wrapper">
                    <PlaybackControls {...playerPropsWithFullscreen} />
                </div>
                <VolumeControl {...volumeProps} />
            </div>
        </FullscreenContainer>
    );
};
