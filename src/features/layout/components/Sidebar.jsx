"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Home, Search, BookOpen, PlusSquare, Heart } from "react-feather";
import { useTranslation } from "react-i18next";
import playlistApi from "@/services/playlistApi";
import { searchBarRef } from "./Header";

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
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    overflow: hidden;
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

const PlaylistsList = styled.div`
    flex: 1;
    min-height: 0;
    margin-top: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    overflow-y: auto;
    padding-right: ${({ theme }) => theme.spacing.sm};

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const PlaylistsHeader = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
`;

const PlaylistLink = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: 14px;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
        background: rgba(255, 255, 255, 0.1);
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    margin-bottom: 8px;

    &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const SearchButton = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.2s ease;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

const SearchContainer = styled.div`
    position: relative;
    padding: ${({ theme }) => theme.spacing.sm};
`;

export default function Sidebar() {
    const [playlists, setPlaylists] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        try {
            const response = await playlistApi.getUserPlaylists();
            setPlaylists(response);
        } catch (error) {
            setPlaylists([]);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            await playlistApi.createPlaylist({
                name: newPlaylistName,
                description: "",
            });
            setNewPlaylistName("");
            setIsCreating(false);
            await loadPlaylists();
        } catch (error) {
            // Gérer l'erreur silencieusement
        }
    };

    const handleSearchClick = () => {
        searchBarRef.current?.focus();
    };

    return (
        <SidebarContainer>
            <Logo>Spotify-Ynov</Logo>

            <NavigationSection>
                <NavLink href="/">
                    <Home />
                    {t('sidebar.home')}
                </NavLink>
                <SearchButton onClick={handleSearchClick}>
                    <Search />
                    {t('sidebar.search')}
                </SearchButton>
            </NavigationSection>

            <LibrarySection>
                {isCreating ? (
                    <>
                        <Input
                            type="text"
                            placeholder={t('sidebar.newPlaylistName')}
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleCreatePlaylist();
                                }
                            }}
                            autoFocus
                        />
                        <CreatePlaylistButton onClick={handleCreatePlaylist}>
                            {t('sidebar.create')}
                        </CreatePlaylistButton>
                    </>
                ) : (
                    <CreatePlaylistButton onClick={() => setIsCreating(true)}>
                        <PlusSquare size={20} />
                        {t('sidebar.createPlaylist')}
                    </CreatePlaylistButton>
                )}

                <NavLink href="/playlists">
                    <BookOpen />
                    {t('sidebar.myPlaylists')}
                </NavLink>

                <PlaylistsList>
                    <PlaylistsHeader>
                        {t('sidebar.recentPlaylists')}
                    </PlaylistsHeader>
                    {playlists && playlists.length > 0 ? (
                        playlists.slice(0, 5).map((playlist) => (
                            <PlaylistLink
                                key={playlist._id || playlist.id}
                                href={`/playlists/${playlist._id || playlist.id}`}
                            >
                                {playlist.name}
                            </PlaylistLink>
                        ))
                    ) : (
                        <div style={{ color: 'rgba(255,255,255,0.5)', padding: '8px', fontSize: '14px' }}>
                            {t('sidebar.noPlaylists')}
                        </div>
                    )}
                </PlaylistsList>
            </LibrarySection>
        </SidebarContainer>
    );
}
