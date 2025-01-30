"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MediaCard from "../../components/media/MediaCard";
import { musicApi } from "../../services/musicApi";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "../../store/slices/playerSlice";

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

export default function RecentPage() {
    const dispatch = useDispatch();
    const [recentTracks, setRecentTracks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tracks = await musicApi.getRecentTracks();
                setRecentTracks(tracks);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            }
        };

        fetchData();
    }, []);

    const handlePlay = (track) => {
        dispatch(setCurrentTrack(track));
        dispatch(setIsPlaying(true));
    };

    return (
        <Container>
            <Title>Dernières sorties</Title>
            <Grid>
                {recentTracks.map((track) => (
                    <MediaCard
                        key={track.id}
                        id={track.id}
                        title={track.title}
                        description={track.artist}
                        imageUrl={track.coverUrl}
                        audioUrl={track.audioUrl}
                        type="track"
                        artist={track.artist}
                        onPlay={() => handlePlay(track)}
                    />
                ))}
            </Grid>
        </Container>
    );
}
