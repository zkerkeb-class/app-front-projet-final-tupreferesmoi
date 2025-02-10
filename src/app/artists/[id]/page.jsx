"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Plus } from "react-feather";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { musicApi } from "../../../services/musicApi";
import { useDispatch, useSelector } from "react-redux";
import {
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    setCurrentTrackIndex,
} from "../../../store/slices/playerSlice";
import Link from "next/link";
import AddToPlaylistModal from "@/components/common/AddToPlaylistModal";
import { PlayButton } from "@/components/common/buttons/PlayButton";
import { useTrackPlayback } from "@/hooks/useTrackPlayback";

const ArtistHeader = styled.div`
    padding: 60px 24px 24px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 340px;
`;

const ArtistInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    h1 {
        font-size: 96px;
        font-weight: 900;
        margin: 0;
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
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
    grid-template-columns: 16px 16px 6fr minmax(120px, 1fr) 40px;
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

const AddToPlaylistButton = styled.button`
    opacity: 0;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
        transform: scale(1.1);
    }

    ${TrackItem}:hover & {
        opacity: 1;
    }
`;

const DEFAULT_IMAGE = "/default-album.png";

export default function ArtistPage({ params }) {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [artist, setArtist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handlePlay, isCurrentTrack, isPlaying: useTrackPlaybackPlaying } = useTrackPlayback();

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
                                album:
                                    track.album?.title ||
                                    track.album ||
                                    "Album inconnu",
                                coverUrl:
                                    track.album?.coverImage?.thumbnail ||
                                    track.coverUrl ||
                                    DEFAULT_IMAGE,
                                duration: parseInt(track.duration) || 0,
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
    }, [params?.id]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleTrackPlay = (track, index) => {
        handlePlay(track, { tracks, index });
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
        <>
            <ArtistHeader>
                <ArtistInfo>
                    <p>Artiste vérifié</p>
                    <h1>{artist.name}</h1>
                    <p>{tracks.length} titres</p>
                </ArtistInfo>
            </ArtistHeader>

            <TracksSection>
                <h2>Titres populaires</h2>
                <TrackList>
                    {tracks.map((track, index) => (
                        <TrackItem key={track._id || track.id}>
                            <span className="track-number">{index + 1}</span>
                            <div className="track-play">
                                <PlayButton 
                                    onClick={() => handleTrackPlay(track, index)}
                                    isPlaying={isCurrentTrack(track) && useTrackPlaybackPlaying}
                                    size="small"
                                />
                            </div>
                            <div className="track-title">
                                <div className="title-text">
                                    <span className="title">{track.title}</span>
                                    <span className="artist">
                                        <Link href={`/albums/${track.albumId?._id || track.album?._id}`}>
                                            {track.albumId?.title || track.album?.title}
                                        </Link>
                                    </span>
                                </div>
                            </div>
                            <span className="track-duration">
                                {formatDuration(track.duration)}
                            </span>
                            <AddToPlaylistButton
                                onClick={() => {
                                    setSelectedTrackId(track._id || track.id);
                                    setIsModalOpen(true);
                                }}
                            >
                                <Plus size={20} />
                            </AddToPlaylistButton>
                        </TrackItem>
                    ))}
                </TrackList>
            </TracksSection>

            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTrackId(null);
                }}
                trackId={selectedTrackId}
            />
        </>
    );
}

