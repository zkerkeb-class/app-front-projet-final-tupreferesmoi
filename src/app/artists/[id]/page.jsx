"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause } from "react-feather";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { musicApi } from "../../../services/musicApi";
import { useTrackPlayer } from "../../../hooks/useTrackPlayer";

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

const DEFAULT_IMAGE =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyQTJBMkEiLz48cGF0aCBkPSJNOTAgODBIMTEwQzExNS41MjMgODAgMTIwIDg0LjQ3NzIgMTIwIDkwVjExMEMxMjAgMTE1LjUyMyAxMTUuNTIzIDEyMCAxMTAgMTIwSDkwQzg0LjQ3NzIgMTIwIDgwIDExNS41MjMgODAgMTEwVjkwQzgwIDg0LjQ3NzIgODQuNDc3MiA4MCA5MCA4MFoiIGZpbGw9IiM0MDQwNDAiLz48cGF0aCBkPSJNMTAwIDg1QzEwMi43NjEgODUgMTA1IDg3LjIzODYgMTA1IDkwQzEwNSA5Mi43NjE0IDEwMi43NjEgOTUgMTAwIDk1Qzk3LjIzODYgOTUgOTUgOTIuNzYxNCA5NSA5MEM5NSA4Ny4yMzg2IDk3LjIzODYgODUgMTAwIDg1WiIgZmlsbD0iIzU5NTk1OSIvPjwvc3ZnPg==";

export default function ArtistPage({ params }) {
    const [artist, setArtist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { currentTrack, isPlaying, handlePlayTrack } = useTrackPlayer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!params?.id || params.id === "undefined") {
                    throw new Error("ID d'artiste invalide");
                }

                // Récupération de l'artiste
                const artistResponse = await musicApi.getArtist(params.id);
                if (!artistResponse?.data) {
                    throw new Error("Données d'artiste invalides");
                }

                setArtist(artistResponse.data);

                // Récupération des pistes
                try {
                    const tracksResponse = await musicApi.getArtistTracks(
                        params.id
                    );
                    if (Array.isArray(tracksResponse?.data)) {
                        // Formater les pistes pour correspondre au format attendu par le player
                        const formattedTracks = tracksResponse.data.map(
                            (track) => ({
                                id: track._id || track.id,
                                title: track.title || "Titre inconnu",
                                artist:
                                    track.artist ||
                                    artistResponse.data?.name ||
                                    "Artiste inconnu",
                                album: track.album || "Album inconnu",
                                coverUrl: track.coverUrl || DEFAULT_IMAGE,
                                duration: track.duration || 0,
                                audioUrl: track.audioUrl || null,
                            })
                        );
                        setTracks(formattedTracks);
                    } else {
                        setTracks([]);
                    }
                } catch (trackError) {
                    console.error(
                        "Erreur lors de la récupération des pistes:",
                        trackError
                    );
                    setTracks([]);
                }
            } catch (error) {
                console.error("Erreur:", error);
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id, artist?.name]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleTrackPlay = (track) => {
        if (!track.id) {
            console.error("ID de piste manquant");
            return;
        }

        handlePlayTrack(track);
    };

    if (loading) {
        return <div style={{ padding: "24px" }}>Chargement...</div>;
    }

    if (error) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>Erreur</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/artists")}>
                    Retour à la liste des artistes
                </button>
            </div>
        );
    }

    if (!artist) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>Erreur</h2>
                <p>Aucune piste trouvée pour cet artiste</p>
                <button onClick={() => router.push("/artists")}>
                    Retour à la liste des artistes
                </button>
            </div>
        );
    }

    return (
        <div>
            <ArtistHeader>
                <ArtistImage>
                    {(artist.imageUrl || artist.image || DEFAULT_IMAGE) && (
                        <Image
                            src={
                                artist.imageUrl || artist.image || DEFAULT_IMAGE
                            }
                            alt={artist.name || "Artiste"}
                            fill
                            style={{ objectFit: "cover" }}
                            priority
                            unoptimized
                        />
                    )}
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
                        <TrackItem key={track.id || index}>
                            <span className="track-number">{index + 1}</span>
                            <div className="track-play">
                                <PlayButton
                                    onClick={() => handleTrackPlay(track)}
                                    disabled={!track.id}
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
                                {(track.coverUrl || DEFAULT_IMAGE) && (
                                    <Image
                                        src={track.coverUrl || DEFAULT_IMAGE}
                                        alt={track.title || "Titre"}
                                        width={40}
                                        height={40}
                                        unoptimized
                                    />
                                )}
                                <div className="title-text">
                                    <span>{track.title}</span>
                                    <span>{track.artist}</span>
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
