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
    Minimize,
} from "react-feather";
import {
    setIsPlaying,
    setProgress,
    setVolume,
    setMode,
    playNext,
    playPrevious,
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

            &.active {
                color: ${({ theme }) => theme.colors.primary};
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

    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        filter: blur(30px);
        opacity: 0.3;
        object-fit: cover;
    }

    .main-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        width: 100%;
        max-width: 1200px;
        padding: 0 48px;

        .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            text-align: center;

            img {
                width: 300px;
                height: 300px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                border-radius: 4px;
            }

            .track-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 32px;

                .title {
                    font-size: 28px;
                    font-weight: 700;
                    color: ${({ theme }) => theme.colors.text};
                }

                .artist {
                    font-size: 16px;
                    color: ${({ theme }) => theme.colors.textSecondary};
                }
            }
        }
    }

    .player-section {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 64px;

        .controls-wrapper {
            width: 100%;
            max-width: 1000px;
            padding: 0 48px;
            opacity: ${({ $showControls }) => ($showControls ? 1 : 0)};
            transition: opacity 0.3s ease;
        }
    }
`;

const FullscreenControls = styled(Controls)`
    width: 100%;
    max-width: 1000px;
    padding: 0;
    margin: 0 auto;

    .control-buttons {
        gap: 32px;
        margin-bottom: 32px;
        justify-content: center;

        button {
            width: 40px;
            height: 40px;

            svg {
                width: 24px;
                height: 24px;
            }

            &.play-pause {
                width: 48px;
                height: 48px;

                svg {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

    ${ProgressBar} {
        height: 6px;

        &::-webkit-slider-thumb {
            width: 16px;
            height: 16px;
            margin-top: -5px;
        }
    }

    ${TimeDisplay} {
        font-size: 14px;
        padding: 4px 16px;
    }
`;

const FullscreenVolumeControl = styled(VolumeControl)`
    position: absolute;
    bottom: 16px;
    right: 32px;
    padding-right: 0;
    opacity: ${({ $showControls }) => ($showControls ? 1 : 0)};
    transition: opacity 0.3s ease;

    .volume-slider {
        width: 120px;
    }

    button {
        width: 40px;
        height: 40px;

        svg {
            width: 24px;
            height: 24px;
        }
    }
`;

const MinimizeButton = styled.button`
    position: fixed;
    top: 24px;
    right: 24px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.3s ease;
    z-index: 2;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const DEFAULT_IMAGE = "/default-album.png";

export default function AudioPlayer() {
    const dispatch = useDispatch();
    const {
        currentTrack,
        isPlaying,
        volume,
        progress,
        mode,
        queue,
        currentTrackIndex,
    } = useSelector((state) => state.player);

    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [mouseTimeout, setMouseTimeout] = useState(null);

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
            if (mode === "repeat") {
                audio.currentTime = 0;
                audio.play();
            } else if (
                queue.length > 0 &&
                currentTrackIndex < queue.length - 1
            ) {
                dispatch(playNext());
            } else {
                dispatch(setIsPlaying(false));
                setCurrentTime(0);
                dispatch(setProgress(0));
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [dispatch, volume, mode, queue, currentTrackIndex]);

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

        if (currentTime <= 3) {
            // Si on est dans les 3 premières secondes et qu'il y a une piste précédente
            if (currentTrackIndex > 0) {
                dispatch(playPrevious());
            } else {
                // Sinon, on revient au début de la piste actuelle
                audio.currentTime = 0;
                setCurrentTime(0);
                dispatch(setProgress(0));
            }
        } else {
            // Si on est après les 3 premières secondes, on revient au début de la piste actuelle
            audio.currentTime = 0;
            setCurrentTime(0);
            dispatch(setProgress(0));
        }
    };

    const handleSkipToEnd = () => {
        const audio = getAudioInstance();
        if (!audio) return;

        if (duration - currentTime <= 3) {
            // Si on est dans les 3 dernières secondes et qu'il y a une piste suivante
            if (currentTrackIndex < queue.length - 1) {
                dispatch(playNext());
            }
        } else {
            // Sinon, on avance de 10 secondes
            const newTime = Math.min(currentTime + 10, duration);
            audio.currentTime = newTime;
            setCurrentTime(newTime);
            dispatch(setProgress((newTime / duration) * 100));
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        document.body.style.cursor = "default";

        // Réinitialiser le timeout précédent
        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }

        // Définir un nouveau timeout
        const timeout = setTimeout(() => {
            if (showFullscreen) {
                setShowControls(false);
                document.body.style.cursor = "none";
            }
        }, 3000);

        setMouseTimeout(timeout);
    };

    useEffect(() => {
        // Nettoyer le timeout lors du démontage
        return () => {
            if (mouseTimeout) {
                clearTimeout(mouseTimeout);
            }
            document.body.style.cursor = "default";
        };
    }, [mouseTimeout]);

    // Ajouter l'effet pour gérer la touche Échap
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && showFullscreen) {
                setShowFullscreen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showFullscreen]);

    return (
        <>
            <PlayerContainer>
                <TrackInfo>
                    {currentTrack && (
                        <>
                            <Image
                                src={currentTrack.coverUrl || DEFAULT_IMAGE}
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
                        <button
                            onClick={toggleMode}
                            disabled={!currentTrack}
                            className={mode === "repeat" ? "active" : ""}
                        >
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
                <FullscreenPlayer
                    onMouseMove={handleMouseMove}
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
                        onClick={toggleFullscreen}
                        $visible={showControls}
                    >
                        <Minimize />
                    </MinimizeButton>

                    <div className="main-content">
                        <div className="content">
                            <Image
                                src={currentTrack?.coverUrl || DEFAULT_IMAGE}
                                alt={currentTrack?.title}
                                width={400}
                                height={400}
                                priority
                            />
                            <div className="track-info">
                                <div className="title">
                                    {currentTrack?.title}
                                </div>
                                <div className="artist">
                                    {currentTrack?.artist}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="player-section">
                        <div className="controls-wrapper">
                            <FullscreenControls>
                                <div className="control-buttons">
                                    <button
                                        onClick={toggleMode}
                                        disabled={!currentTrack}
                                        className={
                                            mode === "repeat" ? "active" : ""
                                        }
                                    >
                                        {mode === "shuffle" ? (
                                            <Shuffle />
                                        ) : (
                                            <Repeat />
                                        )}
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
                                </div>
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <ProgressBar
                                        type="range"
                                        value={Number(progress) || 0}
                                        onChange={handleProgressChange}
                                        min={0}
                                        max={100}
                                        style={{
                                            opacity: currentTrack ? 1 : 0.5,
                                        }}
                                    />
                                    <TimeDisplay>
                                        <span>
                                            {formatTime(currentTime || 0)}
                                        </span>
                                        <span>{formatTime(duration || 0)}</span>
                                    </TimeDisplay>
                                </div>
                            </FullscreenControls>
                        </div>

                        <FullscreenVolumeControl $showControls={showControls}>
                            <button onClick={toggleMute}>
                                {isMuted ? (
                                    <VolumeX size={24} />
                                ) : (
                                    <Volume2 size={24} />
                                )}
                            </button>
                            <ProgressBar
                                className="volume-slider"
                                type="range"
                                value={Number(volume * 100) || 0}
                                onChange={handleVolumeChange}
                                min={0}
                                max={100}
                            />
                        </FullscreenVolumeControl>
                    </div>
                </FullscreenPlayer>
            )}
        </>
    );
}
