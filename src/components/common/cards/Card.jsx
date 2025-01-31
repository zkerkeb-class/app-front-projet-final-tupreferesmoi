import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { CardContainer, ImageWrapper, Content } from "./styles/Card.styles";
import { IconButton } from "../buttons/IconButton";
import { Play } from "react-feather";

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
export const Card = ({
    title,
    subtitle = "",
    imageUrl,
    type,
    onClick,
    onPlay,
    isPlaying = false,
    className = "",
}) => {
    const handlePlayClick = (e) => {
        e.stopPropagation();
        onPlay?.();
    };

    return (
        <CardContainer onClick={onClick} className={className}>
            <ImageWrapper $type={type}>
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                        objectFit: type === "artist" ? "cover" : "contain",
                    }}
                />
                {onPlay && (
                    <div className="play-button">
                        <IconButton
                            variant="primary"
                            size="large"
                            onClick={handlePlayClick}
                            title={isPlaying ? "En lecture" : "Lecture"}
                        >
                            <Play />
                        </IconButton>
                    </div>
                )}
            </ImageWrapper>
            <Content>
                <h3>{title}</h3>
                {subtitle && <p>{subtitle}</p>}
            </Content>
        </CardContainer>
    );
};

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
