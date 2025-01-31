"use client";

import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../lib/registry";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/theme";
import { Provider } from "react-redux";
import { store } from "../store";
import GlobalStyle from "../styles/GlobalStyle";
import { AudioPlayer } from "../features/player";
import {
    Header,
    Sidebar,
    AppLayout,
    MainWrapper,
    SidebarWrapper,
    MainContent,
    ContentWrapper,
} from "../features/layout";

const inter = Inter({ subsets: ["latin"] });

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
