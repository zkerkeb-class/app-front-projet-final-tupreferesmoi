import React from 'react';
import styled from 'styled-components';
import { Shuffle } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { setShuffleMode } from '@/store/slices/playerSlice';
import { PlayButton } from './PlayButton';

const Container = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 24px;
`;

const IconButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    padding: 8px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }

    &[data-active="true"] {
        color: ${({ theme }) => theme.colors.primary};
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

export const PlaybackControls = ({ 
    onPlay, 
    isPlaying, 
    hasMultipleTracks = false,
    children 
}) => {
    const dispatch = useDispatch();
    const { shuffleEnabled } = useSelector((state) => state.player);

    const handleToggleShuffle = () => {
        if (!hasMultipleTracks) return;
        dispatch(setShuffleMode(!shuffleEnabled));
    };

    return (
        <Container>
            <PlayButton 
                onClick={onPlay}
                isPlaying={isPlaying}
            />
            {hasMultipleTracks && (
                <IconButton
                    onClick={handleToggleShuffle}
                    data-active={shuffleEnabled}
                    title="Mode aléatoire"
                >
                    <Shuffle />
                </IconButton>
            )}
            {children}
        </Container>
    );
}; 