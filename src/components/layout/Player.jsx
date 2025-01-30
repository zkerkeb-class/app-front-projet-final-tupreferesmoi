"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Shuffle,
} from "react-feather";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { setIsPlaying, setProgress } from "../../store/slices/playerSlice";

const PlayerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    background: ${({ theme }) => theme.colors.secondary};
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
`;

const TrackImage = styled.div`
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 4px;
    overflow: hidden;
`;

const TrackMeta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TrackTitle = styled.div`
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    font-weight: 500;
`;

const TrackArtist = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
`;

const Controls = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const ControlButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const PlayButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.text};
    border: none;
    color: ${({ theme }) => theme.colors.background};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const ControlButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Progress = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar = styled.input`
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: pointer;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.text};
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    &:hover::-webkit-slider-thumb {
        opacity: 1;
    }
`;

const VolumeControl = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
`;

const VolumeSlider = styled.input`
    width: 100px;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: pointer;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.text};
        border-radius: 50%;
        cursor: pointer;
    }
`;

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function Player() {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.src = currentTrack.audioUrl;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const togglePlay = () => {
        if (currentTrack) {
            dispatch(setIsPlaying(!isPlaying));
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            dispatch(
                setProgress(
                    audioRef.current.currentTime / audioRef.current.duration
                )
            );
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleProgressChange = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value;
        }
        if (value === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    if (!currentTrack) {
        return null;
    }

    return (
        <PlayerContainer>
            <TrackInfo>
                <TrackImage>
                    <Image
                        src={currentTrack.imageUrl}
                        alt={currentTrack.title}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </TrackImage>
                <TrackMeta>
                    <TrackTitle>{currentTrack.title}</TrackTitle>
                    <TrackArtist>{currentTrack.artist}</TrackArtist>
                </TrackMeta>
            </TrackInfo>

            <Controls>
                <ControlButtons>
                    <ControlButton>
                        <Shuffle size={20} />
                    </ControlButton>
                    <ControlButton>
                        <SkipBack size={20} />
                    </ControlButton>
                    <PlayButton onClick={togglePlay}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </PlayButton>
                    <ControlButton>
                        <SkipForward size={20} />
                    </ControlButton>
                    <ControlButton>
                        <Repeat size={20} />
                    </ControlButton>
                </ControlButtons>

                <Progress>
                    <span>{formatTime(currentTime)}</span>
                    <ProgressBar
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleProgressChange}
                    />
                    <span>{formatTime(duration)}</span>
                </Progress>
            </Controls>

            <VolumeControl>
                <ControlButton onClick={toggleMute}>
                    {isMuted || volume === 0 ? (
                        <VolumeX size={20} />
                    ) : (
                        <Volume2 size={20} />
                    )}
                </ControlButton>
                <VolumeSlider
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                />
            </VolumeControl>

            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => dispatch(setIsPlaying(false))}
            />
        </PlayerContainer>
    );
}
