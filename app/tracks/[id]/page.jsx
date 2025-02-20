"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Plus, ArrowLeft } from "react-feather";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { musicApi } from "@services/musicApi";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { setCurrentTrack, setIsPlaying } from "@/store/slices/playerSlice";
import { getAudioInstance } from "@/utils/audioInstance";
import AddToPlaylistModal from "@/components/common/AddToPlaylistModal";
import { PlayButton } from "@/components/common/buttons/PlayButton";
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

const Container = styled.div`
    padding: 60px 24px 24px;
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};
    position: relative;

    @media (max-width: 768px) {
        padding: 40px 16px 16px;
    }
`;

const TrackHeader = styled.div`
    display: flex;
    gap: 24px;
    align-items: flex-end;
    margin-bottom: 32px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 16px;
    }
`;

const CoverArt = styled.div`
    width: 232px;
    height: 232px;
    position: relative;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
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
`;

const TrackInfo = styled.div`
    flex: 1;

    .track-type {
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

        @media (max-width: 768px) {
            font-size: 48px;
        }

        @media (max-width: 480px) {
            font-size: 36px;
        }
    }

    .artist {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.text};
        margin: 16px 0;

        @media (max-width: 768px) {
            margin: 12px 0;
        }
    }

    .details {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 8px 0;

        span:not(:last-child)::after {
            content: "•";
            margin: 0 8px;
        }

        @media (max-width: 480px) {
            font-size: 12px;
            
            span:not(:last-child)::after {
                margin: 0 4px;
            }
        }
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const StyledLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 32px;
    align-items: center;

    @media (max-width: 768px) {
        justify-content: center;
        margin-top: 24px;
    }
`;

const AddToPlaylistButton = styled.button`
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.06);
        border-color: ${({ theme }) => theme.colors.text};
        background: rgba(255, 255, 255, 0.1);
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

export default function TrackPage({ params }) {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [track, setTrack] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!params?.id || params.id === "undefined") {
                    throw new Error(t('tracks.error.invalidId'));
                }

                const response = await musicApi.getTrack(params.id);
                if (!response?.data) {
                    throw new Error(t('tracks.error.invalidData'));
                }

                setTrack(response.data);
            } catch (error) {
                console.error("Erreur:", error);
                setError(t('tracks.error.fetchFailed'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id, t]);

    const handlePlay = async () => {
        if (!track) return;

        const audio = getAudioInstance();
        if (!audio) return;

        const trackData = {
            ...track,
            artist: track.artistId?.name || t('common.unknownArtist'),
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

        audio.src = track.audioUrl;
        dispatch(setCurrentTrack(trackData));
        try {
            await audio.play();
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.error("Erreur lors de la lecture:", error);
        }
    };

    const handleAddToPlaylist = () => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        setIsModalOpen(true);
    };

    if (loading) {
        return <Container $isRTL={isRTL}>{t('common.loading')}</Container>;
    }

    if (error) {
        return (
            <Container $isRTL={isRTL}>
                <h2>{t('common.error')}</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/")}>
                    {t('common.backToHome')}
                </button>
            </Container>
        );
    }

    if (!track) {
        return (
            <Container $isRTL={isRTL}>
                <h2>{t('common.error')}</h2>
                <p>{t('tracks.error.notFound')}</p>
                <button onClick={() => router.push("/")}>
                    {t('common.backToHome')}
                </button>
            </Container>
        );
    }

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <Container $isRTL={isRTL}>
            <BackButton onClick={() => router.push("/tracks")} aria-label={t('common.back')}>
                <ArrowLeft />
            </BackButton>
            <TrackHeader>
                <CoverArt>
                    <Image
                        src={track.coverUrl || DEFAULT_IMAGE}
                        alt={track.title || t('common.unknownTitle')}
                        fill
                        sizes="232px"
                        style={{ objectFit: "cover" }}
                        priority
                        unoptimized={true}
                    />
                </CoverArt>
                <TrackInfo>
                    <div className="track-type">{t('tracks.track')}</div>
                    <h1>{track.title || t('common.unknownTitle')}</h1>
                    <div className="artist">
                        <StyledLink href={`/artists/${track.artistId?._id}`}>
                            {track.artistId?.name || t('common.unknownArtist')}
                        </StyledLink>
                    </div>
                    <div className="details">
                        <span>
                            {t('tracks.fromAlbum')}{" "}
                            <StyledLink href={`/albums/${track.albumId?._id}`}>
                                {track.albumId?.title || t('common.unknownAlbum')}
                            </StyledLink>
                        </span>
                        <span>{formatDuration(track.duration || 0)}</span>
                    </div>
                    <ActionButtons>
                        <PlayButton 
                            onClick={handlePlay}
                            isPlaying={currentTrack?.id === track.id && isPlaying}
                        />
                        <AddToPlaylistButton onClick={handleAddToPlaylist}>
                            <Plus size={20} />
                        </AddToPlaylistButton>
                    </ActionButtons>
                </TrackInfo>
            </TrackHeader>

            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trackId={track?.id || track?._id || params.id}
            />
        </Container>
    );
}
