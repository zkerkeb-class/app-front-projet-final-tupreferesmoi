"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Clock, Trash2, Globe, Lock, Plus, Music, MoreVertical, ArrowLeft } from "react-feather";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying, setQueue, setCurrentTrackIndex } from "@/store/slices/playerSlice";
import playlistApi from "@/services/playlistApi";
import { musicApi } from "@services/musicApi";
import { formatTime } from '@/utils/formatTime';
import { DynamicAddToPlaylistModal } from "@components/common/dynamic";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { useTrackPlayback } from "@hooks/useTrackPlayback";
import { PlayButton } from "@components/common/buttons/PlayButton";
import { PlaybackControls } from "@/components/common/buttons/PlaybackControls";
import { useTranslation } from "react-i18next";

const Container = styled.div`
    padding: 0;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    position: relative;
`;

const PlaylistHeader = styled.div`
    padding: 32px 24px;
    display: flex;
    gap: 32px;
    align-items: flex-end;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 24px;
        padding: 24px 16px;
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
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;

    @media (max-width: 768px) {
        width: 192px;
        height: 192px;
    }

    @media (max-width: 480px) {
        width: 160px;
        height: 160px;
    }

    svg {
        width: 48px;
        height: 48px;
        color: ${({ theme }) => theme.colors.textSecondary};

        @media (max-width: 768px) {
            width: 40px;
            height: 40px;
        }
    }
`;

const PlaylistInfo = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .playlist-type {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.textSecondary};
        letter-spacing: 0.1em;
        display: flex;
        align-items: center;
        gap: 4px;

        @media (max-width: 768px) {
            justify-content: center;
        }

        svg {
            width: 14px;
            height: 14px;
        }
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

    .description {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.text};
        margin: 4px 0;
        opacity: 0.7;

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

        .username {
            color: ${({ theme }) => theme.colors.text};
            font-weight: 500;
        }
    }
`;

const TracksSection = styled.div`
    padding: 24px;
    margin-top: 16px;
    background: linear-gradient(rgba(0, 0, 0, 0.3) 0%, ${({ theme }) => theme.colors.background} 100%);

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

const TrackHeader = styled.div`
    display: grid;
    grid-template-columns: 40px 1fr 80px 40px;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    gap: 16px;
    align-items: center;

    @media (max-width: 768px) {
        grid-template-columns: 32px 1fr 80px 40px;
        padding: 8px 12px;
        gap: 12px;
    }

    .track-number {
        text-align: center;
        width: 100%;
    }

    .duration-header {
        text-align: right;
        padding-right: 8px;
    }

    .actions-header {
        @media (max-width: 768px) {
            display: none;
        }
    }
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 40px 1fr 80px 40px;
    padding: 12px 16px;
    border-radius: 8px;
    align-items: center;
    gap: 16px;
    transition: background-color 0.2s ease;
    position: relative;

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
        gap: 2px;
        min-width: 0;

        .title {
            color: ${({ theme }) => theme.colors.text};
            font-size: 16px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;

            @media (max-width: 768px) {
                font-size: 14px;
            }
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;

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
        white-space: nowrap;

        @media (max-width: 768px) {
            font-size: 12px;
        }
    }

    .track-actions {
        display: flex;
        justify-content: center;
        width: 40px;

        @media (max-width: 768px) {
            display: flex;
        }
    }

    .mobile-menu-button {
        display: none;
        
        @media (max-width: 768px) {
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: ${({ theme }) => theme.colors.textSecondary};
            width: 32px;
            height: 32px;
            padding: 0;
            cursor: pointer;

            svg {
                width: 16px;
                height: 16px;
            }
        }
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
    justify-content: center;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
        background: rgba(255, 255, 255, 0.1);
    }

    &.danger:hover {
        color: ${({ theme }) => theme.colors.error};
    }

    svg {
        width: 16px;
        height: 16px;
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

const ActionButton = styled(IconButton)`
    @media (hover: hover) {
        opacity: 0;

        ${TrackItem}:hover & {
            opacity: 1;
        }
    }

    @media (hover: none) {
        opacity: 1;
    }
`;

const MobileActionsMenu = styled.div`
    display: none;
    
    @media (max-width: 768px) {
        display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
        position: absolute;
        right: 8px;
        bottom: 100%;
        margin-bottom: 8px;
        background: ${({ theme }) => theme.colors.surface};
        border-radius: 8px;
        box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
        flex-direction: column;
        overflow: hidden;
        z-index: 10;
        min-width: 200px;

        &::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 12px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid ${({ theme }) => theme.colors.surface};
        }
    }
`;

const MobileMenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    &.danger {
        color: ${({ theme }) => theme.colors.error};
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

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

export default function PlaylistPage() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [playlist, setPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handlePlay, isCurrentTrack, isPlaying } = useTrackPlayback();
    const isRTL = i18n.language === 'ar';
    const [openMenuTrackId, setOpenMenuTrackId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await playlistApi.getPlaylist(params.id);
                setPlaylist(response.data);
                if (response.data.tracks) {
                    setTracks(response.data.tracks);
                }
            } catch (error) {
                console.error(t('playlists.error.loadFailed'), error);
                setError(t('playlists.error.loadFailed'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, t]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuTrackId && !event.target.closest('.track-actions')) {
                setOpenMenuTrackId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenuTrackId]);

    const handleTrackPlay = (track, index) => {
        handlePlay(track, { tracks, index });
    };

    const handleMainPlay = () => {
        if (tracks.length > 0) {
            handleTrackPlay(tracks[0], 0);
        }
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm(t('playlists.confirmDelete'))) {
            return;
        }

        try {
            await playlistApi.deletePlaylist(params.id);
            router.push("/playlists");
        } catch (error) {
            console.error(t('playlists.error.deleteFailed'), error);
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
        if (!window.confirm(t('playlists.confirmRemoveTrack'))) {
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
            console.error(t('playlists.error.updateFailed'), error);
        }
    };

    if (loading) {
        return <Container>{t('common.loading')}</Container>;
    }

    if (error) {
        return (
            <Container>
                <h2>{t('common.error')}</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/")}>
                    {t('common.backToHome')}
                </button>
            </Container>
        );
    }

    if (!playlist) {
        return (
            <Container>
                <h2>{t('common.error')}</h2>
                <p>{t('playlists.error.notFound')}</p>
                <button onClick={() => router.push("/")}>
                    {t('common.backToHome')}
                </button>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => router.push("/playlists")} aria-label={t('common.back')}>
                <ArrowLeft />
            </BackButton>
            <PlaylistHeader $isRTL={isRTL}>
                <PlaylistCover>
                    <Music />
                </PlaylistCover>
                <PlaylistInfo>
                    <div className="playlist-type">
                        {playlist?.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                        {playlist?.isPublic ? t('playlists.visibility.public') : t('playlists.visibility.private')}
                    </div>
                    <h1>{playlist?.name}</h1>
                    <div className="description">{playlist?.description}</div>
                    <div className="details-container">
                        <div className="details">
                            <span className="username">
                                {playlist?.userId?.username || t('playlists.unknownUser')}
                            </span>
                            <span>{t('playlists.trackCount', { count: playlist?.totalTracks || 0 })}</span>
                            <span>{t('playlists.duration', { minutes: Math.floor((playlist?.totalDuration || 0) / 60) })}</span>
                        </div>
                        <div className="controls">
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
                        </div>
                    </div>
                </PlaylistInfo>
            </PlaylistHeader>

            <TracksSection>
                <TrackHeader>
                    <div className="track-number">#</div>
                    <div>{t('tracks.track')}</div>
                    <div className="duration-header">{t('tracks.duration')}</div>
                    <div className="actions-header"></div>
                </TrackHeader>

                <TrackList>
                    {tracks.map((track, index) => (
                        <TrackItem key={track._id}>
                            <span className="track-number-play">
                                <div className="track-number">{index + 1}</div>
                                <div className="track-play">
                                    <PlayButton 
                                        onClick={() => handleTrackPlay(track, index)}
                                        isPlaying={isCurrentTrack(track) && isPlaying}
                                        size="small"
                                    />
                                </div>
                            </span>
                            <div className="track-title">
                                <div className="title">{track.title || t('common.unknownTitle')}</div>
                                <div className="artist">
                                    <Link href={`/artists/${track.artistId?._id}`}>
                                        {track.artistId?.name || t('common.unknownArtist')}
                                    </Link>
                                </div>
                            </div>
                            <span className="track-duration">{formatTime(track.duration)}</span>
                            <div className="track-actions">
                                <button 
                                    className="mobile-menu-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuTrackId(openMenuTrackId === track._id ? null : track._id);
                                    }}
                                >
                                    <MoreVertical />
                                </button>
                                <MobileActionsMenu $isOpen={openMenuTrackId === track._id}>
                                    <MobileMenuItem
                                        onClick={() => {
                                            setSelectedTrackId(track._id);
                                            setIsModalOpen(true);
                                            setOpenMenuTrackId(null);
                                        }}
                                    >
                                        <Plus />
                                        {t('track.addToPlaylist')}
                                    </MobileMenuItem>
                                    <MobileMenuItem
                                        onClick={() => {
                                            handleRemoveTrack(track._id);
                                            setOpenMenuTrackId(null);
                                        }}
                                        className="danger"
                                    >
                                        <Trash2 />
                                        {t('track.removeFromPlaylist')}
                                    </MobileMenuItem>
                                </MobileActionsMenu>
                            </div>
                        </TrackItem>
                    ))}
                </TrackList>
            </TracksSection>

            <DynamicAddToPlaylistModal
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