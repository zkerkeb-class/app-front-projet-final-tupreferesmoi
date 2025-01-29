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

export default function AlbumsPage() {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const albumsData = await musicApi.getRecentAlbums();
                setAlbums(albumsData);
            } catch (error) {
                console.error("Erreur lors du chargement des albums:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container>
            <Title>Albums récents</Title>
            <Grid>
                {albums.map((album) => (
                    <MediaCard
                        key={album.id}
                        id={album.id}
                        title={album.title}
                        description={album.artist}
                        imageUrl={album.coverUrl}
                        type="album"
                    />
                ))}
            </Grid>
        </Container>
    );
}
