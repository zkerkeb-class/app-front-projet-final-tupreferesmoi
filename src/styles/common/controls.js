import styled from "styled-components";

export const ProgressBar = styled.input`
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    margin: 0;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: ${({ theme }) => theme.colors.text};
        border-radius: 50%;
        cursor: pointer;
        margin-top: -4px;
        opacity: 0;
        transition: opacity 0.2s;
    }

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 4px;
        background: linear-gradient(
            to right,
            ${({ theme }) => theme.colors.text} ${(props) => props.value}%,
            rgba(255, 255, 255, 0.1) ${(props) => props.value}%
        );
        border-radius: 2px;
        cursor: pointer;
    }

    &:hover {
        &::-webkit-slider-thumb {
            opacity: 1;
        }
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
