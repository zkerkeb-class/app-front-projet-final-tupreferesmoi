import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "react-feather";
import { DEFAULT_IMAGE } from "@features/player/constants";
import { PlaybackControls } from "@components/common/buttons/PlaybackControls";
import { useTranslation } from "react-i18next";

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

const StyledAlbumHeader = styled.div`
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
`;

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 8px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }
`;

const Details = styled.div`
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
`;

const ControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const AlbumHeader = ({ 
    album, 
    tracks, 
    isPlaying, 
    isCurrentTrack, 
    onBack, 
    onPlay,
    getImageUrl
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // Utiliser directement coverUrl ou image de secours
    const coverImageUrl = album?.coverUrl || DEFAULT_IMAGE;

    return (
        <StyledAlbumHeader $isRTL={isRTL}>
            <BackButton onClick={onBack} aria-label={t('common.back')}>
                <ArrowLeft />
            </BackButton>
            <AlbumCover>
                <Image
                    src={coverImageUrl}
                    alt={album.title || t('common.unknownTitle')}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized={true}
                    priority={true}
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
                <DetailsContainer>
                    <Details>
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
                    </Details>
                    <ControlsContainer>
                        <PlaybackControls 
                            onPlay={onPlay}
                            isPlaying={isPlaying && tracks.length > 0 && isCurrentTrack(tracks[0])}
                            hasMultipleTracks={tracks.length > 1}
                        />
                    </ControlsContainer>
                </DetailsContainer>
            </AlbumInfo>
        </StyledAlbumHeader>
    );
};

export default AlbumHeader; 