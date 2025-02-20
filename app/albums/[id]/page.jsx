"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Plus, ArrowLeft } from "react-feather";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { musicApi } from "@services/musicApi";
import { useDispatch, useSelector } from "react-redux";
import {
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    setCurrentTrackIndex,
} from "@store/slices/playerSlice";
import { DEFAULT_IMAGE } from "@features/player/constants";
import AddToPlaylistModal from "@components/common/AddToPlaylistModal";
import { useTrackPlayback } from "@hooks/useTrackPlayback";
import { PlayButton } from "@components/common/buttons/PlayButton";
import { PlaybackControls } from "@components/common/buttons/PlaybackControls";
import { useTranslation } from "react-i18next";
import authService from "@services/authService";

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

const AlbumHeader = styled.div`
    padding: 32px 24px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    gap: 32px;
    align-items: flex-end;
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};
    position: relative;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 24px;
        padding: 24px 16px;
    }
`;

const AlbumCover = styled.div`
    width: 232px;
    height: 232px;
    position: relative;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 192px;
        height: 192px;
    }

    @media (max-width: 480px) {
        width: 160px;
        height: 160px;
    }
`;

const AlbumInfo = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .album-type {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.textSecondary};
        letter-spacing: 0.1em;
    }

    h1 {
        font-size: 48px;
        font-weight: 900;
        margin: 0;
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.1;

        @media (max-width: 768px) {
            font-size: 36px;
        }

        @media (max-width: 480px) {
            font-size: 28px;
        }
    }

    .artist {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.text};
        margin: 4px 0;

        a {
            color: ${({ theme }) => theme.colors.text};
            text-decoration: none;
            font-weight: 500;

            &:hover {
                text-decoration: underline;
            }
        }

        @media (max-width: 480px) {
            font-size: 14px;
        }
    }

    .details-container {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 8px;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: center;
            gap: 12px;
        }
    }

    .details {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;

        span:not(:last-child)::after {
            content: "•";
            margin: 0 8px;
        }

        @media (max-width: 768px) {
            justify-content: center;
        }

        @media (max-width: 480px) {
            font-size: 12px;
            gap: 4px;

            span:not(:last-child)::after {
                margin: 0 4px;
            }
        }
    }
`;

const TracksSection = styled.div`
    padding: 24px;
    margin-top: 16px;

    @media (max-width: 768px) {
        padding: 16px;
        margin-top: 8px;
    }
`;

const TrackList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 40px 1fr auto 40px;
    padding: 12px 16px;
    border-radius: 8px;
    align-items: center;
    gap: 16px;
    transition: background-color 0.2s ease;

    @media (max-width: 768px) {
        grid-template-columns: 32px 1fr 40px;
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
            font-size: 16px;
            position: absolute;
        }

        .track-play {
            position: absolute;
            opacity: 0;
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

    .track-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;

        .track-title {
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

        .track-artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            @media (max-width: 768px) {
                font-size: 12px;
            }
        }
    }

    .track-duration {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
        padding: 0 8px;

        @media (max-width: 768px) {
            display: none;
        }
    }
`;

const AddToPlaylistButton = styled.button`
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;

    @media (hover: hover) {
        opacity: 0;

        &:hover {
            color: ${({ theme }) => theme.colors.text};
            background: rgba(255, 255, 255, 0.1);
        }

        ${TrackItem}:hover & {
            opacity: 1;
        }
    }

    @media (hover: none) {
        opacity: 1;
    }

    svg {
        width: 20px;
        height: 20px;

        @media (max-width: 768px) {
            width: 18px;
            height: 18px;
        }
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        margin-top: 8px;
    }
`;

export default function AlbumPage({ params }) {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [album, setAlbum] = useState(null);
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
                    throw new Error(t('albums.error.invalidId'));
                }

                const [albumResponse, tracksResponse] = await Promise.all([
                    musicApi.getAlbum(params.id),
                    musicApi.getAlbumTracks(params.id),
                ]);

                if (!albumResponse?.data || !tracksResponse?.data) {
                    throw new Error(t('albums.error.invalidData'));
                }

                const albumData = albumResponse.data;
                const tracksData = tracksResponse.data.tracks || [];

                setAlbum(albumData);
                setTracks(tracksData);
            } catch (error) {
                console.error("Erreur:", error);
                setError(t('albums.error.fetchFailed'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, t]);

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
                <button onClick={() => router.push("/albums")}>
                    {t('albums.backToList')}
                </button>
            </div>
        );
    }

    if (!album) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>{t('common.error')}</h2>
                <p>{t('albums.error.notFound')}</p>
                <button onClick={() => router.push("/albums")}>
                    {t('albums.backToList')}
                </button>
            </div>
        );
    }

    return (
        <>
            <div>
                <AlbumHeader $isRTL={isRTL}>
                    <BackButton onClick={() => router.push("/albums")} aria-label={t('common.back')}>
                        <ArrowLeft />
                    </BackButton>
                    <AlbumCover>
                        <Image
                            src={album?.coverImage?.large || DEFAULT_IMAGE}
                            alt={album.title || t('common.unknownTitle')}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized={true}
                        />
                    </AlbumCover>
                    <AlbumInfo>
                        <div className="album-type">
                            {album?.type?.toUpperCase() || t('albums.type')}
                        </div>
                        <h1>{album?.title || t('common.unknownTitle')}</h1>
                        <div className="artist">
                            <Link href={`/artists/${album?.artistId?._id}`}>
                                {album?.artistId?.name || t('common.unknownArtist')}
                            </Link>
                        </div>
                        <div className="details-container">
                            <div className="details">
                                <span>
                                    {album?.releaseDate
                                        ? new Date(album.releaseDate).getFullYear()
                                        : ""}
                                </span>
                                <span>{t('albums.trackCount', { count: tracks?.length || 0 })}</span>
                                <span>
                                    {t('albums.duration', {
                                        minutes: tracks?.length
                                            ? Math.floor(
                                                  tracks.reduce(
                                                      (acc, track) =>
                                                          acc + (track.duration || 0),
                                                      0
                                                  ) / 60
                                            )
                                            : 0
                                    })}
                                </span>
                            </div>
                            <ControlsContainer>
                                <PlaybackControls 
                                    onPlay={handleMainPlay}
                                    isPlaying={isPlaying && tracks.length > 0 && isCurrentTrack(tracks[0])}
                                    hasMultipleTracks={tracks.length > 1}
                                />
                            </ControlsContainer>
                        </div>
                    </AlbumInfo>
                </AlbumHeader>

                <TracksSection>
                    <TrackList>
                        {tracks.map((track, index) => (
                            <TrackItem key={track._id || track.id}>
                                <div className="track-number-play">
                                    <span className="track-number">{index + 1}</span>
                                    <div className="track-play">
                                        <PlayButton 
                                            onClick={() => handleTrackPlay(track, index)}
                                            isPlaying={isCurrentTrack(track) && isPlaying}
                                            size="small"
                                        />
                                    </div>
                                </div>
                                <div className="track-info">
                                    <div className="track-title">{track.title || t('common.unknownTitle')}</div>
                                    <div className="track-artist">
                                        <Link href={`/artists/${track.artistId?._id || album?.artistId?._id}`}>
                                            {track.artistId?.name || album?.artistId?.name || t('common.unknownArtist')}
                                        </Link>
                                    </div>
                                </div>
                                <div className="track-duration">
                                    {formatDuration(track.duration)}
                                </div>
                                <AddToPlaylistButton
                                    onClick={() => handleAddToPlaylist(track._id || track.id)}
                                    aria-label={t('common.addToPlaylist')}
                                >
                                    <Plus />
                                </AddToPlaylistButton>
                            </TrackItem>
                        ))}
                    </TrackList>
                </TracksSection>
            </div>

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
