import { useState, useEffect, useCallback } from "react";
import { CONTROLS_HIDE_DELAY } from "../constants";

export const useFullscreenPlayer = () => {
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [mouseTimeout, setMouseTimeout] = useState(null);

    const handleExitFullscreen = useCallback(() => {
        setShowFullscreen(false);
        setShowControls(true);
        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }
    }, [mouseTimeout]);

    useEffect(() => {
        return () => {
            if (mouseTimeout) {
                clearTimeout(mouseTimeout);
            }
        };
    }, [mouseTimeout]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && showFullscreen) {
                handleExitFullscreen();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showFullscreen, handleExitFullscreen]);

    const handleMouseMove = () => {
        setShowControls(true);

        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }

        if (showFullscreen) {
            const timeout = setTimeout(() => {
                setShowControls(false);
            }, CONTROLS_HIDE_DELAY);
            setMouseTimeout(timeout);
        }
    };

    const toggleFullscreen = () => {
        if (showFullscreen) {
            handleExitFullscreen();
        } else {
            setShowFullscreen(true);
            setShowControls(true);
        }
    };

    return {
        showFullscreen,
        showControls,
        handleMouseMove,
        toggleFullscreen,
    };
};
