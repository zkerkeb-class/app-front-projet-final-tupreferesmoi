const darkTheme = {
    colors: {
        background: "#121212",
        primary: "#1DB954",
        primaryHover: "#1ed760",
        secondary: "#282828",
        secondaryHover: "#3E3E3E",
        text: "#FFFFFF",
        textSecondary: "#B3B3B3",
        error: "#FF4B4B",
        surface: "#282828",
        surfaceHover: "#3E3E3E",
        playerBackground: "#181818",
        playerText: "#FFFFFF",
        playerTextSecondary: "#B3B3B3",
        playerControl: "#FFFFFF",
        playerProgress: "#4D4D4D",
        playerProgressFilled: "#1DB954",
        border: "transparent",
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
    borderRadius: {
        small: "4px",
        medium: "8px",
        large: "16px",
        round: "50%",
    },
    transitions: {
        default: "all 0.2s ease",
        theme: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    },
};

const lightTheme = {
    ...darkTheme,
    colors: {
        background: "#FFFFFF",
        primary: "#1DB954",
        primaryHover: "#1ed760",
        secondary: "#F5F5F5",
        secondaryHover: "#E8E8E8",
        text: "#191414",
        textSecondary: "#666666",
        error: "#FF4B4B",
        surface: "#F5F5F5",
        surfaceHover: "#E8E8E8",
        playerBackground: "#F8F8F8",
        playerText: "#191414",
        playerTextSecondary: "#666666",
        playerControl: "#191414",
        playerProgress: "#A0A0A0",
        playerProgressFilled: "#1DB954",
        border: "#E0E0E0",
    },
};

export const getTheme = (isDark = true) => isDark ? darkTheme : lightTheme;
