"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import {
    setCurrentTrack,
    setIsPlaying,
} from "../../../store/slices/playerSlice";
import Image from "next/image";

const ArtistHeader = styled.div`
    padding: 60px 24px 24px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    gap: 24px;
    align-items: flex-end;
`;

const ArtistImage = styled.div`
    width: 232px;
    height: 232px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
`;

const ArtistInfo = styled.div`
    flex: 1;

    h1 {
        font-size: 96px;
        font-weight: 900;
        margin: 0;
        padding: 0;
    }

    p {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 8px 0;
    }
`;

const TracksSection = styled.div`
    padding: 24px;
`;

const TrackList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 16px 16px 6fr 4fr 3fr minmax(120px, 1fr);
    padding: 8px;
    border-radius: 4px;
    align-items: center;
    gap: 16px;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .track-number {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
    }

    .track-play {
        opacity: 0;
    }

    &:hover .track-number {
        opacity: 0;
    }

    &:hover .track-play {
        opacity: 1;
    }

    .track-title {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
        }

        .title-text {
            display: flex;
            flex-direction: column;

            span {
                &:first-child {
                    color: ${({ theme }) => theme.colors.text};
                    font-size: 16px;
                }

                &:last-child {
                    color: ${({ theme }) => theme.colors.textSecondary};
                    font-size: 14px;
                }
            }
        }
    }

    .track-album {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
    }

    .track-duration {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
        text-align: right;
    }
`;

const PlayButton = styled.button`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
        transform: scale(1.1);
    }
`;

export default function ArtistPage({ params }) {
    const [artist, setArtist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/artists/${params.id}`
                );
                const data = await response.json();
                setArtist(data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération de l'artiste:",
                    error
                );
            }
        };

        const fetchTracks = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/tracks/artist/${params.id}`
                );
                const data = await response.json();
                setTracks(data);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des pistes:",
                    error
                );
            }
        };

        fetchArtist();
        fetchTracks();
    }, [params.id]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handlePlayTrack = (track) => {
        if (currentTrack?.id === track.id) {
            dispatch(setIsPlaying(!isPlaying));
        } else {
            dispatch(setCurrentTrack(track));
            dispatch(setIsPlaying(true));
        }
    };

    if (!artist) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <ArtistHeader>
                <ArtistImage>
                    <Image
                        src={artist.image?.large || "/default-artist.png"}
                        alt={artist.name}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </ArtistImage>
                <ArtistInfo>
                    <p>Artiste vérifié</p>
                    <h1>{artist.name}</h1>
                    <p>{tracks.length} titres</p>
                </ArtistInfo>
            </ArtistHeader>

            <TracksSection>
                <TrackList>
                    {tracks.map((track, index) => (
                        <TrackItem key={track.id}>
                            <span className="track-number">{index + 1}</span>
                            <div className="track-play">
                                <PlayButton
                                    onClick={() => handlePlayTrack(track)}
                                >
                                    {currentTrack?.id === track.id &&
                                    isPlaying ? (
                                        <Pause size={16} />
                                    ) : (
                                        <Play size={16} />
                                    )}
                                </PlayButton>
                            </div>
                            <div className="track-title">
                                <Image
                                    src={
                                        track.album?.coverImage?.thumbnail ||
                                        "/default-album.png"
                                    }
                                    alt={track.title}
                                    width={40}
                                    height={40}
                                />
                                <div className="title-text">
                                    <span>{track.title}</span>
                                    <span>
                                        {track.featuring?.length > 0
                                            ? `feat. ${track.featuring.map((f) => f.name).join(", ")}`
                                            : ""}
                                    </span>
                                </div>
                            </div>
                            <div className="track-album">
                                {track.album?.title}
                            </div>
                            <div className="track-duration">
                                {formatDuration(track.duration)}
                            </div>
                        </TrackItem>
                    ))}
                </TrackList>
            </TracksSection>
        </div>
    );
}
