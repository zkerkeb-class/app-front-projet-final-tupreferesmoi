"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "../../store/slices/playerSlice";
import { Card } from "../../components/common";
import { musicApi } from "../../services/musicApi";

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 1800px;
    margin: 0 auto;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text};
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: 640px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    @media (min-width: 1440px) {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
`;

const LoadingMessage = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
`;

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
`;

export default function TracksPage() {
    const dispatch = useDispatch();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const tracksData = await musicApi.getRecentTracks();
                if (Array.isArray(tracksData)) {
                    setTracks(tracksData.filter((track) => track && track.id));
                } else {
                    throw new Error("Format de données invalide");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des morceaux:", error);
                setError("Impossible de charger les morceaux");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePlay = (track) => {
        dispatch(setCurrentTrack(track));
        dispatch(setIsPlaying(true));
    };

    if (loading) {
        return <LoadingMessage>Chargement des morceaux...</LoadingMessage>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <Container>
            <Title>Morceaux récents</Title>
            <Grid>
                {tracks.map((track) => (
                    <Card
                        key={track.id}
                        title={track.title}
                        subtitle={track.artist}
                        imageUrl={track.coverUrl}
                        type="track"
                        onPlay={() => handlePlay(track)}
                    />
                ))}
            </Grid>
        </Container>
    );
}
