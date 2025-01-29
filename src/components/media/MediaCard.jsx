"use client";

import React from "react";
import styled from "styled-components";
import { Play } from "react-feather";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Card = styled.div`
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing.sm};
    width: 200px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
        background: ${({ theme }) => theme.colors.secondaryHover};
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
    border-radius: 4px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background};

    img {
        object-fit: cover !important;
        transition: transform 0.3s ease;
        transform-origin: center center;
    }

    &:hover img {
        transform: scale(1.05);
    }
`;

const PlayButton = styled.button`
    position: absolute;
    bottom: ${({ theme }) => theme.spacing.sm};
    right: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    color: ${({ theme }) => theme.colors.text};
    z-index: 2;

    &:hover {
        transform: scale(1.1) translateY(0);
        background: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const Content = styled.div`
    z-index: 1;
`;

const Title = styled.h3`
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Description = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.875rem;
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
    onPlay,
    type = "track",
}) {
    const router = useRouter();

    const handleClick = (e) => {
        e.preventDefault();
        if (type === "artist") {
            router.push(`/artist/${id}`);
        } else if (type === "album") {
            router.push(`/album/${id}`);
        }
    };

    const handlePlayClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onPlay) onPlay();
    };

    return (
        <Card onClick={handleClick}>
            <ImageContainer>
                <Image
                    src={imageUrl || DEFAULT_IMAGE}
                    alt={title}
                    fill
                    sizes="200px"
                    priority={true}
                    style={{
                        objectFit: "cover",
                    }}
                />
                {type === "track" && (
                    <PlayButton onClick={handlePlayClick}>
                        <Play size={20} />
                    </PlayButton>
                )}
            </ImageContainer>
            <Content>
                <Title>{title}</Title>
                <Description>{description}</Description>
            </Content>
        </Card>
    );
}
