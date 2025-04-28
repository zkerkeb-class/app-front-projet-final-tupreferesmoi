import styled, { css } from "styled-components";

const variants = {
    default: css`
        background: transparent;
        border: 1px solid ${({ theme }) => theme.colors.border};

        &:hover:not(:disabled) {
            border-color: ${({ theme }) => theme.colors.borderHover};
        }

        &:focus-within {
            border-color: ${({ theme }) => theme.colors.primary};
        }
    `,
    filled: css`
        background: ${({ theme }) => theme.colors.secondary};
        border: 1px solid transparent;

        &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.secondaryLight};
        }

        &:focus-within {
            background: ${({ theme }) => theme.colors.secondaryLight};
            border-color: ${({ theme }) => theme.colors.primary};
        }
    `,
    outlined: css`
        background: transparent;
        border: 2px solid ${({ theme }) => theme.colors.border};

        &:hover:not(:disabled) {
            border-color: ${({ theme }) => theme.colors.borderHover};
        }

        &:focus-within {
            border-color: ${({ theme }) => theme.colors.primary};
        }
    `,
};

export const InputContainer = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    padding: ${({ $hasIcon }) => ($hasIcon ? "8px 12px 8px 36px" : "8px 12px")};
    width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
    transition: all 0.2s ease;

    ${({ $variant }) => variants[$variant]}

    ${({ $error, theme }) =>
        $error &&
        css`
            border-color: ${theme.colors.error} !important;
        `}

    .icon {
        position: absolute;
        left: 12px;
        color: ${({ theme }) => theme.colors.textSecondary};
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 16px;
            height: 16px;
        }
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const StyledInput = styled.input`
    width: 100%;
    background: none;
    border: none;
    outline: none;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }

    &:disabled {
        cursor: not-allowed;
    }
`;
