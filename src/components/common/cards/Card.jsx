import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { CardContainer, ImageWrapper, Content } from "./styles/Card.styles";
import { PlayButton } from "@/components/common/buttons/PlayButton";

const MemoizedImage = memo(({ src, alt, type }) => (
    <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        style={{
            objectFit: type === "artist" ? "cover" : "contain",
        }}
    />
));

MemoizedImage.displayName = 'MemoizedImage';

MemoizedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["album", "artist", "playlist"]).isRequired,
};

/**
 * Card réutilisable pour les albums, artistes et playlists
 * @example
 * <Card
 *   title="Album Name"
 *   subtitle="Artist Name"
 *   imageUrl="/album-cover.jpg"
 *   type="album"
 *   onClick={() => {}}
 *   onPlay={() => {}}
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
    type: PropTypes.oneOf(["album", "artist", "playlist"]).isRequired,
    /** Fonction appelée au clic sur la card */
    onClick: PropTypes.func,
    /** Fonction appelée au clic sur le bouton play */
    onPlay: PropTypes.func,
    /** Indique si l'élément est en cours de lecture */
    isPlaying: PropTypes.bool,
    /** Classes CSS additionnelles */
    className: PropTypes.string,
};

export default Card;
