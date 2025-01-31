import styled, { keyframes } from "styled-components";

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const sizes = {
    small: {
        size: "24px",
        border: "2px",
    },
    medium: {
        size: "40px",
        border: "3px",
    },
    large: {
        size: "56px",
        border: "4px",
    },
};

const variants = {
    primary: ({ theme }) => theme.colors.primary,
    secondary: ({ theme }) => theme.colors.textSecondary,
    white: "#ffffff",
};

export const LoaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;

    ${({ $fullscreen }) =>
        $fullscreen &&
        `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${({ theme }) => theme.colors.background};
        z-index: 1000;
        min-height: 100vh;
    `}
`;

export const Spinner = styled.div`
    width: ${({ $size }) => sizes[$size].size};
    height: ${({ $size }) => sizes[$size].size};
    border: ${({ $size }) => sizes[$size].border} solid rgba(255, 255, 255, 0.1);
    border-left-color: ${({ $variant, theme }) =>
        variants[$variant]({ theme })};
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;
