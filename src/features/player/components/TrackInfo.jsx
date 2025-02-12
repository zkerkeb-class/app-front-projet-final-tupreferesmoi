import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { TrackInfoContainer } from "../styles/trackInfo.styles";
import { DEFAULT_IMAGE } from "../constants";

export const TrackInfo = ({ track, className = "" }) => {
    if (!track) return null;

    const { title, artist, coverUrl } = track;
    const [titleOverflows, setTitleOverflows] = useState(false);
    const [artistOverflows, setArtistOverflows] = useState(false);
    const titleRef = useRef(null);
    const artistRef = useRef(null);

    useEffect(() => {
        const checkOverflow = (element) => {
            return element ? element.scrollWidth > element.clientWidth : false;
        };

        setTitleOverflows(checkOverflow(titleRef.current));
        setArtistOverflows(checkOverflow(artistRef.current));
    }, [title, artist]);

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
                <div className="title" title={title} ref={titleRef}>
                    <span className={titleOverflows ? "animate" : ""}>
                        {title}
                    </span>
                </div>
                <div className="artist" title={artist} ref={artistRef}>
                    <span className={artistOverflows ? "animate" : ""}>
                        {artist}
                    </span>
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
