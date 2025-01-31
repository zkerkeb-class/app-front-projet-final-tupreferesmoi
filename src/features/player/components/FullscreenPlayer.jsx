import React from "react";
import Image from "next/image";
import { Minimize } from "react-feather";
import {
    FullscreenContainer,
    MinimizeButton,
} from "../styles/fullscreenPlayer.styles";
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

            <MinimizeButton
                onClick={onToggleFullscreen}
                $visible={showControls}
            >
                <Minimize />
            </MinimizeButton>

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
                    <PlaybackControls {...playerProps} />
                </div>
                <VolumeControl {...volumeProps} />
            </div>
        </FullscreenContainer>
    );
};
