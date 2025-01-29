"use client";

import React from "react";
import { Providers } from "../providers";
import StyledComponentsRegistry from "../lib/registry";
import Sidebar from "../components/layout/Sidebar";
import styled from "styled-components";

const MainContainer = styled.main`
    margin-left: 240px;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
`;

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body>
                <StyledComponentsRegistry>
                    <Providers>
                        <Sidebar />
                        <MainContainer>{children}</MainContainer>
                    </Providers>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
