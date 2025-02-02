"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Clock, Trash2, Globe, Lock } from "react-feather";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "@/store/slices/playerSlice";
import { getAudioInstance } from "@/utils/audioInstance";
import playlistApi from "@/services/playlistApi";
import { formatTime } from '@/utils/formatTime';

const Container = styled.div`
    padding: 60px 24px 24px;
`;

const PlaylistHeader = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    padding: 20px;
`;

const PlaylistInfo = styled.div`
    flex: 1;

    .playlist-type {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 8px;
        color: ${({ theme }) => theme.colors.textSecondary};
    }

    h1 {
        font-size: 72px;
        font-weight: 900;
        margin: 0;
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.1;
    }

    .description {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 16px 0;
    }

    .details {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 8px 0;

        span:not(:last-child)::after {
            content: "•";
            margin: 0 8px;
        }
    }
`;

const TracksSection = styled.div`
    margin-top: 32px;
`;

const TrackList = styled.div`
    margin-top: 16px;
`;

const TrackHeader = styled.div`
    display: grid;
    grid-template-columns: 16px 4fr 3fr 2fr minmax(120px, 1fr);
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 16px 4fr 3fr 2fr minmax(120px, 1fr);
    padding: 8px 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: ${({ theme }) => theme.colors.text};
    }

    .track-number {
        color: inherit;
    }

    .track-title {
        color: ${({ theme }) => theme.colors.text};
        font-weight: 500;
    }

    .track-artist {
        color: inherit;
        text-decoration: none;
        &:hover {
            color: ${({ theme }) => theme.colors.text};
            text-decoration: underline;
        }
    }

    .track-album {
        color: inherit;
        text-decoration: none;
        &:hover {
            color: ${({ theme }) => theme.colors.text};
            text-decoration: underline;
        }
    }
`;

const PlayButton = styled.button`
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    margin-top: 32px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0,0,0,.3);

    &:hover {
        transform: scale(1.06);
        background: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 24px;
`;

const IconButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    &.danger {
        color: ${({ theme }) => theme.colors.error};
        &:hover {
            background: rgba(255, 0, 0, 0.2);
        }
    }
`;

export default function PlaylistPage() {
    const router = useRouter();
    const { id } = useParams();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!id || id === "undefined") {
                    throw new Error("ID de playlist invalide");
                }

                const response = await playlistApi.getPlaylist(id);
                if (!response?.data) {
                    throw new Error("Données de playlist invalides");
                }

                setPlaylist(response.data);
            } catch (error) {
                console.error("Erreur:", error);
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handlePlay = async (track) => {
        if (!track) return;

        const audio = getAudioInstance();
        if (!audio) return;

        // Formater les données de la piste pour le player
        const trackData = {
            ...track,
            artist: track.artistId?.name || "Artiste inconnu",
        };

        if (currentTrack?.id === track.id) {
            if (isPlaying) {
                audio.pause();
            } else {
                await audio.play();
            }
            dispatch(setIsPlaying(!isPlaying));
            return;
        }

        // Nouvelle piste
        audio.src = track.audioUrl;
        dispatch(setCurrentTrack(trackData));
        try {
            await audio.play();
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.error("Erreur lors de la lecture:", error);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette playlist ?")) {
            return;
        }

        try {
            await playlistApi.deletePlaylist(id);
            router.push("/playlists");
        } catch (error) {
            console.error("Erreur lors de la suppression de la playlist:", error);
        }
    };

    const toggleVisibility = async () => {
        if (!playlist) return;

        try {
            setIsUpdating(true);
            await playlistApi.updatePlaylist(id, {
                isPublic: !playlist.isPublic
            });
            const response = await playlistApi.getPlaylist(id);
            setPlaylist(response.data);
        } catch (error) {
            console.error("Erreur lors de la modification de la visibilité:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <Container>Chargement...</Container>;
    }

    if (error) {
        return (
            <Container>
                <h2>Erreur</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/")}>
                    Retour à l&apos;accueil
                </button>
            </Container>
        );
    }

    if (!playlist) {
        return (
            <Container>
                <h2>Erreur</h2>
                <p>Playlist introuvable</p>
                <button onClick={() => router.push("/")}>
                    Retour à l&apos;accueil
                </button>
            </Container>
        );
    }

    return (
        <Container>
            <PlaylistHeader>
                <PlaylistInfo>
                    <div className="playlist-type">Playlist {playlist.isPublic ? "publique" : "privée"}</div>
                    <h1>{playlist.name}</h1>
                    {playlist.description && (
                        <div className="description">{playlist.description}</div>
                    )}
                    <div className="details">
                        <span>Créée par {playlist.userId?.username || "Utilisateur inconnu"}</span>
                        <span>{playlist.tracks?.length || 0} titres</span>
                        <span>{formatTime(playlist.tracks?.reduce((acc, track) => acc + track.duration, 0) || 0)}</span>
                    </div>
                    <ControlsContainer>
                        {playlist.tracks?.length > 0 && (
                            <PlayButton onClick={() => handlePlay(playlist.tracks[0])}>
                                {currentTrack?.id === playlist.tracks[0].id && isPlaying ? (
                                    <Pause size={24} />
                                ) : (
                                    <Play size={24} />
                                )}
                            </PlayButton>
                        )}
                        <IconButton onClick={toggleVisibility} disabled={isUpdating}>
                            {playlist.isPublic ? (
                                <>
                                    <Globe size={16} />
                                    Rendre privée
                                </>
                            ) : (
                                <>
                                    <Lock size={16} />
                                    Rendre publique
                                </>
                            )}
                        </IconButton>
                        <IconButton onClick={handleDeletePlaylist} className="danger">
                            <Trash2 size={16} />
                            Supprimer la playlist
                        </IconButton>
                    </ControlsContainer>
                </PlaylistInfo>
            </PlaylistHeader>

            <TracksSection>
                <TrackHeader>
                    <div>#</div>
                    <div>Titre</div>
                    <div>Album</div>
                    <div>Artiste</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Clock size={16} />
                    </div>
                </TrackHeader>
                <TrackList>
                    {playlist.tracks?.map((track, index) => (
                        <TrackItem
                            key={track._id}
                            onClick={() => handlePlay(track)}
                        >
                            <div className="track-number">{index + 1}</div>
                            <div className="track-title">{track.title}</div>
                            <Link
                                href={`/albums/${track.albumId?._id}`}
                                className="track-album"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {track.albumId?.title || "Album inconnu"}
                            </Link>
                            <Link
                                href={`/artists/${track.artistId?._id}`}
                                className="track-artist"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {track.artistId?.name || "Artiste inconnu"}
                            </Link>
                            <div>{formatTime(track.duration)}</div>
                        </TrackItem>
                    ))}
                </TrackList>
            </TracksSection>
        </Container>
    );
} 