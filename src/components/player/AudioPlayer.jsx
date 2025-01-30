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
    height: 72px;
    background-color: ${({ theme }) => theme.colors.secondary};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 16px;
    display: grid;
    grid-template-columns: 30% 40% 30%;
    align-items: center;
    z-index: 100;
`;

const TrackInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;
    padding-top: 8px;

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
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 12px;
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

    .control-buttons {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 8px;

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 0;
            color: #b3b3b3;
            cursor: pointer;
            width: 32px;
            height: 32px;
            transition: all 0.2s;

            svg {
                width: 20px;
                height: 20px;
            }

            &:hover:not(:disabled) {
                color: #fff;
                transform: scale(1.06);
            }

            &.play-pause {
                background: #fff;
                border-radius: 50%;
                color: #000;
                width: 32px;
                height: 32px;

                svg {
                    width: 14px;
                    height: 14px;
                }

                &:hover:not(:disabled) {
                    transform: scale(1.06);
                    background: #fff;
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
        color: #b3b3b3;
        cursor: pointer;
        width: 32px;
        height: 32px;

        svg {
            width: 20px;
            height: 20px;
        }

        &:hover {
            color: #fff;
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
        background: #fff;
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
            #fff ${(props) => props.value}%,
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
    color: #b3b3b3;
    margin-top: 8px;
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

    const audioRef = useRef(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        if (currentTrack) {
            console.log("Piste actuelle:", {
                id: currentTrack.id,
                title: currentTrack.title,
                artist: currentTrack.artist,
                audioUrl: currentTrack.audioUrl,
            });
        }

        if (audioRef.current && currentTrack?.audioUrl) {
            console.log("Tentative de lecture audio:");
            console.log("URL:", currentTrack.audioUrl);

            // Mettre à jour la source audio
            audioRef.current.src = currentTrack.audioUrl;

            console.log("État initial de l'audio:", {
                currentTime: audioRef.current.currentTime,
                duration: audioRef.current.duration,
                paused: audioRef.current.paused,
                readyState: audioRef.current.readyState,
                networkState: audioRef.current.networkState,
                src: audioRef.current.src,
            });

            audioRef.current.load();

            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log("Lecture démarrée avec succès");
                        })
                        .catch((error) => {
                            console.error("Erreur lors de la lecture:", error);
                            console.log("État de l'audio après erreur:", {
                                currentTime: audioRef.current.currentTime,
                                duration: audioRef.current.duration,
                                paused: audioRef.current.paused,
                                readyState: audioRef.current.readyState,
                                networkState: audioRef.current.networkState,
                                error: audioRef.current.error,
                                src: audioRef.current.src,
                            });
                            dispatch(setIsPlaying(false));
                        });
                }
            }
        } else if (currentTrack && !currentTrack.audioUrl) {
            console.error(
                "Pas d'URL audio disponible pour la piste:",
                currentTrack.title
            );
        }
    }, [currentTrack?.audioUrl, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            const handleError = (e) => {
                console.error("Erreur de l'élément audio:", e);
                console.log("Code d'erreur:", audioRef.current.error?.code);
                console.log(
                    "Message d'erreur:",
                    audioRef.current.error?.message
                );
                console.log("Source audio:", audioRef.current.src);
                console.log("État de l'audio lors de l'erreur:", {
                    readyState: audioRef.current.readyState,
                    networkState: audioRef.current.networkState,
                });
            };

            audioRef.current.addEventListener("error", handleError);
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener("error", handleError);
                }
            };
        }
    }, [audioRef.current]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener("loadedmetadata", () => {
                setDuration(audioRef.current.duration);
            });
        }
    }, [audioRef.current]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
                                width={42}
                                height={42}
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
                        <button disabled={!currentTrack}>
                            <SkipBack />
                        </button>
                        <button
                            className="play-pause"
                            onClick={togglePlay}
                            disabled={!currentTrack}
                        >
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button disabled={!currentTrack}>
                            <SkipForward />
                        </button>
                        <button
                            onClick={toggleFullscreen}
                            disabled={!currentTrack}
                        >
                            <Maximize />
                        </button>
                    </div>
                    <div style={{ width: "100%" }}>
                        <ProgressBar
                            type="range"
                            value={progress}
                            onChange={handleProgressChange}
                            min={0}
                            max={100}
                            style={{ opacity: currentTrack ? 1 : 0.5 }}
                        />
                        <TimeDisplay>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
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
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        min={0}
                        max={100}
                    />
                </VolumeControl>

                <audio
                    ref={audioRef}
                    src={currentTrack?.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                        console.log("Lecture terminée");
                        dispatch(setIsPlaying(false));
                    }}
                    onError={(e) => {
                        console.error("Erreur de lecture audio:", e);
                        if (audioRef.current) {
                            console.log(
                                "Code d'erreur:",
                                audioRef.current.error?.code
                            );
                            console.log(
                                "Message d'erreur:",
                                audioRef.current.error?.message
                            );
                            console.log("Source audio:", audioRef.current.src);
                        }
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
