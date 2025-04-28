"use client";

import React, { Suspense, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useHomeData } from "@features/home/hooks/useHomeData";
import { RecentTracksSection } from "@features/home/components/RecentTracksSection";
import { PopularArtistsSection } from "@features/home/components/PopularArtistsSection";
import { RecentAlbumsSection } from "@features/home/components/RecentAlbumsSection";
import { GridLoader } from "@components/common/loaders";
import { isValidExternalUrl } from "@utils/imageHelpers";

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

const Section = styled.section`
    margin-bottom: 2rem;
`;

// Image par défaut à utiliser si aucune image n'est trouvée
const DEFAULT_IMAGE = "/logo192.png";

// Fonction utilitaire pour traiter les URLs externes dans les données
const processMediaItems = (items) => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.map(item => {
        // Si l'item a déjà une URL, on la garde
        if (item.coverUrl) {
            return item;
        }

        let coverUrl = null;

        // 1. Pour les albums
        if (item.coverImage) {
            if (typeof item.coverImage === 'object') {
                coverUrl = item.coverImage.large || 
                          item.coverImage.medium || 
                          item.coverImage.thumbnail;
            } else if (typeof item.coverImage === 'string') {
                coverUrl = item.coverImage;
            }
        }
        // 2. Pour les pistes avec album
        else if (item.albumId && item.albumId.coverImage) {
            const coverImage = item.albumId.coverImage;
            if (typeof coverImage === 'object') {
                coverUrl = coverImage.large || 
                          coverImage.medium || 
                          coverImage.thumbnail;
            } else if (typeof coverImage === 'string') {
                coverUrl = coverImage;
            }
        }
        // 3. Pour les artistes
        else if (item.image) {
            if (typeof item.image === 'object') {
                coverUrl = item.image.large || 
                          item.image.medium || 
                          item.image.thumbnail;
            } else if (typeof item.image === 'string') {
                coverUrl = item.image;
            }
        }

        return {
            ...item,
            coverUrl: coverUrl || DEFAULT_IMAGE
        };
    });
};

// Fonction utilitaire pour extraire le nom de l'artiste d'un item
const getArtistName = (item) => {
    // Format avec propriété artist qui est un objet
    if (item.artist && typeof item.artist === 'object' && item.artist.name) {
        return item.artist.name;
    }
    // Format avec artist comme chaîne directe
    else if (item.artist && typeof item.artist === 'string') {
        return item.artist;
    }
    // Format avec artistId comme objet
    else if (item.artistId && typeof item.artistId === 'object' && item.artistId.name) {
        return item.artistId.name;
    }
    // Format avec artistId comme chaîne
    else if (item.artistId && typeof item.artistId === 'string') {
        return item.artistId;
    }
    
    return null;
};

export default function Home() {
    const router = useRouter();
    const { i18n } = useTranslation();
    const { recentTracks, popularArtists, recentAlbums, isLoading } = useHomeData();
    const isRTL = i18n.language === 'ar';
    
    // Traiter les données pour s'assurer que les URLs externes sont correctement détectées
    const processedTracks = processMediaItems(recentTracks);
    const processedAlbums = processMediaItems(recentAlbums);

    const handleCardClick = (type, id) => {
        if (!id) return;
        router.push(`/${type}s/${id}`);
    };

    return (
        <Container $isRTL={isRTL}>
            <Section key="recent-tracks">
                <Suspense fallback={<GridLoader count={3} />}>
                    <RecentTracksSection
                        tracks={processedTracks}
                        isLoading={isLoading}
                        onTrackClick={(id) => handleCardClick("track", id)}
                    />
                </Suspense>
            </Section>

            <Section key="popular-artists">
                <Suspense fallback={<GridLoader count={3} />}>
                    <PopularArtistsSection
                        artists={popularArtists}
                        isLoading={isLoading}
                        onArtistClick={(id) => handleCardClick("artist", id)}
                    />
                </Suspense>
            </Section>

            <Section key="recent-albums">
                <Suspense fallback={<GridLoader count={3} />}>
                    <RecentAlbumsSection
                        albums={processedAlbums}
                        isLoading={isLoading}
                        onAlbumClick={(id) => handleCardClick("album", id)}
                    />
                </Suspense>
            </Section>
        </Container>
    );
}


