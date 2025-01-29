"use client";

import styled from "styled-components";

const HomeContainer = styled.div`
    padding: 24px;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text};
    font-size: 2rem;
    margin-bottom: 24px;
`;

export default function Home() {
    return (
        <HomeContainer>
            <Title>Bienvenue sur Spotify-Ynov</Title>
        </HomeContainer>
    );
}
