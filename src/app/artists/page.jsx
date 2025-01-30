"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MediaCard from "../../components/media/MediaCard";
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

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
`;

const LoadingMessage = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
`;

export default function ArtistsPage() {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const artistsData = await musicApi.getPopularArtists();
                if (Array.isArray(artistsData)) {
                    setArtists(
                        artistsData.filter((artist) => artist && artist.id)
                    );
                } else {
                    throw new Error("Format de données invalide");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des artistes:", error);
                setError("Impossible de charger les artistes");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingMessage>Chargement des artistes...</LoadingMessage>;
    }

    if (error) {
        return <ErrorMessage>{error}</ErrorMessage>;
    }

    return (
        <Container>
            <Title>Artistes populaires</Title>
            <Grid>
                {artists.map(
                    (artist) =>
                        artist &&
                        artist.id && (
                            <MediaCard
                                key={artist.id}
                                id={artist.id}
                                title={artist.name}
                                description={`${artist.followers || 0} followers`}
                                imageUrl={artist.imageUrl}
                                type="artist"
                            />
                        )
                )}
            </Grid>
        </Container>
    );
}
