"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Shuffle,
    Maximize,
} from "react-feather";
import {
    setIsPlaying,
    setProgress,
    setVolume,
    setMode,
} from "../../store/slices/playerSlice";

const PlayerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    background-color: ${({ theme }) => theme.colors.secondary};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
`;

const TrackInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const VolumeControl = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
`;

const ProgressBar = styled.input`
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    cursor: pointer;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
        cursor: pointer;
    }
`;

const FullscreenPlayer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.background};
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export default function AudioPlayer() {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying, volume, progress, mode } = useSelector(
        (state) => state.player
    );

    const audioRef = useRef(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            dispatch(
                setProgress(
                    (audioRef.current.currentTime / audioRef.current.duration) *
                        100
                )
            );
        }
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        dispatch(setProgress(e.target.value));
    };

    const togglePlay = () => {
        dispatch(setIsPlaying(!isPlaying));
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value) / 100;
        dispatch(setVolume(newVolume));
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            dispatch(setVolume(1));
            setIsMuted(false);
        } else {
            dispatch(setVolume(0));
            setIsMuted(true);
        }
    };

    const toggleMode = () => {
        const modes = ["normal", "repeat", "shuffle"];
        const currentIndex = modes.indexOf(mode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        dispatch(setMode(nextMode));
    };

    const toggleFullscreen = () => {
        setShowFullscreen(!showFullscreen);
    };

    return (
        <>
            <PlayerContainer>
                <TrackInfo>
                    {currentTrack && (
                        <>
                            <Image
                                src={currentTrack.coverUrl}
                                alt={currentTrack.title}
                                width={56}
                                height={56}
                                style={{ objectFit: "cover" }}
                            />
                            <div>
                                <div>{currentTrack.title}</div>
                                <div>{currentTrack.artist}</div>
                            </div>
                        </>
                    )}
                </TrackInfo>

                <Controls>
                    <div className="control-buttons">
                        <button onClick={toggleMode}>
                            {mode === "shuffle" ? <Shuffle /> : <Repeat />}
                        </button>
                        <button>
                            <SkipBack />
                        </button>
                        <button onClick={togglePlay}>
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button>
                            <SkipForward />
                        </button>
                        <button onClick={toggleFullscreen}>
                            <Maximize />
                        </button>
                    </div>
                    <ProgressBar
                        type="range"
                        value={progress}
                        onChange={handleProgressChange}
                        min={0}
                        max={100}
                    />
                </Controls>

                <VolumeControl>
                    <button onClick={toggleMute}>
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                    <ProgressBar
                        type="range"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        min={0}
                        max={100}
                    />
                </VolumeControl>

                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                        // Logique pour passer à la piste suivante
                    }}
                />
            </PlayerContainer>

            {showFullscreen && (
                <FullscreenPlayer>
                    {/* Interface fullscreen avec visualisation de la waveform */}
                </FullscreenPlayer>
            )}
        </>
    );
}
