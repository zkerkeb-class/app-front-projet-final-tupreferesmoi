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
        document.body.style.cursor = "default";
    }, [mouseTimeout]);

    useEffect(() => {
        return () => {
            if (mouseTimeout) {
                clearTimeout(mouseTimeout);
            }
            document.body.style.cursor = "default";
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
        document.body.style.cursor = "default";

        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }

        if (showFullscreen) {
            const timeout = setTimeout(() => {
                setShowControls(false);
                document.body.style.cursor = "none";
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
            document.body.style.cursor = "default";
        }
    };

    return {
        showFullscreen,
        showControls,
        handleMouseMove,
        toggleFullscreen,
    };
};
