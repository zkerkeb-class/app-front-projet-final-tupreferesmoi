import { useState, useEffect } from 'react';
import { musicApi } from '@services/musicApi';

export const useHomeData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        recentTracks: [],
        popularArtists: [],
        recentAlbums: []
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [tracks, artists, albums] = await Promise.all([
                    musicApi.getRecentTracks(),
                    musicApi.getPopularArtists(),
                    musicApi.getRecentAlbums(),
                ]);
                
                setData({
                    recentTracks: tracks,
                    popularArtists: artists,
                    recentAlbums: albums
                });
            } catch (error) {
                setError(error);
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { ...data, isLoading, error };
}; 