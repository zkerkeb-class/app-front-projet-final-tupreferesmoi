import React from "react";
import PropTypes from "prop-types";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Maximize,
    Minimize,
} from "react-feather";
import { useTranslation } from "react-i18next";
import { ControlsContainer } from "../styles/playbackControls.styles";
import { ProgressBar, TimeDisplay } from "../../../styles/common/controls";
import { IconButton } from "../../../components/common";
import { formatTime } from "../../../utils/formatTime";
import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setMode, setShuffleMode, playNext } from "../../../store/slices/playerSlice";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { PLAYER_MODES } from "../constants";

export const PlaybackControls = ({ disabled, onToggleFullscreen, isFullscreen }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { 
        isPlaying, 
        mode, 
        shuffleEnabled, 
        progress, 
        currentTime, 
        duration, 
        currentTrack, 
        queue,
        currentTrackIndex 
    } = useSelector((state) => state.player);
    const { handleProgressChange, handleSkipToStart, handleSkipToEnd } = useAudioPlayer();

    const handleTogglePlay = () => {
        if (!currentTrack) return;
        dispatch(setIsPlaying(!isPlaying));
    };

    const handleToggleMode = () => {
        if (!currentTrack) return;
        const modes = [
            PLAYER_MODES.NORMAL,
            PLAYER_MODES.REPEAT,
            PLAYER_MODES.REPEAT_ONE,
        ];
        const currentIndex =
            modes.indexOf(mode) !== -1 ? modes.indexOf(mode) : 0;
        const nextMode = modes[(currentIndex + 1) % modes.length];
        dispatch(setMode(nextMode));
    };

    const handleToggleShuffle = () => {
        if (!currentTrack || !queue || queue.length <= 1) return;
        dispatch(setShuffleMode(!shuffleEnabled));
    };

    const handleSkipToNext = () => {
        if (!currentTrack) return;
        
        // S'il y a une prochaine chanson, on la joue
        if (currentTrackIndex < queue.length - 1) {
            dispatch(playNext());
        }
        // Si on est en mode répétition et qu'on est à la fin de la queue
        else if (mode === PLAYER_MODES.REPEAT && queue.length > 0) {
            dispatch(playNext());
        }
    };

    const getRepeatIcon = () => {
        if (mode === PLAYER_MODES.REPEAT_ONE) {
            return (
                <div style={{ 
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Repeat />
                    <span style={{
                        position: 'absolute',
                        bottom: -2,
                        right: -4,
                        fontSize: '10px',
                        fontWeight: 'bold',
                        lineHeight: 1
                    }}>1</span>
                </div>
            );
        }
        return <Repeat />;
    };

    const getModeTitle = () => {
        switch (mode) {
            case PLAYER_MODES.REPEAT_ONE:
                return t('player.repeatModes.repeatOne');
            case PLAYER_MODES.REPEAT:
                return t('player.repeatModes.repeat');
            default:
                return t('player.repeatModes.normal');
        }
    };

    const showShuffleButton = queue && queue.length > 1;

    return (
        <ControlsContainer disabled={disabled}>
            <div className="control-buttons">
                <div className="main-controls">
                    {showShuffleButton && (
                        <IconButton
                            onClick={handleToggleShuffle}
                            disabled={disabled || !queue || queue.length <= 1}
                            $active={shuffleEnabled}
                            title={t('player.shuffle')}
                        >
                            <Shuffle />
                        </IconButton>
                    )}
                    <IconButton
                        onClick={handleToggleMode}
                        disabled={disabled}
                        $active={mode !== PLAYER_MODES.NORMAL}
                        title={getModeTitle()}
                    >
                        {getRepeatIcon()}
                    </IconButton>
                    <IconButton
                        onClick={handleSkipToStart}
                        disabled={disabled || currentTrackIndex === 0}
                        title={t('player.previous')}
                    >
                        <SkipBack />
                    </IconButton>
                    <IconButton
                        variant="primary"
                        onClick={handleTogglePlay}
                        disabled={disabled}
                        size="large"
                        title={isPlaying ? t('player.pause') : t('player.play')}
                    >
                        {isPlaying ? <Pause /> : <Play />}
                    </IconButton>
                    <IconButton
                        onClick={handleSkipToNext}
                        disabled={disabled || currentTrackIndex === queue?.length - 1}
                        title={t('player.next')}
                    >
                        <SkipForward />
                    </IconButton>
                    {onToggleFullscreen && (
                        <IconButton
                            onClick={onToggleFullscreen}
                            disabled={disabled}
                            title={isFullscreen ? t('player.exitFullscreen') : t('player.fullscreen')}
                        >
                            {isFullscreen ? <Minimize /> : <Maximize />}
                        </IconButton>
                    )}
                </div>
            </div>
            <div className="progress-container">
                <ProgressBar
                    type="range"
                    value={Number(progress) || 0}
                    onChange={handleProgressChange}
                    min={0}
                    max={100}
                    disabled={disabled}
                />
                <TimeDisplay>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </TimeDisplay>
            </div>
        </ControlsContainer>
    );
};

PlaybackControls.propTypes = {
    disabled: PropTypes.bool,
    onToggleFullscreen: PropTypes.func.isRequired,
    isFullscreen: PropTypes.bool,
};

export default PlaybackControls;
