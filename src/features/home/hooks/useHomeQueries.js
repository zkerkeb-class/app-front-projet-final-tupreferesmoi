import { useQueries } from '@tanstack/react-query';
import { musicApi } from '@services/musicApi';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const CACHE_TIME = 1000 * 60 * 30; // 30 minutes

const queryKeys = {
    recentTracks: ['tracks', 'recent'],
    popularArtists: ['artists', 'popular'],
    recentAlbums: ['albums', 'recent'],
};

const queries = [
    {
        queryKey: queryKeys.recentTracks,
        queryFn: () => musicApi.getRecentTracks(),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
    },
    {
        queryKey: queryKeys.popularArtists,
        queryFn: () => musicApi.getPopularArtists(),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
    },
    {
        queryKey: queryKeys.recentAlbums,
        queryFn: () => musicApi.getRecentAlbums(),
        staleTime: STALE_TIME,
        cacheTime: CACHE_TIME,
    },
];

export const useHomeQueries = () => {
    const results = useQueries({ queries });

    const isLoading = results.some(result => result.isLoading);
    const isError = results.some(result => result.isError);
    const error = results.find(result => result.error)?.error;

    return {
        recentTracks: results[0].data ?? [],
        popularArtists: results[1].data ?? [],
        recentAlbums: results[2].data ?? [],
        isLoading,
        isError,
        error,
        // Expose refetch functions for manual updates
        refetchAll: () => results.forEach(result => result.refetch()),
        refetchTracks: results[0].refetch,
        refetchArtists: results[1].refetch,
        refetchAlbums: results[2].refetch,
    };
}; 