"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause } from "react-feather";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { musicApi } from "@services/musicApi";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { setCurrentTrack, setIsPlaying } from "@/store/slices/playerSlice";
import { getAudioInstance } from "@/utils/audioInstance";

const Container = styled.div`
    padding: 60px 24px 24px;
`;

const TrackHeader = styled.div`
    display: flex;
    gap: 24px;
    align-items: flex-end;
    margin-bottom: 32px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
`;

const CoverArt = styled.div`
    width: 232px;
    height: 232px;
    position: relative;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    overflow: hidden;
`;

const TrackInfo = styled.div`
    flex: 1;

    .track-type {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 8px;
        color: ${({ theme }) => theme.colors.textSecondary};
    }

    h1 {
        font-size: 72px;
        font-weight: 900;
        margin: 0;
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.1;
    }

    .artist {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.text};
        margin: 16px 0;
    }

    .details {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 8px 0;

        span:not(:last-child)::after {
            content: "•";
            margin: 0 8px;
        }
    }
`;

const PlayButton = styled.button`
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    margin-top: 32px;
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.1);
        background: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const StyledLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export default function TrackPage({ params }) {
    const router = useRouter();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [track, setTrack] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!params?.id || params.id === "undefined") {
                    throw new Error("ID de piste invalide");
                }

                const response = await musicApi.getTrack(params.id);
                if (!response?.data) {
                    throw new Error("Données de piste invalides");
                }

                setTrack(response.data);
            } catch (error) {
                console.error("Erreur:", error);
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

    const handlePlay = async () => {
        if (!track) return;

        const audio = getAudioInstance();
        if (!audio) return;

        // Formater les données de la piste pour le player
        const trackData = {
            ...track,
            artist: track.artistId?.name || "Artiste inconnu",
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

    if (loading) {
        return <Container>Chargement...</Container>;
    }

    if (error) {
        return (
            <Container>
                <h2>Erreur</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/")}>
                    Retour à l&apos;accueil
                </button>
            </Container>
        );
    }

    if (!track) {
        return (
            <Container>
                <h2>Erreur</h2>
                <p>Piste introuvable</p>
                <button onClick={() => router.push("/")}>
                    Retour à l&apos;accueil
                </button>
            </Container>
        );
    }

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <Container>
            <TrackHeader>
                <CoverArt>
                    <Image
                        src={track.coverUrl || DEFAULT_IMAGE}
                        alt={track.title || "Titre inconnu"}
                        fill
                        sizes="232px"
                        style={{ objectFit: "cover" }}
                        priority
                        unoptimized={true}
                    />
                </CoverArt>
                <TrackInfo>
                    <div className="track-type">Titre</div>
                    <h1>{track.title || "Titre inconnu"}</h1>
                    <div className="artist">
                        <StyledLink href={`/artists/${track.artistId?._id}`}>
                            {track.artistId?.name || "Artiste inconnu"}
                        </StyledLink>
                    </div>
                    <div className="details">
                        <span>
                            De l&apos;album{" "}
                            <StyledLink href={`/albums/${track.albumId?._id}`}>
                                {track.albumId?.title || "Album inconnu"}
                            </StyledLink>
                        </span>
                        <span>{formatDuration(track.duration || 0)}</span>
                    </div>
                    <PlayButton onClick={handlePlay}>
                        {currentTrack?.id === track.id && isPlaying ? (
                            <Pause size={24} />
                        ) : (
                            <Play size={24} />
                        )}
                    </PlayButton>
                </TrackInfo>
            </TrackHeader>
        </Container>
    );
}
