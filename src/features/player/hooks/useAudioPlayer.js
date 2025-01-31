import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setIsPlaying,
    setProgress,
    setVolume,
    playNext,
    playPrevious,
} from "../../../store/slices/playerSlice";
import { getAudioInstance } from "../../../utils/audioInstance";
import { SKIP_THRESHOLD, FORWARD_SKIP_TIME } from "../constants";

export const useAudioPlayer = () => {
    const dispatch = useDispatch();
    const { currentTrack, isPlaying, volume, mode, queue, currentTrackIndex } =
        useSelector((state) => state.player);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    // Init audio et gestion des événements
    useEffect(() => {
        const audio = getAudioInstance();
        if (!audio) return;

        audio.volume = volume;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            dispatch(setProgress((audio.currentTime / audio.duration) * 100));
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            if (mode === "repeat") {
                audio.currentTime = 0;
                audio.play();
            } else if (
                queue.length > 0 &&
                currentTrackIndex < queue.length - 1
            ) {
                dispatch(playNext());
            } else {
                dispatch(setIsPlaying(false));
                setCurrentTime(0);
                dispatch(setProgress(0));
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [dispatch, volume, mode, queue, currentTrackIndex]);

    // Gestion du changement de piste
    useEffect(() => {
        const audio = getAudioInstance();
        if (!audio || !currentTrack?.audioUrl) return;
        if (audio.src === currentTrack.audioUrl) return;

        audio.pause();
        audio.currentTime = 0;
        audio.src = currentTrack.audioUrl;
        audio.load();

        if (isPlaying) {
            audio.play().catch(() => dispatch(setIsPlaying(false)));
        }
    }, [currentTrack?.audioUrl, isPlaying, dispatch]);

    // Gestion du play/pause
    useEffect(() => {
        const audio = getAudioInstance();
        if (!audio) return;

        if (isPlaying && audio.paused) {
            audio.play().catch(() => dispatch(setIsPlaying(false)));
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }, [isPlaying, dispatch]);

    const handleProgressChange = (e) => {
        const audio = getAudioInstance();
        if (!audio) return;

        const value = Number(e.target.value) || 0;
        const newTime = (value / 100) * audio.duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
        dispatch(setProgress(value));
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value) / 100 || 0;
        dispatch(setVolume(newVolume));
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            dispatch(setVolume(1));
            setIsMuted(false);
        } else {
            dispatch(setVolume(0));
            setIsMuted(true);
        }
    };

    const handleSkipToStart = () => {
        const audio = getAudioInstance();
        if (!audio) return;

        if (currentTime <= SKIP_THRESHOLD && currentTrackIndex > 0) {
            dispatch(playPrevious());
        } else {
            audio.currentTime = 0;
            setCurrentTime(0);
            dispatch(setProgress(0));
        }
    };

    const handleSkipToEnd = () => {
        const audio = getAudioInstance();
        if (!audio) return;

        if (
            duration - currentTime <= SKIP_THRESHOLD &&
            currentTrackIndex < queue.length - 1
        ) {
            dispatch(playNext());
        } else {
            const newTime = Math.min(currentTime + FORWARD_SKIP_TIME, duration);
            audio.currentTime = newTime;
            setCurrentTime(newTime);
            dispatch(setProgress((newTime / duration) * 100));
        }
    };

    return {
        duration,
        currentTime,
        isMuted,
        handleProgressChange,
        handleVolumeChange,
        toggleMute,
        handleSkipToStart,
        handleSkipToEnd,
    };
};
