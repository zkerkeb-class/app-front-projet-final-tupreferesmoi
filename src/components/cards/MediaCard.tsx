"use client";

import styled from "styled-components";
import Image from "next/image";
import { Play } from "react-feather";

const Card = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 6px;
    padding: ${({ theme }) => theme.spacing.md};
    transition: background-color 0.3s ease;
    cursor: pointer;
    position: relative;

    &:hover {
        background: ${({ theme }) => theme.colors.hover};

        .play-button {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const CoverImage = styled(Image)`
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
`;

const PlayButton = styled.button`
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.playing};
    border: none;
    color: ${({ theme }) => theme.colors.background};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.3s ease;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);

    &:hover {
        transform: scale(1.04);
        background: ${({ theme }) => theme.colors.primary};
    }
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

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

interface MediaCardProps {
    title: string;
    subtitle?: string;
    imageUrl: string;
    onClick?: () => void;
}

export default function MediaCard({
    title,
    subtitle,
    imageUrl,
    onClick,
}: MediaCardProps) {
    return (
        <Card onClick={onClick}>
            <ImageContainer>
                <CoverImage
                    src={imageUrl}
                    alt={title}
                    width={200}
                    height={200}
                    priority
                />
                <PlayButton className="play-button">
                    <Play fill="black" size={24} />
                </PlayButton>
            </ImageContainer>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Card>
    );
}
