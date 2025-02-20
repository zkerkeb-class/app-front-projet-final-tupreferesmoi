"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentTrack, setIsPlaying } from "@store/slices/playerSlice";
import { musicApi } from "@services/musicApi";
import { GridLoader } from "@components/common/loaders";
import { Card } from "@components/common";
import { Section } from "@components/common/sections/Section";
import { useTrackPlayback } from "@/hooks/useTrackPlayback";
import { useTranslation } from "react-i18next";

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

export default function Home() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [recentTracks, setRecentTracks] = useState([]);
    const [popularArtists, setPopularArtists] = useState([]);
    const [recentAlbums, setRecentAlbums] = useState([]);
    const { handlePlay, isCurrentTrack, isPlaying } = useTrackPlayback();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [tracks, artists, albums] = await Promise.all([
                    musicApi.getRecentTracks(),
                    musicApi.getPopularArtists(),
                    musicApi.getRecentAlbums(),
                ]);
                setRecentTracks(tracks);
                setPopularArtists(artists);
                setRecentAlbums(albums);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (type, id) => {
        if (!id) return;
        switch (type) {
            case "artist":
                router.push(`/artists/${id}`);
                break;
            case "album":
                router.push(`/albums/${id}`);
                break;
            case "playlist":
                router.push(`/tracks/${id}`);
                break;
            default:
                break;
        }
    };

    if (isLoading) {
        return (
            <Container $isRTL={isRTL}>
                <Section title={t('home.recentTracks')} href="/tracks" showAllText={t('common.showAll')}>
                    <GridLoader count={8} />
                </Section>
                <Section title={t('home.popularArtists')} href="/artists" showAllText={t('common.showAll')}>
                    <GridLoader count={6} />
                </Section>
                <Section title={t('home.recentAlbums')} href="/albums" showAllText={t('common.showAll')}>
                    <GridLoader count={6} />
                </Section>
            </Container>
        );
    }

    return (
        <Container $isRTL={isRTL}>
            <Section title={t('home.recentTracks')} href="/tracks" showAllText={t('common.showAll')}>
                <Grid>
                    {recentTracks.map((track) => (
                        <Card
                            key={track.id}
                            title={track.title}
                            subtitle={track.artist}
                            imageUrl={track.coverUrl}
                            type="playlist"
                            onClick={() => handleCardClick("playlist", track.id)}
                            onPlay={() => handlePlay(track, { tracks: recentTracks, index: recentTracks.indexOf(track) })}
                            isPlaying={isCurrentTrack(track) && isPlaying}
                        />
                    ))}
                </Grid>
            </Section>

            <Section title={t('home.popularArtists')} href="/artists" showAllText={t('common.showAll')}>
                <Grid>
                    {popularArtists.map((artist) => (
                        <Card
                            key={artist.id}
                            title={artist.name}
                            imageUrl={artist.imageUrl}
                            type="artist"
                            onClick={() => handleCardClick("artist", artist.id)}
                        />
                    ))}
                </Grid>
            </Section>

            <Section title={t('home.recentAlbums')} href="/albums" showAllText={t('common.showAll')}>
                <Grid>
                    {recentAlbums.map((album) => (
                        <Card
                            key={album.id}
                            title={album.title}
                            subtitle={album.artist}
                            imageUrl={album.coverUrl}
                            type="album"
                            onClick={() => handleCardClick("album", album.id)}
                        />
                    ))}
                </Grid>
            </Section>
        </Container>
    );
}
