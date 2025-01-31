import { useState, useEffect } from "react";
import { CONTROLS_HIDE_DELAY } from "../components/player/constants";

export const useFullscreenPlayer = () => {
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [mouseTimeout, setMouseTimeout] = useState(null);

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
                setShowFullscreen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showFullscreen]);

    const handleMouseMove = () => {
        setShowControls(true);
        document.body.style.cursor = "default";

        if (mouseTimeout) {
            clearTimeout(mouseTimeout);
        }

        const timeout = setTimeout(() => {
            if (showFullscreen) {
                setShowControls(false);
                document.body.style.cursor = "none";
            }
        }, CONTROLS_HIDE_DELAY);

        setMouseTimeout(timeout);
    };

    const toggleFullscreen = () => {
        setShowFullscreen(!showFullscreen);
        setShowControls(true);
    };

    return {
        showFullscreen,
        showControls,
        handleMouseMove,
        toggleFullscreen,
    };
};
