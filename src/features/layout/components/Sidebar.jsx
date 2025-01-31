"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Home, Search, BookOpen, PlusSquare, Heart } from "react-feather";

const SidebarContainer = styled.aside`
    background-color: ${({ theme }) => theme.colors.background};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
`;

const NavigationSection = styled.div`
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const LibrarySection = styled(NavigationSection)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

const LibraryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const LibraryHeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;

    svg {
        width: 24px;
        height: 24px;
    }
`;

const CreatePlaylistButton = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: ${({ theme }) => theme.spacing.sm};
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-weight: 600;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Logo = styled.div`
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    font-weight: bold;
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export default function Sidebar() {
    return (
        <SidebarContainer>
            <Logo>Spotify-Ynov</Logo>

            <NavigationSection>
                <NavLink href="/">
                    <Home />
                    Accueil
                </NavLink>
                <NavLink href="/search">
                    <Search />
                    Rechercher
                </NavLink>
            </NavigationSection>

            <LibrarySection>
                <LibraryHeader>
                    <LibraryHeaderLeft>
                        <BookOpen />
                        Bibliothèque
                    </LibraryHeaderLeft>
                    <PlusSquare size={24} style={{ cursor: "pointer" }} />
                </LibraryHeader>

                <CreatePlaylistButton>
                    <PlusSquare size={20} />
                    Créer une playlist
                </CreatePlaylistButton>

                <NavLink href="/liked">
                    <Heart />
                    Titres likés
                </NavLink>
            </LibrarySection>
        </SidebarContainer>
    );
}
