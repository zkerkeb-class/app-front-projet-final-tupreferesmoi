import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { CardContainer, ImageWrapper, Content } from "./styles/Card.styles";
import { PlayButton } from "@/components/common/buttons/PlayButton";

const MemoizedImage = memo(({ src, alt, type, priority = false }) => (
    <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 400px) 140px, (max-width: 680px) 160px, (max-width: 1200px) 180px, 200px"
        loading={priority ? "eager" : "lazy"}
        quality={85}
        style={{
            objectFit: type === "artist" ? "cover" : "contain",
            transition: "transform 0.3s ease",
        }}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QjhAOEA4Qi4tMkYyLlFUUVRAR0BXUFNMUE1HUVf/2wBDAR"
    />
));

MemoizedImage.displayName = 'MemoizedImage';

MemoizedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["album", "artist", "playlist", "track"]).isRequired,
    priority: PropTypes.bool,
};

/**
 * Card réutilisable pour les albums, artistes et playlists
 * Optimisée pour les performances avec:
 * - Lazy loading intelligent
 * - Optimisation des images
 * - Placeholder pendant le chargement
 * - Animation fluide
 * @example
 * <Card
 *   title="Album Name"
 *   subtitle="Artist Name"
 *   imageUrl="/album-cover.jpg"
 *   type="album"
 *   onClick={() => {}}
 *   onPlay={() => {}}
 *   priority={true}
 * />
 */
const Card = memo(({
    title,
    subtitle = "",
    imageUrl,
    type,
    onClick,
    onPlay,
    isPlaying = false,
    className = "",
    priority = false,
}) => {
    const handlePlayClick = useCallback((e) => {
        e.stopPropagation();
        onPlay?.();
    }, [onPlay]);

    return (
        <CardContainer onClick={onClick} className={className}>
            <ImageWrapper $type={type}>
                <MemoizedImage
                    src={imageUrl}
                    alt={title}
                    type={type}
                    priority={priority}
                />
                {onPlay && (
                    <div className="play-button">
                        <PlayButton
                            onClick={handlePlayClick}
                            isPlaying={isPlaying}
                        />
                    </div>
                )}
            </ImageWrapper>
            <Content>
                <h3>{title}</h3>
                {subtitle && <p>{subtitle}</p>}
            </Content>
        </CardContainer>
    );
});

Card.displayName = 'Card';

Card.propTypes = {
    /** Titre de la card */
    title: PropTypes.string.isRequired,
    /** Sous-titre (artiste pour un album, description pour une playlist) */
    subtitle: PropTypes.string,
    /** URL de l'image */
    imageUrl: PropTypes.string.isRequired,
    /** Type de card */
    type: PropTypes.oneOf(["album", "artist", "playlist", "track"]).isRequired,
    /** Fonction appelée au clic sur la card */
    onClick: PropTypes.func,
    /** Fonction appelée au clic sur le bouton play */
    onPlay: PropTypes.func,
    /** Indique si l'élément est en cours de lecture */
    isPlaying: PropTypes.bool,
    /** Classes CSS additionnelles */
    className: PropTypes.string,
    /** Indique si l'image doit être chargée en priorité */
    priority: PropTypes.bool,
};

export default Card;
