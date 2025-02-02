"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Play, Pause, Plus } from "react-feather";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { musicApi } from "../../../services/musicApi";
import { useDispatch, useSelector } from "react-redux";
import {
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    setCurrentTrackIndex,
} from "../../../store/slices/playerSlice";
import { DEFAULT_IMAGE } from "../../../features/player/constants";
import AddToPlaylistModal from "@/components/common/AddToPlaylistModal";

const AlbumHeader = styled.div`
    padding: 60px 24px 24px;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    display: flex;
    gap: 24px;
    align-items: flex-end;
`;

const AlbumCover = styled.div`
    width: 232px;
    height: 232px;
    position: relative;
    box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const AlbumInfo = styled.div`
    flex: 1;

    .album-type {
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

        a {
            color: ${({ theme }) => theme.colors.text};
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
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

const TracksSection = styled.div`
    padding: 24px;
`;

const TrackList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TrackItem = styled.div`
    display: grid;
    grid-template-columns: 16px 16px 6fr minmax(120px, 1fr) 40px;
    padding: 8px;
    border-radius: 4px;
    align-items: center;
    gap: 16px;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .track-number {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
    }

    .track-play {
        opacity: 0;
    }

    &:hover .track-number {
        opacity: 0;
    }

    &:hover .track-play {
        opacity: 1;
    }

    .track-title {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 40px;
            height: 40px;
            border-radius: 4px;
        }

        .title-text {
            display: flex;
            flex-direction: column;

            .title {
                color: ${({ theme }) => theme.colors.text};
                font-size: 16px;
            }

            .artist {
                color: ${({ theme }) => theme.colors.textSecondary};
                font-size: 14px;
            }
        }
    }

    .track-duration {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
        text-align: right;
    }
`;

const PlayButton = styled.button`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
        transform: scale(1.1);
    }
`;

const AddToPlaylistButton = styled.button`
    opacity: 0;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
        transform: scale(1.1);
    }

    ${TrackItem}:hover & {
        opacity: 1;
    }
`;

export default function AlbumPage({ params }) {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!params?.id || params.id === "undefined") {
                    throw new Error("ID d'album invalide");
                }

                // Récupération de l'album et des pistes
                const [albumResponse, tracksResponse] = await Promise.all([
                    musicApi.getAlbum(params.id),
                    musicApi.getAlbumTracks(params.id),
                ]);

                // Vérification simplifiée
                if (!albumResponse?.data || !tracksResponse?.data) {
                    throw new Error("Données invalides");
                }

                const albumData = albumResponse.data;
                const tracksData = tracksResponse.data.tracks || [];

                console.log("Album Data:", albumData);
                console.log("Tracks Data:", tracksData);

                console.log("Album Response:", albumResponse.AlbumCover);
                setAlbum(albumData);
                setTracks(tracksData);
            } catch (error) {
                console.error("Erreur:", error);
                setError("Erreur lors de la récupération des données");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handlePlay = (track, index) => {
        // Transform track data to include coverUrl
        const transformedTrack = {
            ...track,
            coverUrl: track?.coverImage?.medium || track?.coverImage?.large || track?.coverImage?.thumbnail || album?.coverImage?.medium || album?.coverImage?.large || album?.coverImage?.thumbnail || DEFAULT_IMAGE,
            artist: album?.artistId?.name || "Unknown Artist",
        };
        
        // Transform all tracks in the queue to include coverUrl
        const transformedTracks = tracks.map(t => ({
            ...t,
            coverUrl:
                t?.coverImage?.medium ||
                t?.coverImage?.large ||
                t?.coverImage?.thumbnail ||
                album?.coverImage?.medium ||
                album?.coverImage?.large ||
                album?.coverImage?.thumbnail ||
                DEFAULT_IMAGE,
            artist: album?.artistId?.name || "Unknown Artist",
        }));

        dispatch(setQueue(transformedTracks));
        dispatch(setCurrentTrackIndex(index));
        dispatch(setCurrentTrack(transformedTrack));
        dispatch(setIsPlaying(true));
    };

    if (loading) {
        return <div style={{ padding: "24px" }}>Chargement...</div>;
    }

    if (error) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>Erreur</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/albums")}>
                    Retour à la liste des albums
                </button>
            </div>
        );
    }

    if (!album) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>Erreur</h2>
                <p>Album introuvable</p>
                <button onClick={() => router.push("/albums")}>
                    Retour à la liste des albums
                </button>
            </div>
        );
    }

    return (
        <>
            <div>
                <AlbumHeader>
                    <AlbumCover>
                        <Image
                            src={album?.coverImage?.large || DEFAULT_IMAGE}
                            alt={album.title}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized={true}
                        />
                    </AlbumCover>
                    <AlbumInfo>
                        <div className="album-type">
                            {album?.type?.toUpperCase() || "ALBUM"}
                        </div>
                        <h1>{album?.title || "Album inconnu"}</h1>
                        <div className="artist">
                            <Link href={`/artists/${album?.artistId?._id}`}>
                                {album?.artistId?.name || "Artiste inconnu"}
                            </Link>
                        </div>
                        <div className="details">
                            <span>
                                {album?.releaseDate
                                    ? new Date(album.releaseDate).getFullYear()
                                    : ""}
                            </span>
                            <span>{tracks?.length || 0} titres</span>
                            <span>
                                {tracks?.length
                                    ? Math.floor(
                                          tracks.reduce(
                                              (acc, track) =>
                                                  acc + (track.duration || 0),
                                              0
                                          ) / 60
                                      )
                                    : 0}{" "}
                                minutes
                            </span>
                        </div>
                    </AlbumInfo>
                </AlbumHeader>

                <TracksSection>
                    <TrackList>
                        {tracks.map((track, index) => (
                            <TrackItem key={track._id || track.id}>
                                <span className="track-number">{index + 1}</span>
                                <div className="track-play">
                                    <PlayButton onClick={() => handlePlay(track, index)}>
                                        {currentTrack?.id === track.id && isPlaying ? (
                                            <Pause size={12} />
                                        ) : (
                                            <Play size={12} />
                                        )}
                                    </PlayButton>
                                </div>
                                <div className="track-title">
                                    <div className="title-text">
                                        <span className="title">{track.title}</span>
                                        <span className="artist">
                                            <Link href={`/artists/${track.artistId?._id || album?.artistId?._id}`}>
                                                {track.artistId?.name || album?.artistId?.name}
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                                <span className="track-duration">
                                    {formatDuration(track.duration)}
                                </span>
                                <AddToPlaylistButton
                                    onClick={() => {
                                        setSelectedTrackId(track._id || track.id);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Plus size={20} />
                                </AddToPlaylistButton>
                            </TrackItem>
                        ))}
                    </TrackList>
                </TracksSection>
            </div>

            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTrackId(null);
                }}
                trackId={selectedTrackId}
            />
        </>
    );
}
