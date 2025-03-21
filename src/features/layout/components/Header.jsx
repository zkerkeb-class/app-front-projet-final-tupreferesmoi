"use client";

import React from "react";
import styled from "styled-components";
import { Home, ChevronLeft, ChevronRight, Search, Sun, Moon, RefreshCw } from "react-feather";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import UserMenu from "@components/layout/UserMenu";
import SearchBar from "@components/features/search/SearchBar";
import LanguageSelector from "@components/layout/LanguageSelector";
import BurgerMenu from "@components/layout/menu/BurgerMenu";
import { useTheme } from "@contexts/ThemeContext";
import { purgeStoreData } from "@/store";

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md}
        ${({ theme }) => theme.spacing.xl};
    background-color: ${({ theme }) => theme.colors.background};
    position: sticky;
    top: 0;
    z-index: 100;
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};

    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.sm}
            ${({ theme }) => theme.spacing.md};
    }
`;

const NavigationSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex-direction: ${({ $isRTL }) => $isRTL ? 'row-reverse' : 'row'};

    @media (max-width: 768px) {
        gap: 8px;
    }
`;

const NavButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    transform: ${({ $isRTL }) => $isRTL ? 'rotate(180deg)' : 'none'};

    @media (max-width: 768px) {
        display: none;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: ${({ $isRTL }) => $isRTL ? 'rotate(180deg) scale(1.05)' : 'scale(1.05)'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            transform: ${({ $isRTL }) => $isRTL ? 'rotate(180deg)' : 'none'};
        }
    }
`;

const HomeButton = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const SearchContainer = styled.div`
    flex-grow: 1;
    max-width: 364px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
        max-width: none;
        margin: 0 8px;
    }
`;

const RightSection = styled(NavigationSection)`
    gap: 1rem;

    @media (max-width: 768px) {
        gap: 8px;
    }
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px 12px 8px 40px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 500px;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;

    &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.2);
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const SearchIcon = styled(Search)`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
    width: 20px;
    height: 20px;
`;

const ThemeButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.surface};
    border: none;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @media (max-width: 768px) {
        display: none;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.surfaceHover};
        transform: scale(1.05);
    }

    .sun, .moon {
        position: absolute;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sun {
        opacity: ${({ $isDark }) => $isDark ? 1 : 0};
        transform: ${({ $isDark }) => $isDark ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0.5)'};
    }

    .moon {
        opacity: ${({ $isDark }) => $isDark ? 0 : 1};
        transform: ${({ $isDark }) => $isDark ? 'rotate(90deg) scale(0.5)' : 'rotate(0) scale(1)'};
    }
`;

const LanguageSelectorWrapper = styled.div`
    @media (max-width: 768px) {
        display: none;
    }
`;

// Nouveau bouton pour rafraîchir le cache
const RefreshButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.surface};
    border: none;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @media (max-width: 768px) {
        display: none;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.surfaceHover};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;

export const searchBarRef = React.createRef();

export default function Header() {
    const router = useRouter();
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { isDarkTheme, toggleTheme } = useTheme();
    
    // Fonction pour gérer le rafraîchissement du cache
    const handleRefreshCache = async () => {
        try {
            await purgeStoreData();
            // La page se rechargera automatiquement grâce à purgeStoreData
        } catch (error) {
            console.error("Erreur lors du rafraîchissement du cache:", error);
        }
    };

    return (
        <HeaderContainer $isRTL={isRTL}>
            <NavigationSection $isRTL={isRTL}>
                <NavButton onClick={() => router.back()} $isRTL={isRTL}>
                    <ChevronLeft size={20} />
                </NavButton>
                <NavButton onClick={() => router.forward()} $isRTL={isRTL}>
                    <ChevronRight size={20} />
                </NavButton>
                <HomeButton href="/">
                    <Home size={24} />
                </HomeButton>
            </NavigationSection>

            <SearchContainer>
                <SearchBar 
                    ref={searchBarRef}
                    placeholder={t('header.searchPlaceholder')}
                />
            </SearchContainer>

            <RightSection $isRTL={isRTL}>
                <RefreshButton 
                    onClick={handleRefreshCache} 
                    title={t('common.refreshCache', 'Rafraîchir le cache')}
                >
                    <RefreshCw size={18} />
                </RefreshButton>
                <ThemeButton 
                    onClick={toggleTheme} 
                    title={t(isDarkTheme ? 'theme.switchToLight' : 'theme.switchToDark')}
                    $isDark={isDarkTheme}
                >
                    <Sun className="sun" size={20} />
                    <Moon className="moon" size={20} />
                </ThemeButton>
                <LanguageSelectorWrapper>
                    <LanguageSelector />
                </LanguageSelectorWrapper>
                <UserMenu />
                <BurgerMenu />
            </RightSection>
        </HeaderContainer>
    );
}
