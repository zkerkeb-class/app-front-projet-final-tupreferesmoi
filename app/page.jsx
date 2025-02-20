"use client";

import React, { Suspense } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useHomeData } from "@features/home/hooks/useHomeData";
import { RecentTracksSection } from "@features/home/components/RecentTracksSection";
import { PopularArtistsSection } from "@features/home/components/PopularArtistsSection";
import { RecentAlbumsSection } from "@features/home/components/RecentAlbumsSection";
import { LazyLoadSection } from "@components/common/LazyLoadSection";
import { GridLoader } from "@components/common/loaders";

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

export default function Home() {
    const router = useRouter();
    const { i18n } = useTranslation();
    const { recentTracks, popularArtists, recentAlbums, isLoading } = useHomeData();
    const isRTL = i18n.language === 'ar';

    const handleCardClick = (type, id) => {
        if (!id) return;
        router.push(`/${type}s/${id}`);
    };

    return (
        <Container $isRTL={isRTL}>
            <RecentTracksSection
                tracks={recentTracks}
                isLoading={isLoading}
                onTrackClick={(id) => handleCardClick("track", id)}
            />

            <Suspense fallback={<GridLoader count={6} />}>
                <LazyLoadSection>
                    <PopularArtistsSection
                        artists={popularArtists}
                        isLoading={isLoading}
                        onArtistClick={(id) => handleCardClick("artist", id)}
                    />
                </LazyLoadSection>
            </Suspense>

            <Suspense fallback={<GridLoader count={6} />}>
                <LazyLoadSection>
                    <RecentAlbumsSection
                        albums={recentAlbums}
                        isLoading={isLoading}
                        onAlbumClick={(id) => handleCardClick("album", id)}
                    />
                </LazyLoadSection>
            </Suspense>
        </Container>
    );
}
