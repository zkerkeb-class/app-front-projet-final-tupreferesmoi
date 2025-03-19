"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@features/auth/AuthContext";
import styled from 'styled-components';
import { ChevronDown, User } from 'react-feather';
import { useTranslation } from "react-i18next";

const Container = styled.div`
    position: relative;
    display: inline-block;
`;

const UserButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 50px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 700;
    height: 32px;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    ${({ $isOpen }) => !$isOpen && `
        position: relative;
        
        &:hover::before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: -40px;
            right: 0;
            padding: 8px 12px;
            background-color: #282828;
            color: white;
            font-size: 0.875rem;
            border-radius: 4px;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
        }
    `}
`;

const Avatar = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #535353;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.875rem;
    font-weight: 700;
`;

const Menu = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: #282828;
    border-radius: 4px;
    padding: 4px;
    min-width: 180px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const MenuItem = styled.button`
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    border-radius: 2px;
    font-weight: 400;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const UserMenu = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    const handleLogout = useCallback(() => {
        logout();
        router.push("/");
        router.refresh();
    }, [logout, router]);

    const handleClickOutside = useCallback((event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    if (!user) {
        return (
            <Link href="/login" style={{ textDecoration: 'none' }}>
                <UserButton data-tooltip={t('common.login')}>
                    <Avatar>
                        <User size={16} />
                    </Avatar>
                </UserButton>
            </Link>
        );
    }

    return (
        <Container ref={menuRef}>
            <UserButton onClick={() => setIsOpen(!isOpen)} data-tooltip={user.username} $isOpen={isOpen}>
                <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                <ChevronDown size={16} style={{ marginRight: '4px' }} />
            </UserButton>

            {isOpen && (
                <Menu>
                    <MenuItem onClick={handleLogout}>
                        {t('common.logout')}
                    </MenuItem>
                </Menu>
            )}
        </Container>
    );
});

UserMenu.displayName = 'UserMenu';

export default UserMenu;
