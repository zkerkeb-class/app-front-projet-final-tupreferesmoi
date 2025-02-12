"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import GlobalStyles from "../styles/GlobalStyles";

export function Providers({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            {children}
        </ThemeProvider>
    );
}
