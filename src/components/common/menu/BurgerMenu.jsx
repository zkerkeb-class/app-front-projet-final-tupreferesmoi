import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, X } from 'react-feather';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const MenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    padding: 8px;
    cursor: pointer;
    z-index: 1000;

    @media (max-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const MenuOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const MenuContent = styled.div`
    position: fixed;
    top: 0;
    right: ${({ $isOpen }) => ($isOpen ? '0' : '-300px')};
    width: 300px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
    padding: 80px 20px 20px;
    z-index: 999;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const MenuItem = styled(Link)`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.surface};
    }
`;

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <MenuButton onClick={toggleMenu}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuButton>

            <MenuOverlay $isOpen={isOpen} onClick={toggleMenu} />

            <MenuContent $isOpen={isOpen}>
                <MenuItem href="/playlists">{t('sidebar.myPlaylists')}</MenuItem>
                <MenuItem href="/tracks">{t('common.allTracks')}</MenuItem>
                <MenuItem href="/artists">{t('common.allArtists')}</MenuItem>
                <MenuItem href="/albums">{t('common.allAlbums')}</MenuItem>
            </MenuContent>
        </>
    );
};

export default BurgerMenu; 