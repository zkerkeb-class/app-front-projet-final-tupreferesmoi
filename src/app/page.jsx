"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MediaSection from "../components/media/MediaSection";
import MediaCard from "../components/media/MediaCard";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "../store/slices/playerSlice";
import { musicApi } from "../services/musicApi";

const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text};
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export default function Home() {
    const dispatch = useDispatch();
    const [recentTracks, setRecentTracks] = useState([]);
    const [popularArtists, setPopularArtists] = useState([]);
    const [recentAlbums, setRecentAlbums] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tracks, artists, albums] = await Promise.all([
                    musicApi.getRecentTracks(),
                    musicApi.getPopularArtists(),
                    musicApi.getRecentAlbums(),
                ]);

                console.log("Données reçues - Artistes:", artists);
                console.log("Premier artiste:", artists[0]);

                setRecentTracks(tracks);
                setPopularArtists(artists);
                setRecentAlbums(albums);
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
            <Title>Bienvenue sur Spotify-Ynov</Title>

            <MediaSection title="Dernières sorties" href="/recent">
                {recentTracks.slice(0, 10).map((track) => (
                    <MediaCard
                        key={track.id}
                        id={track.id}
                        title={track.title}
                        description={track.artist}
                        imageUrl={track.coverUrl}
                        onPlay={() => handlePlay(track)}
                        type="track"
                    />
                ))}
            </MediaSection>

            <MediaSection title="Artistes populaires" href="/artists">
                {popularArtists.slice(0, 10).map((artist) => {
                    console.log("Rendu artiste:", artist);
                    return (
                        <MediaCard
                            key={artist.id}
                            id={artist.id}
                            title={artist.name}
                            description={`${artist.followers} followers`}
                            imageUrl={artist.imageUrl}
                            type="artist"
                        />
                    );
                })}
            </MediaSection>

            <MediaSection title="Albums récents" href="/albums">
                {recentAlbums.slice(0, 10).map((album) => (
                    <MediaCard
                        key={album.id}
                        id={album.id}
                        title={album.title}
                        description={album.artist}
                        imageUrl={album.coverUrl}
                        type="album"
                    />
                ))}
            </MediaSection>
        </Container>
    );
}
