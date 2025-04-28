/**
 * Formate un nombre de secondes en chaîne de caractères au format "mm:ss"
 * @param {number} seconds - Le nombre de secondes à formater
 * @returns {string} Le temps formaté (ex: "3:45")
 */
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
