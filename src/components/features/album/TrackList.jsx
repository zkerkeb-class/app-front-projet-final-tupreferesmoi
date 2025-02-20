import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Plus } from "react-feather";
import { PlayButton } from "@components/common/buttons/PlayButton";
import { useTranslation } from "react-i18next";

const TracksSection = styled.div`
    padding: 24px;
    margin-top: 16px;

    @media (max-width: 768px) {
        padding: 16px;
        margin-top: 8px;
    }
`;

const StyledTrackList = styled.div`
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

const TrackList = ({ 
    tracks, 
    album,
    isCurrentTrack, 
    isPlaying, 
    onTrackPlay, 
    onAddToPlaylist,
    formatDuration 
}) => {
    const { t } = useTranslation();

    return (
        <TracksSection>
            <StyledTrackList>
                {tracks.map((track, index) => (
                    <TrackItem key={track._id || track.id}>
                        <div className="track-number-play">
                            <span className="track-number">{index + 1}</span>
                            <div className="track-play">
                                <PlayButton 
                                    onClick={() => onTrackPlay(track, index)}
                                    isPlaying={isCurrentTrack(track) && isPlaying}
                                    size="small"
                                />
                            </div>
                        </div>
                        <div className="track-info">
                            <div className="track-title">
                                {track.title || t('common.unknownTitle')}
                            </div>
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
                            onClick={() => onAddToPlaylist(track._id || track.id)}
                            aria-label={t('common.addToPlaylist')}
                        >
                            <Plus />
                        </AddToPlaylistButton>
                    </TrackItem>
                ))}
            </StyledTrackList>
        </TracksSection>
    );
};

export default TrackList; 