"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Card } from "../../components/common";
import { musicApi } from "../../services/musicApi";
import { useRouter } from "next/navigation";
import { DEFAULT_IMAGE } from "../../features/player/constants";

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 1800px;
    margin: 0 auto;
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
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text};
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export default function AlbumsPage() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await musicApi.getRecentAlbums();
                if (Array.isArray(response)) {
                    setAlbums(response);
                } else {
                    throw new Error("Format de données invalide");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des albums:", error);
                setError("Impossible de charger les albums");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Chargement des albums...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <Title>Albums test</Title>
            <Grid>
                {albums.map((album) => (
                    <Card
                        key={album.id}
                        title={album.title}
                        subtitle={album.artist}
                        imageUrl={album.coverUrl || DEFAULT_IMAGE}
                        type="album"
                        onClick={() => router.push(`/albums/${album.id}`)}
                    />
                ))}
            </Grid>
        </Container>
    );
}
