"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Home, Search, BookOpen, PlusSquare, Heart } from "react-feather";

const SidebarContainer = styled.aside`
    background-color: ${({ theme }) => theme.colors.background};
    width: 240px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
`;

const NavigationSection = styled.div`
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing.md};
`;

const LibrarySection = styled(NavigationSection)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm}
        ${({ theme }) => theme.spacing.md};
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
    padding: ${({ theme }) => theme.spacing.sm}
        ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const CreatePlaylistButton = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: ${({ theme }) => theme.spacing.sm}
        ${({ theme }) => theme.spacing.md};
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-weight: 600;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

export default function Sidebar() {
    return (
        <SidebarContainer>
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
                    <NavLink href="/library">
                        <BookOpen />
                        Bibliothèque
                    </NavLink>
                    <PlusSquare size={24} />
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
