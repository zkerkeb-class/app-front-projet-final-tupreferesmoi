"use client";

import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../lib/registry";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import { Provider } from "react-redux";
import { store } from "../store";
import GlobalStyle from "../styles/GlobalStyle";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import AudioPlayer from "../components/player/AudioPlayer";

const inter = Inter({ subsets: ["latin"] });

const AppLayout = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MainWrapper = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
`;

const SidebarWrapper = styled.div`
    width: 240px;
    background-color: ${({ theme }) => theme.colors.background};
    overflow-y: auto;
`;

const MainContent = styled.main`
    flex: 1;
    overflow-y: auto;
    position: relative;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    background-color: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.div`
    padding-bottom: 90px; // Pour le lecteur audio
`;

export default function RootLayout({ children }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body suppressHydrationWarning className={inter.className}>
                <StyledComponentsRegistry>
                    <Provider store={store}>
                        <ThemeProvider theme={theme}>
                            <GlobalStyle />
                            <AppLayout>
                                <MainWrapper>
                                    <SidebarWrapper>
                                        <Sidebar />
                                    </SidebarWrapper>
                                    <MainContent>
                                        <Header />
                                        <ContentWrapper>
                                            {children}
                                        </ContentWrapper>
                                    </MainContent>
                                </MainWrapper>
                                <AudioPlayer />
                            </AppLayout>
                        </ThemeProvider>
                    </Provider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
