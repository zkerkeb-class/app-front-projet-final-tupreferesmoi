"use client";

import React from "react";
import styled from "styled-components";
import { Home, Grid, ChevronLeft, ChevronRight } from "react-feather";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import UserMenu from "../../../components/common/UserMenu";
import SearchBar from "../../../components/common/search/SearchBar";
import LanguageSelector from "../../../components/common/LanguageSelector";

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
`;

const NavigationSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex-direction: ${({ $isRTL }) => $isRTL ? 'row-reverse' : 'row'};
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
`;

const BrowseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const RightSection = styled(NavigationSection)`
    gap: 1rem;
`;

export const searchBarRef = React.createRef();

export default function Header() {
    const router = useRouter();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

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
                <SearchBar ref={searchBarRef} />
            </SearchContainer>

            <RightSection $isRTL={isRTL}>
                <BrowseButton>
                    <Grid size={24} />
                </BrowseButton>
                <LanguageSelector />
                <UserMenu />
            </RightSection>
        </HeaderContainer>
    );
}
