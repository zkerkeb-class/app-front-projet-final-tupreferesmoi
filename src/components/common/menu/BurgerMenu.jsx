import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, X, Sun, Moon } from 'react-feather';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import LanguageSelector from '@components/common/LanguageSelector';
import { useTheme } from '@contexts/ThemeContext';

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
    padding: 24px;
    z-index: 999;
    transition: right 0.3s ease;
    display: flex;
    flex-direction: column;

    .burger-language-menu {
        position: absolute;
        bottom: calc(100% + 8px);
        top: auto;
    }

    .burger-footer-buttons {
        display: flex;
        gap: 8px;
    }
`;

const MenuHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 40px;
`;

const MenuTitle = styled.h2`
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    font-weight: 700;
`;

const MenuItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    flex: 1;
`;

const MenuItem = styled(Link)`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    font-size: 20px;
    font-weight: 500;
    transition: all 0.2s ease;
    padding: 8px 0;

    &:hover, &:active {
        color: ${({ theme }) => theme.colors.primary};
        transform: translateX(4px);
    }
`;

const MenuFooter = styled.div`
    display: flex;
    margin-top: auto;
    padding-top: 24px;
    padding-bottom: 90px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};

    .burger-footer-buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .burger-language-menu {
        position: absolute;
        bottom: calc(100% + 8px);
        top: auto;
        right: 0;
    }
`;

const ThemeButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();
    const { isDarkTheme, toggleTheme } = useTheme();

    // Fermer le menu lors d'un changement de page
    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };

        window.addEventListener('popstate', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <MenuButton onClick={toggleMenu} aria-label={t('menu.toggle')}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuButton>

            <MenuOverlay $isOpen={isOpen} onClick={toggleMenu} />

            <MenuContent $isOpen={isOpen}>
                <MenuHeader>
                    <MenuTitle>{t('menu.title')}</MenuTitle>
                </MenuHeader>

                <MenuItems>
                    <MenuItem href="/playlists" onClick={toggleMenu}>
                        {t('menu.myPlaylists')}
                    </MenuItem>
                    <MenuItem href="/tracks" onClick={toggleMenu}>
                        {t('menu.allTracks')}
                    </MenuItem>
                    <MenuItem href="/artists" onClick={toggleMenu}>
                        {t('menu.allArtists')}
                    </MenuItem>
                    <MenuItem href="/albums" onClick={toggleMenu}>
                        {t('menu.allAlbums')}
                    </MenuItem>
                </MenuItems>

                <MenuFooter>
                    <div className="burger-footer-buttons">
                        <LanguageSelector menuClassName="burger-language-menu" />
                        <ThemeButton 
                            onClick={toggleTheme}
                            title={t(isDarkTheme ? 'theme.switchToLight' : 'theme.switchToDark')}
                        >
                            {isDarkTheme ? <Sun /> : <Moon />}
                        </ThemeButton>
                    </div>
                </MenuFooter>
            </MenuContent>
        </>
    );
};

export default BurgerMenu; 