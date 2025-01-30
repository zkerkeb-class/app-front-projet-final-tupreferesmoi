// Instance audio unique pour toute l'application
let globalAudio = null;

// Initialiser l'instance audio si elle n'existe pas
export const getAudioInstance = () => {
    if (typeof window === "undefined") return null;

    if (!globalAudio) {
        globalAudio = new Audio();
        globalAudio.preload = "auto";
    }

    return globalAudio;
};

// Nettoyer l'instance audio
export const cleanupAudio = () => {
    if (globalAudio) {
        globalAudio.pause();
        globalAudio.src = "";
        globalAudio = null;
    }
};
