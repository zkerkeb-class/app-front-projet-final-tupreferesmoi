// Album cover image utilities

/**
 * Vérifie si une URL est valide et externe (http/https)
 * @param {string} url - URL à vérifier
 * @returns {boolean} true si c'est une URL valide
 */
export const isValidExternalUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Extrait le nom de l'artiste d'un item (piste ou album)
 * @param {Object} item - Objet contenant les données de l'artiste
 * @returns {string|null} Nom de l'artiste ou null
 */
export const getArtistName = (item) => {
    // Format avec propriété artist qui est un objet
    if (item.artist && typeof item.artist === 'object' && item.artist.name) {
        return item.artist.name;
    }
    // Format avec artist comme chaîne directe
    else if (item.artist && typeof item.artist === 'string') {
        return item.artist;
    }
    // Format avec artistId comme objet
    else if (item.artistId && typeof item.artistId === 'object' && item.artistId.name) {
        return item.artistId.name;
    }
    // Format avec artistId comme chaîne
    else if (item.artistId && typeof item.artistId === 'string') {
        return item.artistId;
    }
    
    return null;
};

/**
 * Associe une URL d'image à un artiste connu
 * @param {string} artistName - Nom de l'artiste
 * @returns {string|null} URL de l'image si l'artiste est connu, sinon null
 */
export const getArtistImage = (artistName) => {
    if (!artistName) return null;
    
    const lowerName = artistName.toLowerCase();
    
    // Post Malone - SpiderVerse
    if (lowerName.includes('post malone')) {
        return "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg";
    }
    // NERD - No_One Ever Really Dies (par Asap Ferg)
    else if (lowerName.includes('asap ferg') || 
            lowerName.includes('nerd') || 
            lowerName.includes('n.e.r.d')) {
        return "https://m.media-amazon.com/images/I/71C8iOMGKNL._AC_UF1000,1000_QL80_.jpg";
    }
    
    return null;
};

/**
 * Vérifie et retourne l'image d'album appropriée
 * @param {Object} albumData - Données de l'album
 * @returns {Object|null} Objet contenant les URLs d'images ou null
 */
export const getAlbumCoverImage = (albumData) => {
    if (!albumData) return null;
    
    // Si l'album a déjà une coverImage valide, on la retourne
    if (albumData.coverImage) {
        // Si la coverImage est une URL externe valide
        if (typeof albumData.coverImage === 'string' && isValidExternalUrl(albumData.coverImage)) {
            return {
                thumbnail: albumData.coverImage,
                medium: albumData.coverImage,
                large: albumData.coverImage
            };
        }
        
        // Si la coverImage est un objet avec des URLs
        if (typeof albumData.coverImage === 'object') {
            const urls = [
                albumData.coverImage.large,
                albumData.coverImage.medium, 
                albumData.coverImage.thumbnail
            ];
            
            // Vérifier si l'une des URLs est externe
            for (const url of urls) {
                if (url && isValidExternalUrl(url)) {
                    return albumData.coverImage;
                }
            }
        }
    }
    
    // Vérifier l'ID de l'album pour les cas spéciaux
    if (albumData._id || albumData.id) {
        const albumId = albumData._id || albumData.id;
        
        // Cas spécial: SpiderVerse
        if (albumId === "679b61dd2ce9051781b345c") {
            const coverUrl = "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg";
            return {
                thumbnail: coverUrl,
                medium: coverUrl,
                large: coverUrl
            };
        }
        
        // Cas spécial: Demon Days
        if (albumId === "679b61a82ce90517819b344b") {
            const coverUrl = "https://static.fnac-static.com/multimedia/images_produits/ZoomPE/6/2/8/0094631168826/tsp20130828084740/Demon-days.jpg";
            return {
                thumbnail: coverUrl,
                medium: coverUrl,
                large: coverUrl
            };
        }
    }
    
    // Vérifier l'artiste
    const artistName = getArtistName(albumData);
    if (artistName) {
        const artistImage = getArtistImage(artistName);
        if (artistImage) {
            return {
                thumbnail: artistImage,
                medium: artistImage,
                large: artistImage
            };
        }
    }
    
    // Vérifier par titre (pour les cas comme "SpiderVerse")
    if (albumData.title) {
        if (albumData.title.toLowerCase().includes('spiderverse') || 
            albumData.title.toLowerCase().includes('spider-verse') || 
            albumData.title.toLowerCase().includes('spider verse')) {
            const coverUrl = "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg";
            return {
                thumbnail: coverUrl,
                medium: coverUrl,
                large: coverUrl
            };
        }
    }
    
    // Aucune image valide trouvée
    return null;
};

/**
 * Extrait l'URL d'image appropriée d'un objet coverImage
 * @param {Object|string} coverImage - Objet coverImage ou URL directe
 * @param {string} type - Type d'image souhaité (large, medium ou thumbnail)
 * @returns {string|null} URL de l'image ou null
 */
export const getImageUrl = (coverImage, type = 'large') => {
    if (!coverImage) return null;
    
    // Si coverImage est directement une chaîne de caractères (URL brute)
    if (typeof coverImage === 'string') {
        return coverImage;
    }
    
    // Si c'est un objet coverImage avec propriétés large/medium/thumbnail
    if (coverImage[type]) {
        return coverImage[type];
    }
    
    // Fallback en ordre de préférence
    return coverImage.large || coverImage.medium || coverImage.thumbnail || null;
};

/**
 * Récupère l'URL d'image spéciale pour un album donné - Maintenue pour compatibilité
 * @deprecated Utilisez plutôt getImageUrl
 * @param {string} albumId - Identifiant de l'album
 * @returns {string|null} URL de l'image si disponible, sinon null
 */
export const getSpecialAlbumCoverUrl = (albumId) => {
    // Albums connus
    if (albumId === "679b61dd2ce9051781b345c") {
        return "https://i1.sndcdn.com/artworks-Q5GUrsDbUhR7-0-t500x500.jpg"; // SpiderVerse
    }
    if (albumId === "679b61a82ce90517819b344b") {
        return "https://static.fnac-static.com/multimedia/images_produits/ZoomPE/6/2/8/0094631168826/tsp20130828084740/Demon-days.jpg"; // Demon Days
    }
    return null;
}; 