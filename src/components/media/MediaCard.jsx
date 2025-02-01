"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Play } from "react-feather";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "@store/slices/playerSlice";

const Card = styled.div`
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing.sm};
    width: 200px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    background: transparent;

    &:hover {
        background: rgba(255, 255, 255, 0.1);

        .play-button {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ type }) => (type === "artist" ? "50%" : "4px")};
    overflow: hidden;

    img {
        object-fit: cover !important;
        transition: all 0.3s ease;
    }
`;

const PlayButton = styled.button`
    position: absolute;
    bottom: 85px;
    right: 20px;
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.3s ease;
    color: ${({ theme }) => theme.colors.text};
    z-index: 1;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

    &:hover {
        transform: scale(1.1) translateY(0);
        background: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const Content = styled.div`
    text-align: ${({ type }) => (type === "artist" ? "center" : "left")};
`;

const Title = styled.h3`
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Description = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DEFAULT_IMAGE =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyQTJBMkEiLz48cGF0aCBkPSJNOTAgODBIMTEwQzExNS41MjMgODAgMTIwIDg0LjQ3NzIgMTIwIDkwVjExMEMxMjAgMTE1LjUyMyAxMTUuNTIzIDEyMCAxMTAgMTIwSDkwQzg0LjQ3NzIgMTIwIDgwIDExNS41MjMgODAgMTEwVjkwQzgwIDg0LjQ3NzIgODQuNDc3MiA4MCA5MCA4MFoiIGZpbGw9IiM0MDQwNDAiLz48cGF0aCBkPSJNMTAwIDg1QzEwMi43NjEgODUgMTA1IDg3LjIzODYgMTA1IDkwQzEwNSA5Mi43NjE0IDEwMi43NjEgOTUgMTAwIDk1Qzk3LjIzODYgOTUgOTUgOTIuNzYxNCA5NSA5MEM5NSA4Ny4yMzg2IDk3LjIzODYgODUgMTAwIDg1WiIgZmlsbD0iIzU5NTk1OSIvPjwvc3ZnPg==";

export default function MediaCard({
    id,
    title,
    description,
    imageUrl,
    audioUrl,
    type = "track",
    artist,
    onPlay,
}) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (!id || id === "undefined") return;

        switch (type) {
            case "artist":
                router.push(`/artists/${id}`);
                break;
            case "album":
                router.push(`/albums/${id}`);
                break;
            case "track":
                router.push(`/tracks/${id}`);
                break;
            default:
                break;
        }
    };

    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (!id || id === "undefined") return;

        if (type === "track") {
            const trackData = {
                id,
                title,
                artist,
                coverUrl: imgError ? DEFAULT_IMAGE : imageUrl || DEFAULT_IMAGE,
                audioUrl,
            };
            dispatch(setCurrentTrack(trackData));
            dispatch(setIsPlaying(true));
            if (onPlay) {
                onPlay(trackData);
            }
        } else if (type === "artist") {
            router.push(`/artists/${id}`);
        }
    };

    return (
        <Card onClick={handleClick} type={type}>
            <ImageContainer type={type}>
                <Image
                    src={imgError ? DEFAULT_IMAGE : imageUrl || DEFAULT_IMAGE}
                    alt={title}
                    fill
                    sizes="200px"
                    priority={true}
                    onError={handleImageError}
                    style={{
                        objectFit: "cover",
                    }}
                />
            </ImageContainer>
            {(type === "track" || type === "album" || type === "artist") && (
                <PlayButton className="play-button" onClick={handlePlayClick}>
                    <Play size={24} />
                </PlayButton>
            )}
            <Content type={type}>
                <Title>{title}</Title>
                <Description>
                    {type === "artist" ? "Artiste" : description}
                </Description>
            </Content>
        </Card>
    );
}
