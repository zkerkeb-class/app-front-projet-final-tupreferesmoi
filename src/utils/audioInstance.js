// Instance audio unique pour toute l'application
let globalAudio = null;

// Initialiser l'instance audio si elle n'existe pas
export const getAudioInstance = () => {
    if (typeof window === "undefined") return null;

    if (!globalAudio) {
        try {
            globalAudio = new Audio();
            globalAudio.preload = "auto";

            // Ajouter des gestionnaires d'erreurs
            globalAudio.addEventListener("error", (e) => {
                console.error("Erreur audio:", e);
            });

            // Empêcher le navigateur de mettre en pause automatiquement
            globalAudio.addEventListener("pause", () => {
                if (
                    globalAudio.currentTime > 0 &&
                    !globalAudio.ended &&
                    !globalAudio.paused
                ) {
                    globalAudio.play().catch(console.error);
                }
            });
        } catch (error) {
            console.error("Erreur lors de l'initialisation de l'audio:", error);
            return null;
        }
    }

    return globalAudio;
};

// Nettoyer l'instance audio
export const cleanupAudio = () => {
    if (globalAudio) {
        try {
            globalAudio.pause();
            globalAudio.currentTime = 0;
            globalAudio.src = "";
            globalAudio.load();
            globalAudio = null;
        } catch (error) {
            console.error("Erreur lors du nettoyage de l'audio:", error);
        }
    }
};
