"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "../lib/registry";
import { theme } from "../styles/theme";
import GlobalStyles from "../styles/GlobalStyles";
import Sidebar from "../components/layout/Sidebar";
import { Provider } from "react-redux";
import { store } from "../store";

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body>
                <Provider store={store}>
                    <StyledComponentsRegistry>
                        <ThemeProvider theme={theme}>
                            <GlobalStyles />
                            <Sidebar />
                            <main style={{ marginLeft: "240px" }}>
                                {children}
                            </main>
                        </ThemeProvider>
                    </StyledComponentsRegistry>
                </Provider>
            </body>
        </html>
    );
}
