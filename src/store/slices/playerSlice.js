import { createSlice } from "@reduxjs/toolkit";
import { VOLUME_STORAGE_KEY } from "@features/player/constants";

// Récupérer le volume sauvegardé ou utiliser la valeur par défaut
const getInitialVolume = () => {
    if (typeof window === "undefined") return 1;
    const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
    return savedVolume !== null ? parseFloat(savedVolume) : 1;
};

const initialState = {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: getInitialVolume(),
    progress: 0,
    mode: "normal", // "normal" | "repeat" | "repeat-one"
    shuffleEnabled: false,
    currentTrackIndex: -1,
    currentTime: 0,
    duration: 0,
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setQueue: (state, action) => {
            state.queue = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        setProgress: (state, action) => {
            state.progress = action.payload;
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        setShuffleMode: (state, action) => {
            state.shuffleEnabled = action.payload;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
        addToQueue: (state, action) => {
            state.queue.push(action.payload);
        },
        removeFromQueue: (state, action) => {
            state.queue = state.queue.filter(
                (track) => track.id !== action.payload
            );
        },
        clearQueue: (state) => {
            state.queue = [];
            state.currentTrackIndex = -1;
            state.currentTrack = null;
            state.isPlaying = false;
            state.currentTime = 0;
            state.duration = 0;
            state.progress = 0;
        },
        setCurrentTrackIndex: (state, action) => {
            state.currentTrackIndex = action.payload;
            if (action.payload >= 0 && action.payload < state.queue.length) {
                state.currentTrack = state.queue[action.payload];
            }
        },
        playNext: (state) => {
            if (state.shuffleEnabled && state.queue.length > 1) {
                const availableIndices = state.queue
                    .map((_, index) => index)
                    .filter((index) => index !== state.currentTrackIndex);
                if (availableIndices.length > 0) {
                    const randomIndex = Math.floor(
                        Math.random() * availableIndices.length
                    );
                    state.currentTrackIndex = availableIndices[randomIndex];
                    state.currentTrack = state.queue[state.currentTrackIndex];
                }
            } else if (state.currentTrackIndex < state.queue.length - 1) {
                state.currentTrackIndex += 1;
                state.currentTrack = state.queue[state.currentTrackIndex];
            } else if (state.queue.length > 1) {
                state.currentTrackIndex = 0;
                state.currentTrack = state.queue[0];
            }
        },
        playPrevious: (state) => {
            if (state.currentTrackIndex > 0) {
                state.currentTrackIndex -= 1;
                state.currentTrack = state.queue[state.currentTrackIndex];
            }
        },
    },
});

export const {
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    setVolume,
    setProgress,
    setMode,
    setShuffleMode,
    setCurrentTime,
    setDuration,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setCurrentTrackIndex,
    playNext,
    playPrevious,
} = playerSlice.actions;

export default playerSlice.reducer;
