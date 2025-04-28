import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying, setQueue, setCurrentTrackIndex } from "@/store/slices/playerSlice";
import { getAudioInstance } from "@/utils/audioInstance";
import { DEFAULT_IMAGE } from "@/features/player/constants";
import { isValidExternalUrl } from "@/utils/imageHelpers";

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

        // Déterminer l'URL de l'image de couverture
        let coverUrl = null;
        
        // 1. Vérifier si l'URL directe de coverUrl est valide
        if (track.coverUrl && isValidExternalUrl(track.coverUrl)) {
            coverUrl = track.coverUrl;
        }
        // 2. Vérifier l'objet albumId s'il existe
        else if (track.albumId) {
            if (typeof track.albumId === 'object' && track.albumId.coverImage) {
                // Si coverImage est une chaîne (URL directe)
                if (typeof track.albumId.coverImage === 'string' && isValidExternalUrl(track.albumId.coverImage)) {
                    coverUrl = track.albumId.coverImage;
                }
                // Si coverImage est un objet avec propriétés large/medium/thumbnail
                else if (typeof track.albumId.coverImage === 'object') {
                    const albumCoverUrl = track.albumId.coverImage.large || 
                                         track.albumId.coverImage.medium || 
                                         track.albumId.coverImage.thumbnail;
                    
                    if (albumCoverUrl && isValidExternalUrl(albumCoverUrl)) {
                        coverUrl = albumCoverUrl;
                    }
                }
            }
        }

        // Formater les données de la piste pour le player
        const trackData = {
            ...track,
            id: trackId,
            title: track.title,
            artist: typeof track.artistId === 'object' && track.artistId?.name 
                    ? track.artistId.name 
                    : (typeof track.artist === 'object' && track.artist?.name 
                      ? track.artist.name 
                      : (typeof track.artist === 'string' 
                        ? track.artist 
                        : "Artiste inconnu")),
            coverUrl: coverUrl || 
                     track.coverUrl || 
                     track?.albumId?.coverImage?.medium || 
                     track?.albumId?.coverImage?.large || 
                     track?.albumId?.coverImage?.thumbnail || 
                     DEFAULT_IMAGE,
            audioUrl: track.audioUrl
        };

        // Si on a une liste de pistes et un index, on met à jour la queue
        if (options.tracks && typeof options.index === 'number') {
            const transformedTracks = options.tracks.map(t => {
                // S'assurer que artist est une chaîne de caractères pour chaque piste
                const artistStr = typeof t.artistId === 'object' && t.artistId?.name 
                    ? t.artistId.name 
                    : (typeof t.artist === 'object' && t.artist?.name 
                      ? t.artist.name 
                      : (typeof t.artist === 'string' 
                        ? t.artist 
                        : "Artiste inconnu"));

                // Déterminer l'URL de couverture pour chaque piste
                let trackCoverUrl = null;
                
                // Vérifier si l'URL directe de coverUrl est valide
                if (t.coverUrl && isValidExternalUrl(t.coverUrl)) {
                    trackCoverUrl = t.coverUrl;
                }
                // Vérifier l'objet albumId s'il existe
                else if (t.albumId && typeof t.albumId === 'object' && t.albumId.coverImage) {
                    // Si coverImage est une chaîne (URL directe)
                    if (typeof t.albumId.coverImage === 'string' && isValidExternalUrl(t.albumId.coverImage)) {
                        trackCoverUrl = t.albumId.coverImage;
                    }
                    // Si coverImage est un objet avec propriétés large/medium/thumbnail
                    else if (typeof t.albumId.coverImage === 'object') {
                        const albumCoverUrl = t.albumId.coverImage.large || 
                                           t.albumId.coverImage.medium || 
                                           t.albumId.coverImage.thumbnail;
                        
                        if (albumCoverUrl && isValidExternalUrl(albumCoverUrl)) {
                            trackCoverUrl = albumCoverUrl;
                        }
                    }
                }
                
                return {
                    ...t,
                    id: t._id || t.id,
                    title: t.title,
                    artist: artistStr,
                    coverUrl: trackCoverUrl || 
                            t.coverUrl || 
                            t?.albumId?.coverImage?.medium || 
                            t?.albumId?.coverImage?.large || 
                            t?.albumId?.coverImage?.thumbnail || 
                            DEFAULT_IMAGE,
                    audioUrl: t.audioUrl
                };
            });

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