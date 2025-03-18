"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { musicApi } from "@services/musicApi";
import { useTrackPlayback } from "@hooks/useTrackPlayback";
import { DynamicAddToPlaylistModal } from "@components/common/dynamic";
import AlbumHeader from "@components/features/album/AlbumHeader";
import TrackList from "@components/features/album/TrackList";
import authService from "@services/authService";
import { getAlbumCoverImage, getImageUrl } from "@utils/imageHelpers";

// Image par défaut à utiliser si aucune image n'est trouvée
const DEFAULT_IMAGE = "/logo192.png";
import { getAlbumCoverImage, getImageUrl } from "@utils/imageHelpers";

// Image par défaut à utiliser si aucune image n'est trouvée
const DEFAULT_IMAGE = "/logo192.png";

export default function AlbumPage({ params }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handlePlay, isCurrentTrack } = useTrackPlayback();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!params?.id || params.id === "undefined") {
                    throw new Error(t('albums.error.invalidId'));
                }

                const [albumResponse, tracksResponse] = await Promise.all([
                    musicApi.getAlbum(params.id),
                    musicApi.getAlbumTracks(params.id),
                ]);

                if (!albumResponse?.data || !tracksResponse?.data) {
                    throw new Error(t('albums.error.invalidData'));
                }

                const albumData = albumResponse.data;
                const tracksData = tracksResponse.data.tracks || [];
                
                // S'assurer que l'album a une coverUrl valide
                if (!albumData.coverUrl) {
                    // Essayer d'extraire depuis coverImage si disponible
                    if (albumData.coverImage) {
                        albumData.coverUrl = albumData.coverImage.large || 
                                           albumData.coverImage.medium || 
                                           albumData.coverImage.thumbnail || 
                                           DEFAULT_IMAGE;
                    } else {
                        albumData.coverUrl = DEFAULT_IMAGE;
                    }
                }
                
                setAlbum(albumData);
                
                // S'assurer que chaque piste a une coverUrl valide
                const processedTracks = tracksData.map(track => {
                    if (!track.coverUrl) {
                        return {
                            ...track,
                            coverUrl: albumData.coverUrl // Utiliser l'image de l'album
                        };
                    }
                    return track;
                });
                
                setTracks(processedTracks);
            } catch (error) {
                console.error("Erreur:", error);
                setError(t('albums.error.fetchFailed'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, t]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleTrackPlay = (track, index) => {
        // Utilisation directe de l'URL de couverture de l'album
        const coverUrl = album.coverUrl || DEFAULT_IMAGE;
        
        // S'assurer que la piste a une coverUrl
        const trackWithCover = {
            ...track,
            coverUrl: track.coverUrl || coverUrl
        };
        
        handlePlay(trackWithCover, { 
            tracks: tracks.map(t => ({
                ...t,
                coverUrl: t.coverUrl || coverUrl
            })), 
            index 
        });
    };

    const handleMainPlay = () => {
        if (tracks.length > 0) {
            handleTrackPlay(tracks[0], 0);
        }
    };

    const handleAddToPlaylist = (trackId) => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        setSelectedTrackId(trackId);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div style={{ padding: "24px" }}>{t('common.loading')}</div>;
    }

    if (error) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>{t('common.error')}</h2>
                <p>{error}</p>
                <button onClick={() => router.push("/albums")}>
                    {t('albums.backToList')}
                </button>
            </div>
        );
    }

    if (!album) {
        return (
            <div style={{ padding: "24px" }}>
                <h2>{t('common.error')}</h2>
                <p>{t('albums.error.notFound')}</p>
                <button onClick={() => router.push("/albums")}>
                    {t('albums.backToList')}
                </button>
            </div>
        );
    }

    return (
        <>
            <div>
                <AlbumHeader 
                    album={album}
                    tracks={tracks}
                    isPlaying={isPlaying}
                    isCurrentTrack={isCurrentTrack}
                    onBack={() => router.push("/albums")}
                    onPlay={handleMainPlay}
                    getImageUrl={getImageUrl}
                    getImageUrl={getImageUrl}
                />

                <TrackList 
                    tracks={tracks}
                    album={album}
                    isCurrentTrack={isCurrentTrack}
                    isPlaying={isPlaying}
                    onTrackPlay={handleTrackPlay}
                    onAddToPlaylist={handleAddToPlaylist}
                    formatDuration={formatDuration}
                    getImageUrl={getImageUrl}
                    getImageUrl={getImageUrl}
                />
            </div>

            <DynamicAddToPlaylistModal
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
