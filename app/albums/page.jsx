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
        let coverUrl = null;
        
        // Si l'album a déjà une URL de couverture valide
        if (album.coverUrl && isValidExternalUrl(album.coverUrl)) {
            coverUrl = album.coverUrl;
        }
        // Vérifier l'objet coverImage
        else if (album.coverImage) {
            // Si coverImage est une chaîne (URL directe)
            if (typeof album.coverImage === 'string' && isValidExternalUrl(album.coverImage)) {
                coverUrl = album.coverImage;
            }
            // Si coverImage est un objet avec propriétés large/medium/thumbnail
            else if (typeof album.coverImage === 'object') {
                const imgUrl = album.coverImage.large || 
                              album.coverImage.medium || 
                              album.coverImage.thumbnail;
                
                if (imgUrl && isValidExternalUrl(imgUrl)) {
                    coverUrl = imgUrl;
                }
            }
        }
        
        // Vérifier l'artiste s'il n'y a pas encore d'URL
        if (!coverUrl) {
            const artistName = getArtistName(album);
            if (artistName) {
                const artistImg = getArtistImage(artistName);
                if (artistImg) {
                    coverUrl = artistImg;
                }
            }
        }
        
        // Cas spéciaux par ID d'album
        if (!coverUrl && (album._id === "679b61dd2ce9051781b345c" || album.id === "679b61dd2ce9051781b345c")) {
            coverUrl = "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg"; // SpiderVerse
        }
        else if (!coverUrl && (album._id === "679b61a82ce90517819b344b" || album.id === "679b61a82ce90517819b344b")) {
            coverUrl = "https://static.fnac-static.com/multimedia/images_produits/ZoomPE/6/2/8/0094631168826/tsp20130828084740/Demon-days.jpg"; // Demon Days
        }
        
        // Vérifier par titre (pour les cas comme "SpiderVerse")
        if (!coverUrl && album.title) {
            if (album.title.toLowerCase().includes('spiderverse') || 
                album.title.toLowerCase().includes('spider-verse') || 
                album.title.toLowerCase().includes('spider verse')) {
                coverUrl = "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg";
            }
        }
        
        // Appliquer l'URL si elle a été trouvée ou utiliser l'image par défaut
        return {
            ...album,
            coverUrl: coverUrl || DEFAULT_IMAGE
        };
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

            // Traiter les images des albums avant de les afficher
            const processedAlbums = processAlbumImages(response.data || []);
            
            setAlbums(processedAlbums);
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
