"use client";
import React, { Suspense, lazy } from "react";
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
    return (
        <html lang="fr" suppressHydrationWarning>
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
