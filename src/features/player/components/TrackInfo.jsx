import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { TrackInfoContainer } from "../styles/trackInfo.styles";
import { DEFAULT_IMAGE } from "../constants";

export const TrackInfo = ({ track, className = "" }) => {
    if (!track) return null;

    const { title, artist, coverUrl } = track;

    return (
        <TrackInfoContainer className={className}>
            <Image
                src={coverUrl || DEFAULT_IMAGE}
                alt={title}
                width={56}
                height={56}
                style={{ objectFit: "cover" }}
                priority
            />
            <div className="track-text">
                <div className="title" title={title}>
                    {title}
                </div>
                <div className="artist" title={artist}>
                    {artist}
                </div>
            </div>
        </TrackInfoContainer>
    );
};

TrackInfo.propTypes = {
    track: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        coverUrl: PropTypes.string,
        audioUrl: PropTypes.string,
    }),
    className: PropTypes.string,
};

export default TrackInfo;
