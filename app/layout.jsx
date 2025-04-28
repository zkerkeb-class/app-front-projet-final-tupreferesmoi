"use client";
import React, { Suspense, lazy, useEffect } from "react";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@lib/registry";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { getTheme } from "@styles/theme";
import { Provider } from "react-redux";
import { store } from "@store";
import GlobalStyle from "@styles/GlobalStyle";
import { Loader } from "@components/common/loaders";
import {
    AppLayout,
    MainWrapper,
    SidebarWrapper,
    MainContent,
    ContentWrapper,
} from "@features/layout";
import { AuthProvider } from "@features/auth/AuthContext";
import { ThemeProvider, useTheme } from "@contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { QueryProvider } from "@providers/QueryProvider";
import "@config/i18n";

// Lazy load major components
const Header = lazy(() => import("@features/layout/components/Header"));
const Sidebar = lazy(() => import("@features/layout/components/Sidebar"));
const AudioPlayer = lazy(() => import("@features/player/AudioPlayer"));

const inter = Inter({ 
    subsets: ["latin"],
    display: 'swap',
    preload: true
});

function RootLayoutContent({ children }) {
    const { i18n } = useTranslation();
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        // Mettre à jour la direction du document en fonction de la langue actuelle
        const currentLang = i18n.language;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
    }, [i18n.language]);

    return (
        <StyledThemeProvider theme={getTheme(isDarkTheme)}>
            <GlobalStyle />
            <AppLayout>
                <MainWrapper>
                    <SidebarWrapper>
                        <Suspense fallback={<Loader />}>
                            <Sidebar />
                        </Suspense>
                    </SidebarWrapper>
                    <MainContent>
                        <Suspense fallback={<Loader />}>
                            <Header />
                        </Suspense>
                        <ContentWrapper>
                            {children}
                        </ContentWrapper>
                    </MainContent>
                </MainWrapper>
                <Suspense fallback={<Loader />}>
                    <AudioPlayer />
                </Suspense>
            </AppLayout>
        </StyledThemeProvider>
    );
}

export default function RootLayout({ children }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body suppressHydrationWarning className={inter.className}>
                <AuthProvider>
                    <StyledComponentsRegistry>
                        <Provider store={store}>
                            <ThemeProvider>
                                <RootLayoutContent>
                                    {children}
                                </RootLayoutContent>
                            </ThemeProvider>
                        </Provider>
                    </StyledComponentsRegistry>
                </AuthProvider>
            </body>
        </html>
    );
}
