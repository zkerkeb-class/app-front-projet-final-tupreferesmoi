"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "@store/slices/playerSlice";
import { musicApi } from "@services/musicApi";
import { GridLoader } from "@components/common/loaders";
import { Card } from "@components/common";
import Pagination from "@components/common/Pagination";
import { useRouter } from "next/navigation";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { getAudioInstance } from "@/utils/audioInstance";

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
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

export default function TracksPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const loadTracks = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await musicApi.getAllTracks(
                pageNumber,
                ITEMS_PER_PAGE
            );

            if (!response.success) {
                throw new Error("Réponse invalide du serveur");
            }

            setTracks(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
            setTotalPages(response.pagination?.totalPages || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des morceaux:", error);
            setError("Impossible de charger les morceaux");
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

    const handlePlay = async (track) => {
        if (!track) return;

        const audio = getAudioInstance();
        if (!audio) return;

        // Formater les données de la piste pour le player
        const trackData = {
            ...track,
            artist: track.artist || "Artiste inconnu",
        };

        if (currentTrack?.id === track.id) {
            if (isPlaying) {
                audio.pause();
            } else {
                await audio.play();
            }
            dispatch(setIsPlaying(!isPlaying));
            return;
        }

        // Nouvelle piste
        audio.src = track.audioUrl;
        dispatch(setCurrentTrack(trackData));
        try {
            await audio.play();
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.error("Erreur lors de la lecture:", error);
        }
    };

    if (loading && tracks.length === 0) {
        return (
            <Container>
                <Header>
                    <h1>Tous les morceaux</h1>
                </Header>
                <GridLoader count={ITEMS_PER_PAGE} />
            </Container>
        );
    }

    if (error && tracks.length === 0) {
        return (
            <Container>
                <Header>
                    <h1>Tous les morceaux</h1>
                </Header>
                <p>{error}</p>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <h1>Tous les morceaux</h1>
            </Header>
            <Grid>
                {tracks.map((track) => (
                    <Card
                        key={track.id}
                        title={track.title}
                        subtitle={track.artist}
                        imageUrl={track.coverUrl || DEFAULT_IMAGE}
                        type="album"
                        onClick={() => router.push(`/tracks/${track.id}`)}
                        onPlay={() => handlePlay(track)}
                        isPlaying={currentTrack?.id === track.id && isPlaying}
                    />
                ))}
            </Grid>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                itemsLabel="morceaux"
            />
        </Container>
    );
}
