import { useState, useEffect } from "react";
import { CONTROLS_HIDE_DELAY } from "../constants";

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
                setShowControls(true);
                document.body.style.cursor = "default";
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

        if (showFullscreen) {
            const timeout = setTimeout(() => {
                setShowControls(false);
                document.body.style.cursor = "none";
            }, CONTROLS_HIDE_DELAY);
            setMouseTimeout(timeout);
        }
    };

    const toggleFullscreen = () => {
        const newShowFullscreen = !showFullscreen;
        setShowFullscreen(newShowFullscreen);
        setShowControls(true);
        document.body.style.cursor = "default";

        if (!newShowFullscreen) {
            if (mouseTimeout) {
                clearTimeout(mouseTimeout);
            }
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
