export const theme = {
    colors: {
        primary: "#1DB954", // Vert Spotify
        secondary: "#121212", // Noir Spotify
        background: "#000000", // Fond sombre
        surface: "#282828",
        text: "#FFFFFF",
        textSecondary: "#B3B3B3",
        hover: "#2A2A2A",
        playing: "#1ED760",
        gradient: "linear-gradient(transparent 0,rgba(0,0,0,.5) 100%)",
    },
    fonts: {
        primary:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    breakpoints: {
        mobile: "320px",
        tablet: "768px",
        desktop: "1024px",
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
    },
};

export type Theme = typeof theme;
