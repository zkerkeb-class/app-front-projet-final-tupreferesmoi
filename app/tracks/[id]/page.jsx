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
import { DynamicAddToPlaylistModal } from "@components/common/dynamic";
import { PlayButton } from "@/components/common/buttons/PlayButton";
import authService from "@/services/authService";
import { getSpecialAlbumCoverUrl, isValidExternalUrl, getArtistName, getArtistImage } from "@utils/imageHelpers";

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
    padding: 0;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    position: relative;
    max-width: 1480px;
    margin: 0 auto;
    width: 100%;
`;

const ContentWrapper = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    padding: 0 24px;

    @media (max-width: 768px) {
        padding: 0 16px;
    }
`;

const TrackHeader = styled.div`
    padding: 32px 0;
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
        padding: 24px 0;
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
        font-size: 36px;
        font-weight: 900;
        margin: 0;
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.2;
        word-break: break-word;
        overflow-wrap: break-word;
        max-width: 100%;

        @media (max-width: 768px) {
            font-size: 28px;
        }

        @media (max-width: 480px) {
            font-size: 20px;
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

const TracksSection = styled.div`
    padding: 24px 0;
    margin-top: 16px;
    background: linear-gradient(rgba(0, 0, 0, 0.3) 0%, ${({ theme }) => theme.colors.background} 100%);

    @media (max-width: 768px) {
        padding: 16px 0;
        margin-top: 8px;
    }
`;

const TrackList = styled.div`
    // Add any necessary styles for the track list
`;

export default function TrackPage({ params }) {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [track, setTrack] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState(null);
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

                const trackData = response.data;
                
                // Gestion des images de couverture
                let coverUrl = null;
                
                // 1. Vérifier l'objet albumId s'il existe
                if (trackData.albumId) {
                    // Si albumId est un objet avec coverImage
                    if (typeof trackData.albumId === 'object' && trackData.albumId.coverImage) {
                        // Si l'image de couverture est une chaîne de caractères
                        if (typeof trackData.albumId.coverImage === 'string') {
                            // On l'utilise directement si c'est une URL externe valide
                            if (isValidExternalUrl(trackData.albumId.coverImage)) {
                                coverUrl = trackData.albumId.coverImage;
                            }
                        } 
                        // Si l'image de couverture est un objet avec des propriétés comme large, medium, etc.
                        else if (typeof trackData.albumId.coverImage === 'object') {
                            // Vérifier si l'une des URLs est externe
                            const albumCoverUrl = trackData.albumId.coverImage.large || 
                                               trackData.albumId.coverImage.medium || 
                                               trackData.albumId.coverImage.thumbnail;
                            
                            if (albumCoverUrl && isValidExternalUrl(albumCoverUrl)) {
                                coverUrl = albumCoverUrl;
                            }
                        }
                    }
                    
                    // Vérifier si l'ID de l'album correspond à un cas spécial
                    if (!coverUrl) {
                        const albumId = typeof trackData.albumId === 'object' ? 
                                        trackData.albumId._id || trackData.albumId.id : 
                                        trackData.albumId;
                                        
                        const specialCover = getSpecialAlbumCoverUrl(albumId);
                        if (specialCover) {
                            coverUrl = specialCover;
                        }
                    }
                }
                
                // 2. Vérifier par artiste si aucune image trouvée
                if (!coverUrl) {
                    const artistName = getArtistName(trackData);
                    if (artistName) {
                        const artistImage = getArtistImage(artistName);
                        if (artistImage) {
                            coverUrl = artistImage;
                        }
                    }
                }
                
                // 3. Vérifier par titre de la piste
                if (!coverUrl && trackData.title) {
                    if (trackData.title.toLowerCase().includes("sunflower") || 
                        trackData.title.toLowerCase().includes("spider") || 
                        trackData.title.toLowerCase().includes("verse")) {
                        coverUrl = "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg";
                    }
                }
                
                // Appliquer l'URL si elle a été trouvée
                if (coverUrl) {
                    trackData.coverUrl = coverUrl;
                }

                setTrack(trackData);
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

        // S'assurer que artist est une chaîne de caractères et non un objet
        let artistName = "";
        if (track.artistId) {
            // Si artistId est un objet avec name
            if (typeof track.artistId === 'object' && track.artistId.name) {
                artistName = track.artistId.name;
            }
            // Si artistId est une chaîne
            else if (typeof track.artistId === 'string') {
                artistName = track.artistId;
            }
        }
        
        const trackData = {
            ...track,
            artist: artistName || t('common.unknownArtist'),
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
        <Container>
            <ContentWrapper>
                <BackButton onClick={() => router.push("/tracks")} aria-label={t('common.back')}>
                    <ArrowLeft />
                </BackButton>
                <TrackHeader $isRTL={isRTL}>
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

                <TracksSection>
                    <TrackList>
                        {/* ... reste du contenu existant ... */}
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
            </ContentWrapper>
        </Container>
    );
}
