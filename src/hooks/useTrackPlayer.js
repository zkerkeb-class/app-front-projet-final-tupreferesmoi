import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "../store/slices/playerSlice";
import { musicApi } from "../services/musicApi";
import { useEffect, useRef } from "react";

const DEFAULT_IMAGE = "/logo192.png";

export const useTrackPlayer = () => {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const handleEnded = () => {
            dispatch(setIsPlaying(false));
        };

        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            if (audio.src) {
                URL.revokeObjectURL(audio.src);
            }
        };
    }, [dispatch]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error("Erreur lors de la lecture:", error);
                    if (
                        error.name !== "NotAllowedError" &&
                        error.name !== "NotSupportedError"
                    ) {
                        dispatch(setIsPlaying(false));
                    }
                });
            }
        } else {
            audio.pause();
        }
    }, [isPlaying, dispatch]);

    const handlePlayTrack = async (track) => {
        try {
            if (currentTrack?.id === track.id) {
                dispatch(setIsPlaying(!isPlaying));
                return;
            }

            // Nettoyer l'ancien URL si elle existe
            if (audioRef.current?.src) {
                audioRef.current.pause();
                URL.revokeObjectURL(audioRef.current.src);
            }

            let audioUrl;
            if (track.audioUrl) {
                // Utiliser directement l'URL signée si disponible
                console.log(
                    "Utilisation de l'URL audio signée:",
                    track.audioUrl
                );
                audioUrl = track.audioUrl;
                audioRef.current.src = audioUrl;

                // Attendre que l'audio soit chargé avant de jouer
                await new Promise((resolve, reject) => {
                    const handleLoad = () => {
                        audioRef.current.removeEventListener(
                            "loadeddata",
                            handleLoad
                        );
                        audioRef.current.removeEventListener(
                            "error",
                            handleError
                        );
                        resolve();
                    };

                    const handleError = (error) => {
                        audioRef.current.removeEventListener(
                            "loadeddata",
                            handleLoad
                        );
                        audioRef.current.removeEventListener(
                            "error",
                            handleError
                        );
                        reject(error);
                    };

                    audioRef.current.addEventListener("loadeddata", handleLoad);
                    audioRef.current.addEventListener("error", handleError);
                });
            } else {
                // Sinon, récupérer le stream
                console.log("Récupération du stream pour la piste:", track.id);
                const response = await musicApi.getTrackStream(track.id);
                if (!response?.data) {
                    throw new Error("Impossible de récupérer le stream audio");
                }
                audioUrl = URL.createObjectURL(response.data);
                audioRef.current.src = audioUrl;
            }

            const trackData = {
                id: track.id,
                title: track.title,
                artist: track.artist,
                album: track.album,
                coverUrl: track.coverUrl || DEFAULT_IMAGE,
                audioUrl: audioUrl,
            };

            dispatch(setCurrentTrack(trackData));
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.error("Erreur lors de la lecture de la piste:", error);
            dispatch(setIsPlaying(false));
            // Ne pas relancer la lecture en cas d'erreur
        }
    };

    return {
        currentTrack,
        isPlaying,
        handlePlayTrack,
    };
};
