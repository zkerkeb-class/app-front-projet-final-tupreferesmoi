import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: 1,
    progress: 0,
    mode: "normal",
    currentTrackIndex: -1,
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
        },
        setCurrentTrackIndex: (state, action) => {
            state.currentTrackIndex = action.payload;
        },
        playNext: (state) => {
            if (state.currentTrackIndex < state.queue.length - 1) {
                state.currentTrackIndex += 1;
                state.currentTrack = state.queue[state.currentTrackIndex];
            } else {
                state.isPlaying = false;
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
    addToQueue,
    removeFromQueue,
    clearQueue,
    setCurrentTrackIndex,
    playNext,
    playPrevious,
} = playerSlice.actions;

export default playerSlice.reducer;
