import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
    mode: "normal", // 'normal', 'repeat', 'shuffle'
    queue: [],
};

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        setProgress: (state, action) => {
            state.progress = action.payload;
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
        setQueue: (state, action) => {
            state.queue = action.payload;
        },
        addToQueue: (state, action) => {
            state.queue.push(action.payload);
        },
    },
});

export const {
    setCurrentTrack,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    setMode,
    setQueue,
    addToQueue,
} = playerSlice.actions;

export default playerSlice.reducer;
