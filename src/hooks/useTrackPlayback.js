import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying, setQueue, setCurrentTrackIndex } from "@/store/slices/playerSlice";
import { getAudioInstance } from "@/utils/audioInstance";
import { DEFAULT_IMAGE } from "@/features/player/constants";

export const useTrackPlayback = () => {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);

    const handlePlay = async (track, options = {}) => {
        if (!track) return;

        const audio = getAudioInstance();
        if (!audio) return;

        const trackId = track._id || track.id;

        // Si on joue la même piste, on bascule entre play/pause
        if (currentTrack?.id === trackId) {
            if (isPlaying) {
                audio.pause();
            } else {
                await audio.play();
            }
            dispatch(setIsPlaying(!isPlaying));
            return;
        }

        // Formater les données de la piste pour le player
        const trackData = {
            ...track,
            id: trackId,
            title: track.title,
            artist: track.artistId?.name || track.artist || "Artiste inconnu",
            coverUrl: track.coverUrl || 
                     track?.albumId?.coverImage?.medium || 
                     track?.albumId?.coverImage?.large || 
                     track?.albumId?.coverImage?.thumbnail || 
                     DEFAULT_IMAGE,
            audioUrl: track.audioUrl
        };

        // Si on a une liste de pistes et un index, on met à jour la queue
        if (options.tracks && typeof options.index === 'number') {
            const transformedTracks = options.tracks.map(t => ({
                ...t,
                id: t._id || t.id,
                title: t.title,
                artist: t.artistId?.name || t.artist || "Artiste inconnu",
                coverUrl: t.coverUrl || 
                         t?.albumId?.coverImage?.medium || 
                         t?.albumId?.coverImage?.large || 
                         t?.albumId?.coverImage?.thumbnail || 
                         DEFAULT_IMAGE,
                audioUrl: t.audioUrl
            }));

            dispatch(setQueue(transformedTracks));
            dispatch(setCurrentTrackIndex(options.index));
        }

        // Mettre à jour la piste courante et démarrer la lecture
        audio.src = track.audioUrl;
        dispatch(setCurrentTrack(trackData));
        try {
            await audio.play();
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.error("Erreur lors de la lecture:", error);
            dispatch(setIsPlaying(false));
        }
    };

    const isCurrentTrack = (track) => {
        if (!track || !currentTrack) return false;
        const trackId = track._id || track.id;
        return currentTrack.id === trackId;
    };

    return {
        handlePlay,
        currentTrack,
        isPlaying,
        isCurrentTrack
    };
}; 