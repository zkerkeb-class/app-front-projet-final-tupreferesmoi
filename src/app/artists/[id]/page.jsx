"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Plus, ArrowLeft } from "react-feather";
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
import { PlaybackControls } from "@/components/common/buttons/PlaybackControls";
import { useTranslation } from "react-i18next";
import authService from "@/services/authService";

const BackButton = styled.button`
    position: absolute;
    top: 16px;
    left: 24px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s ease;
    z-index: 2;

    @media (max-width: 768px) {
        display: flex;
        top: 12px;
        left: 16px;
    }

    &:hover {
        transform: scale(1.1);
        background: rgba(0, 0, 0, 0.9);
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const ArtistHeader = styled.div`
    padding: 60px 24px 24px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 340px;
    position: relative;

    @media (max-width: 768px) {
        padding: 40px 16px 16px;
        min-height: 280px;
    }
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

        @media (max-width: 1200px) {
            font-size: 72px;
        }

        @media (max-width: 900px) {
            font-size: 56px;
        }

        @media (max-width: 680px) {
            font-size: 42px;
        }

        @media (max-width: 400px) {
            font-size: 32px;
        }
    }

    p {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 8px 0;

        @media (max-width: 680px) {
            font-size: 13px;
        }
    }
`;

const TracksSection = styled.div`
    padding: 24px;
    margin-top: 16px;
    background: linear-gradient(rgba(0, 0, 0, 0.3) 0%, ${({ theme }) => theme.colors.background} 100%);

    h2 {
        font-size: 24px;
        margin-bottom: 16px;

        @media (max-width: 768px) {
            font-size: 20px;
        }

        @media (max-width: 480px) {
            font-size: 18px;
        }
    }

    @media (max-width: 768px) {
        padding: 16px;
        margin-top: 8px;
    }
`;

const TrackList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 40px 1fr 80px 40px;
    padding: 12px 16px;
    border-radius: 8px;
    align-items: center;
    gap: 16px;
    transition: background-color 0.2s ease;

    @media (max-width: 768px) {
        grid-template-columns: 32px 1fr 80px 40px;
        padding: 10px 12px;
        gap: 12px;
    }

    @media (hover: hover) {
        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    .track-number-play {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        @media (max-width: 768px) {
            width: 32px;
            height: 32px;
        }

        .track-number {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 14px;
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .track-play {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        @media (hover: hover) {
            &:hover .track-number {
                opacity: 0;
            }
            &:hover .track-play {
                opacity: 1;
            }
        }

        @media (hover: none) {
            .track-play {
                opacity: 1;
            }
            .track-number {
                display: none;
            }
        }
    }

    .track-title {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;

        .title {
            color: ${({ theme }) => theme.colors.text};
            font-size: 16px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 768px) {
                font-size: 14px;
            }
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 768px) {
                font-size: 12px;
            }

            a {
                color: inherit;
                text-decoration: none;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .track-duration {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
        text-align: right;
        padding-right: 8px;

        @media (max-width: 768px) {
            font-size: 12px;
        }
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
    const { t, i18n } = useTranslation();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [artist, setArtist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handlePlay, isCurrentTrack, isPlaying: useTrackPlaybackPlaying } = useTrackPlayback();
    const isRTL = i18n.language === 'ar';

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

    const handleMainPlay = () => {
        if (tracks.length > 0) {
            handleTrackPlay(tracks[0], 0);
        }
    };

    const handleAddToPlaylist = (trackId) => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        setSelectedTrackId(trackId);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div style={{ padding: "24px" }}>{t('common.loading')}</div>;
    }

    if (error) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>{t('common.error')}</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/artists")}>
                    {t('artists.backToList')}
                </button>
            </div>
        );
    }

    if (!artist) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>{t('common.error')}</h2>
                <p>{t('artists.error.noTracks')}</p>
                <button onClick={() => router.push("/artists")}>
                    {t('artists.backToList')}
                </button>
            </div>
        );
    }

    return (
        <>
            <ArtistHeader>
                <BackButton onClick={() => router.push("/artists")} aria-label={t('common.back')}>
                    <ArrowLeft />
                </BackButton>
                <ArtistInfo>
                    <p>{t('artists.verified')}</p>
                    <h1>{artist.name}</h1>
                    <p>{t('artists.trackCount', { count: tracks.length })}</p>
                    <PlaybackControls 
                        onPlay={handleMainPlay}
                        isPlaying={isPlaying && tracks.length > 0 && isCurrentTrack(tracks[0])}
                        hasMultipleTracks={tracks.length > 1}
                    />
                </ArtistInfo>
            </ArtistHeader>

            <TracksSection>
                <h2>{t('artists.popularTracks')}</h2>
                <TrackList>
                    {tracks.map((track, index) => (
                        <TrackItem key={track._id || track.id}>
                            <div className="track-number-play">
                                <span className="track-number">{index + 1}</span>
                                <div className="track-play">
                                    <PlayButton 
                                        onClick={() => handleTrackPlay(track, index)}
                                        isPlaying={isCurrentTrack(track) && useTrackPlaybackPlaying}
                                        size="small"
                                    />
                                </div>
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
                                onClick={() => handleAddToPlaylist(track._id || track.id)}
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

