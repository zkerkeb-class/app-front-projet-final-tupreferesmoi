"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Clock, Trash2, Globe, Lock, Plus, Music } from "react-feather";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying, setQueue, setCurrentTrackIndex } from "@/store/slices/playerSlice";
import playlistApi from "@/services/playlistApi";
import { musicApi } from "../../../services/musicApi";
import { formatTime } from '@/utils/formatTime';
import AddToPlaylistModal from "@/components/common/AddToPlaylistModal";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { useTrackPlayback } from "@/hooks/useTrackPlayback";
import { PlayButton } from "@/components/common/buttons/PlayButton";
import { PlaybackControls } from "@/components/common/buttons/PlaybackControls";

const Container = styled.div`
    padding: 0;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
`;

const PlaylistHeader = styled.div`
    padding: 60px 24px 24px;
    display: flex;
    gap: 24px;
    align-items: flex-end;
    min-height: 340px;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 340px;
        background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.7) 100%);
        pointer-events: none;
    }
`;

const PlaylistCover = styled.div`
    width: 232px;
    height: 232px;
    position: relative;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
    background: ${({ theme }) => theme.colors.surface};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    svg {
        width: 64px;
        height: 64px;
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const PlaylistInfo = styled.div`
    flex: 1;
    z-index: 1;
    position: relative;

    .playlist-type {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        margin-bottom: 8px;
        color: ${({ theme }) => theme.colors.textSecondary};
        display: flex;
        align-items: center;
        gap: 4px;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    h1 {
        font-size: 96px;
        font-weight: 900;
        margin: 0;
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
        line-height: 1;
    }

    .description {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.text};
        margin: 16px 0;
        opacity: 0.7;
    }

    .details {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 24px 0;
        display: flex;
        align-items: center;
        gap: 4px;

        span:not(:last-child)::after {
            content: "•";
            margin: 0 8px;
            opacity: 0.7;
        }

        .username {
            color: ${({ theme }) => theme.colors.text};
            font-weight: 700;

            &:hover {
                text-decoration: underline;
            }
        }
    }
`;

const TracksSection = styled.div`
    padding: 24px;
    position: relative;
    background: linear-gradient(rgba(0, 0, 0, 0.7) 0%, ${({ theme }) => theme.colors.background} 100%);
`;

const TrackList = styled.div`
    margin-top: 16px;
`;

const TrackHeader = styled.div`
    display: grid;
    grid-template-columns: 16px 16px 6fr minmax(120px, 1fr) 40px 40px;
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    gap: 16px;
    align-items: center;

    .duration-header {
        text-align: right;
        margin-right: 8px;
    }
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 16px 16px 6fr minmax(120px, 1fr) 40px 40px;
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

        .title-text {
            display: flex;
            flex-direction: column;

            .title {
                color: ${({ theme }) => theme.colors.text};
                font-size: 16px;
            }

            .artist {
                color: ${({ theme }) => theme.colors.textSecondary};
                font-size: 14px;

                a {
                    color: inherit;
                    text-decoration: none;
                    
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }

    .track-duration {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
        text-align: right;
        margin-right: 8px;
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 24px;
`;

const IconButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    padding: 8px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }

    &.danger:hover {
        color: ${({ theme }) => theme.colors.error};
    }

    svg {
        width: 20px;
        height: 20px;
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

const ActionButton = styled.button`
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
        color: ${({ theme }) => theme.colors.error};
        transform: scale(1.1);
    }

    ${TrackItem}:hover & {
        opacity: 1;
    }
`;

export default function PlaylistPage() {
    const dispatch = useDispatch();
    const [playlist, setPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handlePlay, isCurrentTrack, isPlaying } = useTrackPlayback();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await playlistApi.getPlaylist(params.id);
                setPlaylist(response.data);
                if (response.data.tracks) {
                    setTracks(response.data.tracks);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la playlist:", error);
                setError("Erreur lors de la récupération de la playlist");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleTrackPlay = (track, index) => {
        handlePlay(track, { tracks, index });
    };

    const handleMainPlay = () => {
        if (tracks.length > 0) {
            handleTrackPlay(tracks[0], 0);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette playlist ?")) {
            return;
        }

        try {
            await playlistApi.deletePlaylist(params.id);
            router.push("/playlists");
        } catch (error) {
            console.error("Erreur lors de la suppression de la playlist:", error);
        }
    };

    const toggleVisibility = async () => {
        if (!playlist) return;

        try {
            await playlistApi.updatePlaylist(params.id, {
                isPublic: !playlist.isPublic
            });
            const response = await playlistApi.getPlaylist(params.id);
            setPlaylist(response.data);
        } catch (error) {
            console.error("Erreur lors de la modification de la visibilité:", error);
        }
    };

    const handleRemoveTrack = async (trackId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir retirer ce morceau de la playlist ?")) {
            return;
        }

        try {
            await playlistApi.removeTrackFromPlaylist(params.id, trackId);
            const response = await playlistApi.getPlaylist(params.id);
            setPlaylist(response.data);
            if (response.data.tracks) {
                setTracks(response.data.tracks);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du morceau:", error);
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
                <PlaylistCover>
                    <Music />
                </PlaylistCover>
                <PlaylistInfo>
                    <div className="playlist-type">
                        {playlist?.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                        Playlist
                    </div>
                    <h1>{playlist?.name}</h1>
                    <div className="description">{playlist?.description}</div>
                    <div className="details">
                        <span className="username">
                            {playlist?.userId?.username || "Utilisateur inconnu"}
                        </span>
                        <span>{playlist?.totalTracks} titres</span>
                        <span>{formatTime(playlist?.totalDuration)}</span>
                    </div>
                    <PlaybackControls 
                        onPlay={handleMainPlay}
                        isPlaying={isPlaying && tracks.length > 0 && isCurrentTrack(tracks[0])}
                        hasMultipleTracks={tracks.length > 1}
                    >
                        <IconButton onClick={toggleVisibility}>
                            {playlist?.isPublic ? <Globe /> : <Lock />}
                        </IconButton>
                        <IconButton onClick={handleDeletePlaylist} className="danger">
                            <Trash2 />
                        </IconButton>
                    </PlaybackControls>
                </PlaylistInfo>
            </PlaylistHeader>

            <TracksSection>
                <TrackHeader>
                    <div>#</div>
                    <div></div>
                    <div>TITRE</div>
                    <div className="duration-header">DURÉE</div>
                    <div></div>
                    <div></div>
                </TrackHeader>

                <TrackList>
                    {tracks.map((track, index) => (
                        <TrackItem key={track._id}>
                            <span className="track-number">{index + 1}</span>
                            <div className="track-play">
                                <PlayButton 
                                    onClick={() => handleTrackPlay(track, index)}
                                    isPlaying={isCurrentTrack(track) && isPlaying}
                                    size="small"
                                />
                            </div>
                            <div className="track-title">
                                <div className="title-text">
                                    <span className="title">{track.title}</span>
                                    <span className="artist">
                                        <Link href={`/artists/${track.artistId?._id}`}>
                                            {track.artistId?.name || "Artiste inconnu"}
                                        </Link>
                                    </span>
                                </div>
                            </div>
                            <span className="track-duration">{formatTime(track.duration)}</span>
                            <AddToPlaylistButton
                                onClick={() => {
                                    setSelectedTrackId(track._id);
                                    setIsModalOpen(true);
                                }}
                            >
                                <Plus size={20} />
                            </AddToPlaylistButton>
                            <ActionButton
                                onClick={() => handleRemoveTrack(track._id)}
                                title="Retirer de la playlist"
                            >
                                <Trash2 size={20} />
                            </ActionButton>
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
        </Container>
    );
} 