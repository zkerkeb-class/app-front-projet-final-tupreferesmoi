// Composants principaux
export { default as AudioPlayer } from "./AudioPlayer";
export { TrackInfo } from "./components/TrackInfo";
export { PlaybackControls } from "./components/PlaybackControls";
export { VolumeControl } from "./components/VolumeControl";
export { FullscreenPlayer } from "./components/FullscreenPlayer";

// Hooks
export { useAudioPlayer } from "./hooks/useAudioPlayer";
export { useFullscreenPlayer } from "./hooks/useFullscreenPlayer";

// Constants
export { PLAYER_MODES, DEFAULT_IMAGE } from "./constants";
