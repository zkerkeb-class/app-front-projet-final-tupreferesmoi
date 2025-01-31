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
} from "react-feather";
import { ControlsContainer } from "../styles/playbackControls.styles";
import { ProgressBar, TimeDisplay } from "../../../styles/common/controls";
import { IconButton } from "../../../components/common";
import { formatTime } from "../../../utils/formatTime";
import { useDispatch, useSelector } from "react-redux";

export const PlaybackControls = () => {
    const dispatch = useDispatch();
    const { isPlaying } = useSelector((state) => state.player);
    const {
        mode = "normal",
        progress = 0,
        currentTime = 0,
        duration = 0,
    } = useSelector((state) => state.player);

    return (
        <ControlsContainer disabled={false}>
            <div className="control-buttons">
                <IconButton
                    onClick={() => dispatch({ type: "player/toggleMode" })}
                    disabled={false}
                    $active={mode !== "normal"}
                    title={
                        mode === "shuffle"
                            ? "Mode aléatoire"
                            : "Mode répétition"
                    }
                >
                    {mode === "shuffle" ? <Shuffle /> : <Repeat />}
                </IconButton>
                <IconButton
                    onClick={() => dispatch({ type: "player/skipToStart" })}
                    disabled={false}
                    title="Précédent"
                >
                    <SkipBack />
                </IconButton>
                <IconButton
                    variant="primary"
                    onClick={() => dispatch({ type: "player/togglePlay" })}
                    disabled={false}
                    size="large"
                    title={isPlaying ? "Pause" : "Lecture"}
                >
                    {isPlaying ? <Pause /> : <Play />}
                </IconButton>
                <IconButton
                    onClick={() => dispatch({ type: "player/skipToEnd" })}
                    disabled={false}
                    title="Suivant"
                >
                    <SkipForward />
                </IconButton>
                <IconButton
                    onClick={() =>
                        dispatch({ type: "player/toggleFullscreen" })
                    }
                    disabled={false}
                    title="Plein écran"
                >
                    <Maximize />
                </IconButton>
            </div>
            <div className="progress-container">
                <ProgressBar
                    type="range"
                    value={Number(progress) || 0}
                    onChange={(e) =>
                        dispatch({
                            type: "player/progressChange",
                            payload: e.target.value,
                        })
                    }
                    min={0}
                    max={100}
                    disabled={false}
                />
                <TimeDisplay>
                    <span>{formatTime(currentTime || 0)}</span>
                    <span>{formatTime(duration || 0)}</span>
                </TimeDisplay>
            </div>
        </ControlsContainer>
    );
};

PlaybackControls.propTypes = {
    isPlaying: PropTypes.bool,
    currentTrack: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        artist: PropTypes.string,
        coverUrl: PropTypes.string,
        audioUrl: PropTypes.string,
    }),
    mode: PropTypes.oneOf(["normal", "repeat", "shuffle"]),
    progress: PropTypes.number,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    onTogglePlay: PropTypes.func.isRequired,
    onSkipToStart: PropTypes.func.isRequired,
    onSkipToEnd: PropTypes.func.isRequired,
    onToggleMode: PropTypes.func.isRequired,
    onToggleFullscreen: PropTypes.func.isRequired,
    onProgressChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default PlaybackControls;
