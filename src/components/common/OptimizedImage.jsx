import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || '1'};
    overflow: hidden;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.background.secondary};
`;

const StyledImage = styled(Image)`
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

export const OptimizedImage = ({
    src,
    alt,
    aspectRatio = '1',
    sizes = '(max-width: 400px) 140px, (max-width: 680px) 160px, (max-width: 1200px) 180px, 200px',
    priority = false,
    ...props
}) => {
    return (
        <ImageWrapper $aspectRatio={aspectRatio}>
            <StyledImage
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                quality={85}
                {...props}
            />
        </ImageWrapper>
    );
}; 