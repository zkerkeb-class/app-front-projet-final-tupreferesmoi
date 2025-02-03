"use client";

import React from "react";
import styled from "styled-components";
import { Home, Grid, ChevronLeft, ChevronRight } from "react-feather";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenu from "../../../components/common/UserMenu";
import SearchBar from "../../../components/common/search/SearchBar";

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
`;

const NavigationSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
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

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: scale(1.05);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            transform: none;
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

export const searchBarRef = React.createRef();

export default function Header() {
    const router = useRouter();

    return (
        <HeaderContainer>
            <NavigationSection>
                <NavButton onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                </NavButton>
                <NavButton onClick={() => router.forward()}>
                    <ChevronRight size={20} />
                </NavButton>
                <HomeButton href="/">
                    <Home size={24} />
                </HomeButton>
            </NavigationSection>

            <SearchContainer>
                <SearchBar ref={searchBarRef} />
            </SearchContainer>

            <NavigationSection>
                <BrowseButton>
                    <Grid size={24} />
                </BrowseButton>
                <UserMenu />
            </NavigationSection>
        </HeaderContainer>
    );
}
