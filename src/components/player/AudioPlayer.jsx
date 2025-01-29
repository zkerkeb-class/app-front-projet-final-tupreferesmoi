"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";

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

export default function AudioPlayer({ track }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);

    return (
        <PlayerContainer>
            <TrackInfo>
                {track && (
                    <>
                        <Image
                            src={track.coverUrl}
                            alt={track.title}
                            width={56}
                            height={56}
                            style={{ objectFit: "cover" }}
                        />
                        <div>
                            <div>{track.title}</div>
                            <div>{track.artist}</div>
                        </div>
                    </>
                )}
            </TrackInfo>
            <Controls>
                <div>
                    <button onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                </div>
                <ProgressBar
                    type="range"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    min={0}
                    max={100}
                />
            </Controls>
            <VolumeControl>
                <ProgressBar
                    type="range"
                    value={volume * 100}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    min={0}
                    max={100}
                />
            </VolumeControl>
        </PlayerContainer>
    );
}
