import styled from "styled-components";

export const ProgressBar = styled.input`
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    position: relative;

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 4px;
        background: ${({ theme }) => theme.colors.playerProgress};
        border-radius: 2px;
        transition: background-color 0.3s ease;
    }

    &::-moz-range-track {
        width: 100%;
        height: 4px;
        background: ${({ theme }) => theme.colors.playerProgress};
        border-radius: 2px;
        transition: background-color 0.3s ease;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
        margin-top: -4px;
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 2;
    }

    &::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
        border: none;
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 2;
    }

    &:hover {
        &::-webkit-slider-thumb {
            opacity: 1;
            transform: scale(1.2);
        }
        &::-moz-range-thumb {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    &::before {
        content: '';
        position: absolute;
        height: 4px;
        background: ${({ theme }) => theme.colors.primary};
        width: ${props => props.value}%;
        border-radius: 2px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        transition: width 0.1s ease-out;
    }
`;

export const TimeDisplay = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: 0 2px;
    user-select: none;
`;
