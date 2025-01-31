import React from "react";
import Image from "next/image";
import { TrackInfoContainer } from "../styles/trackInfo.styles";
import { DEFAULT_IMAGE } from "../constants";

export const TrackInfo = ({ track }) => {
    if (!track) return null;

    return (
        <TrackInfoContainer>
            <Image
                src={track.coverUrl || DEFAULT_IMAGE}
                alt={track.title}
                width={56}
                height={56}
                style={{ objectFit: "cover" }}
            />
            <div className="track-text">
                <div className="title">{track.title}</div>
                <div className="artist">{track.artist}</div>
            </div>
        </TrackInfoContainer>
    );
};
