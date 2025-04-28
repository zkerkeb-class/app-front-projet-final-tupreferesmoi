import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
`;

const LoaderSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #1DB954;
    animation: spin 1s ease-in-out infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const ComponentLoader = () => (
    <LoaderContainer>
        <LoaderSpinner />
    </LoaderContainer>
);

export default ComponentLoader; 