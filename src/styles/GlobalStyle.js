import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        /* Variables de thème clair par défaut */
        --background-color: ${({ theme }) => theme.colors.background};
        --primary-color: ${({ theme }) => theme.colors.primary};
        --primary-hover-color: ${({ theme }) => theme.colors.primaryHover};
        --secondary-color: ${({ theme }) => theme.colors.secondary};
        --secondary-hover-color: ${({ theme }) => theme.colors.secondaryHover};
        --text-color: ${({ theme }) => theme.colors.text};
        --text-secondary-color: ${({ theme }) => theme.colors.textSecondary};
        --error-color: ${({ theme }) => theme.colors.error};
        --surface-color: ${({ theme }) => theme.colors.surface};
        --surface-hover-color: ${({ theme }) => theme.colors.surfaceHover};
        --border: ${({ theme }) => theme.colors.border};
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.5;
        overflow: hidden;
    }

    /* Appliquer la transition sur tous les éléments qui utilisent les couleurs du thème */
    *, *::before, *::after {
        transition: ${({ theme }) => theme.transitions.theme};
        transition-property: background-color, color, border-color, fill, stroke, box-shadow;
    }

    button {
        font-family: inherit;
        cursor: pointer;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    /* Styles pour la scrollbar */
    ::-webkit-scrollbar {
        width: 12px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        border: 3px solid transparent;
        background-clip: padding-box;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
        border: 3px solid transparent;
        background-clip: padding-box;
    }

    /* Styles pour les éléments interactifs en mode clair */
    input[type="range"] {
        -webkit-appearance: none;
        background: transparent;
        cursor: pointer;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        background: ${({ theme }) => theme.colors.playerProgress};
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-radius: 3px;
        height: 6px;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.primary};
        margin-top: -5px;
        border: 1px solid ${({ theme }) => theme.colors.border};
    }

    input[type="range"]:focus {
        outline: none;
    }

    input[type="range"]:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.surface}, 
                   0 0 0 4px ${({ theme }) => theme.colors.primary};
    }
`;

export default GlobalStyle;
