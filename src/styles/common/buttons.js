import styled, { css } from "styled-components";

export const IconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    width: 32px;
    height: 32px;
    transition: all 0.2s;

    svg {
        width: 20px;
        height: 20px;
    }

    &:hover:not(:disabled) {
        color: ${({ theme }) => theme.colors.text};
        transform: scale(1.06);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    ${({ active }) =>
        active &&
        css`
            color: ${({ theme }) => theme.colors.primary};
        `}

    ${({ variant }) =>
        variant === "primary" &&
        css`
            background: ${({ theme }) => theme.colors.text};
            border-radius: 50%;
            color: ${({ theme }) => theme.colors.background};

            svg {
                width: 14px;
                height: 14px;
            }

            &:hover:not(:disabled) {
                transform: scale(1.06);
                color: ${({ theme }) => theme.colors.background};
            }
        `}
`;
