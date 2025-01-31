import styled from "styled-components";

export const StyledIconButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${({ theme }) => theme.colors.text};

    /* Gestion de la taille */
    padding: ${({ $size }) =>
        $size === "small" ? "4px" : $size === "large" ? "12px" : "8px"};

    /* Gestion de la variante */
    ${({ theme, $variant }) => {
        switch ($variant) {
            case "primary":
                return `
                    background: ${theme.colors.primary};
                    color: ${theme.colors.text};
                `;
            case "secondary":
                return `
                    background: ${theme.colors.secondary};
                    color: ${theme.colors.text};
                `;
            default:
                return `
                    background: none;
                    color: ${theme.colors.textSecondary};
                `;
        }
    }}

    /* Hover */
    &:hover:not(:disabled) {
        transform: scale(1.1);
        ${({ theme, $variant }) => {
            switch ($variant) {
                case "primary":
                    return `background: ${theme.colors.primaryHover};`;
                case "secondary":
                    return `background: ${theme.colors.secondaryLight};`;
                default:
                    return `color: ${theme.colors.text};`;
            }
        }}
    }

    /* État actif */
    ${({ theme, $active }) =>
        $active &&
        `
        color: ${theme.colors.primary} !important;
    `}

    /* État désactivé */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
