"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Plus, Music, Trash2 } from "react-feather";
import { useRouter } from "next/navigation";
import playlistApi from "@/services/playlistApi";

const Container = styled.div`
    padding: 60px 24px 24px;
`;

const Header = styled.div`
    margin-bottom: 32px;
    h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 24px;
    }
`;

const CreateButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    border: none;
    border-radius: 500px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
        transform: scale(1.04);
        background: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const Input = styled.input`
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 500px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    font-weight: 700;
    margin-right: 12px;
    width: 300px;

    &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const CreateSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const PlaylistGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
    padding: 0;
`;

const PlaylistCard = styled.div`
    position: relative;
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.colors.surfaceHover};
        transform: translateY(-5px);

        .icon-container {
            transform: scale(1.1);
        }
    }
`;

const PlaylistLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
    padding: 16px;
`;

const IconContainer = styled.div`
    width: 100%;
    aspect-ratio: 1;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    svg {
        color: ${({ theme }) => theme.colors.textSecondary};
        width: 48px;
        height: 48px;
    }
`;

const PlaylistInfo = styled.div`
    h3 {
        color: ${({ theme }) => theme.colors.text};
        font-size: 16px;
        font-weight: 700;
        margin: 0 0 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    p {
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: 14px;
        margin: 0;
    }
`;

const VisibilityBadge = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    background: ${({ theme }) => theme.colors.background};
    padding: 4px 8px;
    border-radius: 12px;
    opacity: 0.8;
`;

const DeleteButton = styled.button`
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: ${({ theme }) => theme.colors.error};
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s ease;
    color: ${({ theme }) => theme.colors.text};
    z-index: 2;

    &:hover {
        transform: scale(1.1);
        background: ${({ theme }) => theme.colors.errorHover};
    }
`;

export default function PlaylistsPage() {
    const router = useRouter();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    const fetchPlaylists = async () => {
        try {
            const response = await playlistApi.getUserPlaylists();
            if (response.data) {
                setPlaylists(response.data);
            } else {
                setPlaylists(response);
            }
        } catch (error) {
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            await playlistApi.createPlaylist({
                name: newPlaylistName,
                description: "",
            });
            setNewPlaylistName("");
            setIsCreating(false);
            await fetchPlaylists();
        } catch (error) {
            console.error("Erreur lors de la création de la playlist:", error);
        }
    };

    const handleDeletePlaylist = async (e, playlistId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) {
            return;
        }

        try {
            await playlistApi.deletePlaylist(playlistId);
            await fetchPlaylists();
        } catch (error) {
            console.error("Erreur lors de la suppression de la playlist:", error);
        }
    };

    if (loading) {
        return <Container>Chargement...</Container>;
    }

    return (
        <Container>
            <Header>
                <h1>Mes Playlists</h1>
                <CreateSection>
                    {isCreating ? (
                        <>
                            <Input
                                type="text"
                                placeholder="Nom de la playlist"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreatePlaylist();
                                    }
                                }}
                                autoFocus
                            />
                            <CreateButton onClick={handleCreatePlaylist}>
                                Créer
                            </CreateButton>
                        </>
                    ) : (
                        <CreateButton onClick={() => setIsCreating(true)}>
                            <Plus size={20} />
                            Créer une playlist
                        </CreateButton>
                    )}
                </CreateSection>
            </Header>
            
            <PlaylistGrid>
                {playlists.map((playlist) => (
                    <PlaylistCard key={playlist._id}>
                        <PlaylistLink href={`/playlists/${playlist._id}`}>
                            <IconContainer className="icon-container">
                                <Music />
                            </IconContainer>
                            <PlaylistInfo>
                                <h3>{playlist.name}</h3>
                                <p>{playlist.tracks?.length || 0} titres</p>
                            </PlaylistInfo>
                            <VisibilityBadge>
                                {playlist.isPublic ? 'Public' : 'Privé'}
                            </VisibilityBadge>
                        </PlaylistLink>
                    </PlaylistCard>
                ))}
            </PlaylistGrid>
        </Container>
    );
} 