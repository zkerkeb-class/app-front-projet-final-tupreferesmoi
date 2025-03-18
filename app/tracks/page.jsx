"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCurrentTrack, setIsPlaying } from "@store/slices/playerSlice";
import { musicApi } from "@services/musicApi";
import { GridLoader } from "@components/common/loaders";
import Card from "@/components/common/cards/Card";
import Pagination from "@components/common/Pagination";
import { useRouter } from "next/navigation";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { getAudioInstance } from "@/utils/audioInstance";
import { useTrackPlayback } from "@/hooks/useTrackPlayback";

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};

    @media (max-width: 680px) {
        padding: ${({ theme }) => theme.spacing.lg};
    }

    @media (max-width: 400px) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const Header = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding: 0 24px;

    @media (max-width: 900px) {
        padding: 0 16px;
    }

    @media (max-width: 400px) {
        padding: 0 12px;
    }

    h1 {
        font-size: 2.5rem;
        color: ${({ theme }) => theme.colors.text};
        margin: 0;

        @media (max-width: 1200px) {
            font-size: 2.2rem;
        }

        @media (max-width: 900px) {
            font-size: 2rem;
        }

        @media (max-width: 680px) {
            font-size: 1.8rem;
        }

        @media (max-width: 400px) {
            font-size: 1.5rem;
        }
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
    padding: 0 24px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    @media (max-width: 900px) {
        gap: 16px;
        padding: 0 16px;
    }

    @media (max-width: 680px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
        padding: 0 16px;
        font-size: 0.9rem;
    }

    @media (max-width: 400px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
        padding: 0 12px;
        font-size: 0.8rem;
    }
`;

const ITEMS_PER_PAGE = 20;

export default function TracksPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { handlePlay, isCurrentTrack, isPlaying } = useTrackPlayback();
    const isRTL = i18n.language === 'ar';

    const loadTracks = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await musicApi.getAllTracks(
                pageNumber,
                ITEMS_PER_PAGE
            );

            if (!response.success) {
                throw new Error(t('common.error.invalidResponse'));
            }

            setTracks(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
            setTotalPages(response.pagination?.totalPages || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des morceaux:", error);
            setError(t('tracks.error.loadFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTracks(page);
    }, [page]);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((p) => p - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((p) => p + 1);
        }
    };

    const handleTrackPlay = (track) => {
        handlePlay(track, { tracks, index: tracks.findIndex(t => t.id === track.id || t._id === track._id) });
    };

    if (loading && tracks.length === 0) {
        return (
            <Container $isRTL={isRTL}>
                <Header>
                    <h1>{t('tracks.allTracks')}</h1>
                </Header>
                <GridLoader count={ITEMS_PER_PAGE} />
            </Container>
        );
    }

    if (error && tracks.length === 0) {
        return (
            <Container $isRTL={isRTL}>
                <Header>
                    <h1>{t('tracks.allTracks')}</h1>
                </Header>
                <p>{error}</p>
            </Container>
        );
    }

    return (
        <Container $isRTL={isRTL}>
            <Header>
                <h1>{t('tracks.allTracks')}</h1>
            </Header>
            <Grid>
                {tracks.map((track) => (
                    <Card
                        key={track.id}
                        title={track.title}
                        subtitle={typeof track.artist === 'object' ? track.artist.name : track.artist}
                        imageUrl={track.coverUrl || DEFAULT_IMAGE}
                        type="track"
                        onClick={() => router.push(`/tracks/${track.id}`)}
                        onPlay={() => handleTrackPlay(track)}
                        isPlaying={isCurrentTrack(track) && isPlaying}
                    />
                ))}
            </Grid>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                itemsLabel={t('tracks.tracksLabel')}
            />
        </Container>
    );
}
