import { useDispatch, useSelector } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "@/store/slices/playerSlice";
import { musicApi } from "@/services/musicApi";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_IMAGE } from "@/features/player/constants";

export const useTrackPlayer = () => {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying } = useSelector((state) => state.player);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.volume = volume;
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleDurationChange = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            dispatch(setIsPlaying(false));
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("durationchange", handleDurationChange);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("durationchange", handleDurationChange);
            audio.removeEventListener("ended", handleEnded);
            if (audio.src) {
                URL.revokeObjectURL(audio.src);
            }
        };
    }, [dispatch, volume]);

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

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [audioRef, volume]);

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

            // Récupérer les données de la piste avec l'URL audio signée
            const response = await musicApi.getTrack(track.id);
            if (!response?.data?.audioUrl) {
                throw new Error("Impossible de récupérer l'URL audio");
            }

            audioRef.current.src = response.data.audioUrl;

            // Attendre que l'audio soit chargé avant de jouer
            await new Promise((resolve, reject) => {
                const handleLoad = () => {
                    audioRef.current.removeEventListener(
                        "loadeddata",
                        handleLoad
                    );
                    audioRef.current.removeEventListener("error", handleError);
                    resolve();
                };

                const handleError = (error) => {
                    audioRef.current.removeEventListener(
                        "loadeddata",
                        handleLoad
                    );
                    audioRef.current.removeEventListener("error", handleError);
                    reject(error);
                };

                audioRef.current.addEventListener("loadeddata", handleLoad);
                audioRef.current.addEventListener("error", handleError);
            });

            const trackData = {
                id: track.id,
                title: track.title,
                artist: typeof track.artist === 'object' ? track.artist.name : track.artist,
                album: track.album,
                coverUrl: track.coverUrl || DEFAULT_IMAGE,
                audioUrl: response.data.audioUrl,
            };

            dispatch(setCurrentTrack(trackData));
            dispatch(setIsPlaying(true));
        } catch (error) {
            console.error("Erreur lors de la lecture de la piste:", error);
            dispatch(setIsPlaying(false));
        }
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * audio.duration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        const newVolume = volume === 0 ? 1 : 0;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const skipToStart = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    const skipToEnd = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = audioRef.current.duration;
        }
    };

    return {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        handlePlayTrack,
        handleSeek,
        handleVolumeChange,
        toggleMute,
        skipToStart,
        skipToEnd,
    };
};
