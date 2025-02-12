"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { musicApi } from "@services/musicApi";
import { GridLoader } from "@components/common/loaders";
import { Card } from "@components/common";
import Pagination from "@components/common/Pagination";
import { useTranslation } from "react-i18next";

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};
`;

const Header = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    h1 {
        font-size: 2rem;
        color: ${({ theme }) => theme.colors.text};
        margin: 0;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
`;

const ITEMS_PER_PAGE = 20;

export default function AlbumsPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const isRTL = i18n.language === 'ar';

    const loadAlbums = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await musicApi.getAllAlbums(
                pageNumber,
                ITEMS_PER_PAGE
            );

            if (!response.success) {
                throw new Error(t('common.error.invalidResponse'));
            }

            setAlbums(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
            setTotalPages(response.pagination?.totalPages || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des albums:", error);
            setError(t('albums.error.loadFailed'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlbums(page);
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

    if (loading && albums.length === 0) {
        return (
            <Container $isRTL={isRTL}>
                <Header>
                    <h1>{t('albums.allAlbums')}</h1>
                </Header>
                <GridLoader count={ITEMS_PER_PAGE} />
            </Container>
        );
    }

    if (error && albums.length === 0) {
        return (
            <Container $isRTL={isRTL}>
                <Header>
                    <h1>{t('albums.allAlbums')}</h1>
                </Header>
                <p>{error}</p>
            </Container>
        );
    }

    return (
        <Container $isRTL={isRTL}>
            <Header>
                <h1>{t('albums.allAlbums')}</h1>
            </Header>
            <Grid>
                {albums.map((album) => (
                    <Card
                        key={album.id}
                        title={album.title || t('common.unknownTitle')}
                        subtitle={album.artist || t('common.unknownArtist')}
                        imageUrl={album.coverUrl}
                        type="album"
                        onClick={() => router.push(`/albums/${album.id}`)}
                    />
                ))}
            </Grid>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                itemsLabel={t('albums.albumsLabel')}
            />
        </Container>
    );
}
