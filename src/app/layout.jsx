"use client";
import React, { Suspense, lazy, useEffect } from "react";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@lib/registry";
import { ThemeProvider } from "styled-components";
import { theme } from "@styles/theme";
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
import { useTranslation } from "react-i18next";
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

export default function RootLayout({ children }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        // Mettre à jour la direction du document en fonction de la langue actuelle
        const currentLang = i18n.language;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
    }, [i18n.language]);

    return (
        <html lang={i18n.language} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
            <body suppressHydrationWarning className={inter.className}>
                <AuthProvider>
                    <StyledComponentsRegistry>
                        <Provider store={store}>
                            <ThemeProvider theme={theme}>
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
                            </ThemeProvider>
                        </Provider>
                    </StyledComponentsRegistry>
                </AuthProvider>
            </body>
        </html>
    );
}
