import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
`;

const Spinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #1DB954;
    animation: ${spin} 1s ease-in-out infinite;
`;

export default function FallbackLoader() {
    return (
        <LoaderWrapper>
            <Spinner />
        </LoaderWrapper>
    );
} 