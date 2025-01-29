"use client";

import React from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Search, User } from "react-feather";
import { useRouter } from "next/navigation";

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

const NavigationButtons = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
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

const SearchContainer = styled.div`
    flex: 1;
    max-width: 400px;
    margin: 0 ${({ theme }) => theme.spacing.xl};
    position: relative;
`;

const SearchInput = styled.input`
    width: 100%;
    height: 40px;
    border-radius: 20px;
    border: none;
    padding: 0 ${({ theme }) => theme.spacing.xl};
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;

    &:focus {
        outline: none;
        background-color: ${({ theme }) => theme.colors.secondaryHover};
    }
`;

const SearchIcon = styled(Search)`
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
    width: 20px;
    height: 20px;
`;

const UserButton = styled.button`
    height: 32px;
    padding: 0 ${({ theme }) => theme.spacing.sm};
    border-radius: 16px;
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: scale(1.02);
    }
`;

export default function Header() {
    const router = useRouter();

    return (
        <HeaderContainer>
            <NavigationButtons>
                <NavButton onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                </NavButton>
                <NavButton onClick={() => router.forward()}>
                    <ChevronRight size={20} />
                </NavButton>
            </NavigationButtons>

            <SearchContainer>
                <SearchIcon />
                <SearchInput
                    placeholder="Que souhaitez-vous écouter ?"
                    disabled
                />
            </SearchContainer>

            <UserButton>
                <User size={20} />
            </UserButton>
        </HeaderContainer>
    );
}
