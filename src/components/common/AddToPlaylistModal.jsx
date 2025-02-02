import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, X } from 'react-feather';
import playlistApi from '@/services/playlistApi';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #282828;
    padding: 32px;
    border-radius: 8px;
    width: 100%;
    max-width: 480px;
    position: relative;
    box-shadow: 0 8px 24px rgba(0,0,0,.5);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: #b3b3b3;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
        color: #fff;
        transform: scale(1.1);
    }
`;

const Title = styled.h2`
    margin: 0 0 32px;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
`;

const PlaylistList = styled.div`
    max-height: 300px;
    overflow-y: auto;
    margin: 16px -32px;
    padding: 0 32px;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #888;
    }
`;

const PlaylistItem = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 16px;
    text-align: left;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const CreatePlaylistButton = styled(PlaylistItem)`
    color: #b3b3b3;
    margin-top: 8px;
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    gap: 16px;

    &:hover {
        color: #fff;
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 14px;
    margin-bottom: 16px;
    background: #3e3e3e;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #fff;
    }

    &::placeholder {
        color: #b3b3b3;
    }
`;

const CreateButton = styled.button`
    width: 100%;
    padding: 14px;
    background: #1db954;
    border: none;
    border-radius: 500px;
    color: #000;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #1ed760;
        transform: scale(1.02);
    }
`;

const AddToPlaylistModal = ({ isOpen, onClose, trackId }) => {
    const [playlists, setPlaylists] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadPlaylists();
        }
    }, [isOpen]);

    const loadPlaylists = async () => {
        try {
            const response = await playlistApi.getUserPlaylists();
            setPlaylists(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Erreur lors du chargement des playlists:', error);
            setPlaylists([]);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await playlistApi.addTrackToPlaylist(playlistId, trackId);
            onClose();
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la playlist:', error);
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;

        try {
            const newPlaylist = await playlistApi.createPlaylist({
                name: newPlaylistName,
                description: '',
            });

            if (newPlaylist && newPlaylist._id) {
                await playlistApi.addTrackToPlaylist(newPlaylist._id, trackId);
                onClose();
            }
        } catch (error) {
            console.error('Erreur lors de la création de la playlist:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    <X size={24} />
                </CloseButton>
                <Title>Ajouter à une playlist</Title>
                
                {isCreating ? (
                    <>
                        <Input
                            type="text"
                            placeholder="Nom de la playlist"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            autoFocus
                        />
                        <CreateButton onClick={handleCreatePlaylist}>
                            Créer et ajouter
                        </CreateButton>
                    </>
                ) : (
                    <>
                        <PlaylistList>
                            {playlists.map((playlist) => (
                                <PlaylistItem
                                    key={playlist._id}
                                    onClick={() => handleAddToPlaylist(playlist._id)}
                                >
                                    {playlist.name}
                                </PlaylistItem>
                            ))}
                        </PlaylistList>
                        <CreatePlaylistButton onClick={() => setIsCreating(true)}>
                            <Plus size={24} />
                            Créer une nouvelle playlist
                        </CreatePlaylistButton>
                    </>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default AddToPlaylistModal; 