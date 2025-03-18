"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { musicApi } from "@services/musicApi";
import { GridLoader } from "@components/common/loaders";
import { Card } from "@components/common";
import Pagination from "@components/common/Pagination";
import { useTranslation } from "react-i18next";
import { isValidExternalUrl, getArtistName, getArtistImage } from "@utils/imageHelpers";

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

// Image par défaut à utiliser si aucune image n'est trouvée
const DEFAULT_IMAGE = "/logo192.png";

// Fonction utilitaire pour traiter les images des albums
const processAlbumImages = (albums) => {
    if (!albums || !Array.isArray(albums)) return [];
    
    return albums.map(album => {
        // Le backend devrait déjà avoir fourni coverUrl correctement
        // Si ce n'est pas le cas, on utilise l'image par défaut
        if (!album.coverUrl) {
            return {
                ...album,
                coverUrl: DEFAULT_IMAGE
            };
        }
        
        // Si on a une URL, on la retourne directement
        return album;
    });
};

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

            
            // Vérification simple des images - le backend devrait déjà avoir traité les URLs
            const processedAlbums = processAlbumImages(response.data || []);
            
            setAlbums(processedAlbums);
            setTotalItems(response.pagination?.totalItems || 0);
            setTotalPages(response.pagination?.totalPages || 0);
        } catch (error) {
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
