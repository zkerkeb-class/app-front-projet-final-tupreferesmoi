"use client";

import React, { useState, useEffect } from "react";
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
import { getAudioInstance } from "../../utils/audioInstance";

const PlayerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    background-color: ${({ theme }) => theme.colors.secondary};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 16px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    z-index: 100;
`;

const TrackInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;

    img {
        border-radius: 4px;
    }

    .track-text {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .title {
            color: ${({ theme }) => theme.colors.text};
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 722px;
    width: 100%;
    padding: 0 16px;
    gap: 8px;

    .control-buttons {
        display: flex;
        align-items: center;
        gap: 20px;

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 0;
            color: ${({ theme }) => theme.colors.textSecondary};
            cursor: pointer;
            width: 32px;
            height: 32px;
            transition: all 0.2s;

            svg {
                width: 20px;
                height: 20px;
            }

            &:hover:not(:disabled) {
                color: ${({ theme }) => theme.colors.text};
                transform: scale(1.06);
            }

            &.play-pause {
                background: ${({ theme }) => theme.colors.text};
                border-radius: 50%;
                color: ${({ theme }) => theme.colors.background};
                width: 32px;
                height: 32px;

                svg {
                    width: 14px;
                    height: 14px;
                }

                &:hover:not(:disabled) {
                    transform: scale(1.06);
                }
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
    }
`;

const VolumeControl = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding-right: 32px;

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        padding: 0;
        color: ${({ theme }) => theme.colors.textSecondary};
        cursor: pointer;
        width: 32px;
        height: 32px;

        svg {
            width: 20px;
            height: 20px;
        }

        &:hover {
            color: ${({ theme }) => theme.colors.text};
        }
    }

    .volume-slider {
        width: 93px;
    }
`;

const ProgressBar = styled.input`
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    margin: 0;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.text};
        border-radius: 50%;
        cursor: pointer;
        margin-top: -4px;
        opacity: 0;
        transition: opacity 0.2s;
    }

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 4px;
        background: linear-gradient(
            to right,
            ${({ theme }) => theme.colors.text} ${(props) => props.value}%,
            rgba(255, 255, 255, 0.1) ${(props) => props.value}%
        );
        border-radius: 2px;
        cursor: pointer;
    }

    &:hover {
        &::-webkit-slider-thumb {
            opacity: 1;
        }
    }
`;

const TimeDisplay = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 0 2px;
    user-select: none;
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

    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Initialisation de l'audio
    useEffect(() => {
        const audio = getAudioInstance();
        if (!audio) return;

        audio.volume = volume;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            dispatch(setProgress((audio.currentTime / audio.duration) * 100));
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            dispatch(setIsPlaying(false));
            setCurrentTime(0);
            dispatch(setProgress(0));
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [dispatch, volume]);

    // Gestion du changement de piste
    useEffect(() => {
        const audio = getAudioInstance();
        if (!audio || !currentTrack?.audioUrl) return;

        // Si c'est la même URL, ne rien faire
        if (audio.src === currentTrack.audioUrl) return;

        // Arrêter la lecture en cours
        audio.pause();
        audio.currentTime = 0;

        // Mettre à jour la source audio
        audio.src = currentTrack.audioUrl;
        audio.load();

        // Démarrer la lecture si nécessaire
        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error("Erreur lors de la lecture:", error);
                    dispatch(setIsPlaying(false));
                });
            }
        }
    }, [currentTrack?.audioUrl, isPlaying, dispatch]);

    // Gestion du play/pause
    useEffect(() => {
        const audio = getAudioInstance();
        if (!audio) return;

        if (isPlaying && audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error("Erreur lors de la lecture:", error);
                    dispatch(setIsPlaying(false));
                });
            }
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }, [isPlaying, dispatch]);

    // Gestion du volume
    useEffect(() => {
        const audio = getAudioInstance();
        if (audio) {
            audio.volume = Number(volume) || 0;
        }
    }, [volume]);

    const handleProgressChange = (e) => {
        const audio = getAudioInstance();
        if (!audio) return;

        const value = Number(e.target.value) || 0;
        const newTime = (value / 100) * audio.duration;

        // Mettre à jour la position sans interrompre la lecture
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        dispatch(setProgress(value));
    };

    const togglePlay = () => {
        dispatch(setIsPlaying(!isPlaying));
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value) / 100 || 0;
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleSkipToStart = () => {
        const audio = getAudioInstance();
        if (!audio) return;

        // Mettre à zéro sans interrompre la lecture
        audio.currentTime = 0;
        setCurrentTime(0);
        dispatch(setProgress(0));
    };

    const handleSkipToEnd = () => {
        const audio = getAudioInstance();
        if (!audio) return;

        const newTime =
            duration - currentTime <= 3
                ? duration
                : Math.min(currentTime + 10, duration);

        // Mettre à jour la position sans interrompre la lecture
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        dispatch(setProgress((newTime / duration) * 100));
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
                            <div className="track-text">
                                <div className="title">
                                    {currentTrack.title}
                                </div>
                                <div className="artist">
                                    {currentTrack.artist}
                                </div>
                            </div>
                        </>
                    )}
                </TrackInfo>

                <Controls>
                    <div className="control-buttons">
                        <button onClick={toggleMode} disabled={!currentTrack}>
                            {mode === "shuffle" ? <Shuffle /> : <Repeat />}
                        </button>
                        <button
                            onClick={handleSkipToStart}
                            disabled={!currentTrack}
                        >
                            <SkipBack />
                        </button>
                        <button
                            className="play-pause"
                            onClick={togglePlay}
                            disabled={!currentTrack}
                        >
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button
                            onClick={handleSkipToEnd}
                            disabled={!currentTrack}
                        >
                            <SkipForward />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            disabled={!currentTrack}
                        >
                            <Maximize />
                        </button>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <ProgressBar
                            type="range"
                            value={Number(progress) || 0}
                            onChange={handleProgressChange}
                            min={0}
                            max={100}
                            style={{ opacity: currentTrack ? 1 : 0.5 }}
                        />
                        <TimeDisplay>
                            <span>{formatTime(currentTime || 0)}</span>
                            <span>{formatTime(duration || 0)}</span>
                        </TimeDisplay>
                    </div>
                </Controls>

                <VolumeControl>
                    <button onClick={toggleMute}>
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </button>
                    <ProgressBar
                        className="volume-slider"
                        type="range"
                        value={Number(volume * 100) || 0}
                        onChange={handleVolumeChange}
                        min={0}
                        max={100}
                    />
                </VolumeControl>
            </PlayerContainer>

            {showFullscreen && (
                <FullscreenPlayer>
                    {/* Interface fullscreen avec visualisation de la waveform */}
                </FullscreenPlayer>
            )}
        </>
    );
}
