"use client";

import React from "react";
import styled from "styled-components";
import { Search, Home, Grid, ChevronLeft, ChevronRight } from "react-feather";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenu from "../../../components/common/UserMenu";

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

const SearchWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 364px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 500px;
    padding: 6px 12px;
`;

const SearchIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
    width: 100%;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    outline: none;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
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

            <SearchWrapper>
                <SearchIcon>
                    <Search size={20} />
                </SearchIcon>
                <Input
                    type="text"
                    placeholder="Que souhaitez-vous écouter ou regarder ?"
                />
            </SearchWrapper>

            <NavigationSection>
                <BrowseButton>
                    <Grid size={24} />
                </BrowseButton>
                <UserMenu />
            </NavigationSection>
        </HeaderContainer>
    );
}
