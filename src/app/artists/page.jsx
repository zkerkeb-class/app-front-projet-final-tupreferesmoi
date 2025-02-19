"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { musicApi } from "@services/musicApi";
import { GridLoader } from "@components/common/loaders";
import { Card } from "@components/common";
import Pagination from "@components/common/Pagination";

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
    grid-template-columns: repeat(6, 180px);
    gap: 24px;
    justify-content: center;
    width: 100%;

    @media (max-width: 1400px) {
        grid-template-columns: repeat(5, 180px);
    }

    @media (max-width: 1200px) {
        grid-template-columns: repeat(4, 180px);
    }

    @media (max-width: 900px) {
        grid-template-columns: repeat(3, 180px);
        gap: 16px;
    }

    @media (max-width: 680px) {
        grid-template-columns: repeat(2, 160px);
        gap: 12px;
        font-size: 0.9rem;
    }

    @media (max-width: 400px) {
        grid-template-columns: repeat(2, 140px);
        gap: 10px;
        font-size: 0.8rem;
    }
`;

const ITEMS_PER_PAGE = 20;

export default function ArtistsPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const isRTL = i18n.language === 'ar';

    const loadArtists = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await musicApi.getAllArtists(
                pageNumber,
                ITEMS_PER_PAGE
            );

            if (!response.success) {
                throw new Error(t('common.error.invalidResponse'));
            }

            setArtists(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
            setTotalPages(response.pagination?.totalPages || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des artistes:", error);
            setError(t('artists.error.loadFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArtists(page);
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

    if (loading && artists.length === 0) {
        return (
            <Container $isRTL={isRTL}>
                <Header>
                    <h1>{t('artists.allArtists')}</h1>
                </Header>
                <GridLoader count={ITEMS_PER_PAGE} />
            </Container>
        );
    }

    if (error && artists.length === 0) {
        return (
            <Container $isRTL={isRTL}>
                <Header>
                    <h1>{t('artists.allArtists')}</h1>
                </Header>
                <p>{error}</p>
            </Container>
        );
    }

    return (
        <Container $isRTL={isRTL}>
            <Header>
                <h1>{t('artists.allArtists')}</h1>
            </Header>
            <Grid>
                {artists.map((artist) => (
                    <Card
                        key={artist.id}
                        title={artist.name}
                        subtitle={artist.genres?.join(", ")}
                        imageUrl={artist.imageUrl}
                        type="artist"
                        onClick={() => router.push(`/artists/${artist.id}`)}
                    />
                ))}
            </Grid>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                itemsLabel={t('artists.artistsLabel')}
            />
        </Container>
    );
}
