"use client";

import React from "react";
import styled from "styled-components";
import UserMenu from "./UserMenu";

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: ${({ theme }) => theme.colors.surface};
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

export default function Header() {
    return (
        <HeaderContainer>
            <HeaderLeft>
                {/* Ajoutez ici d'autres éléments de navigation si nécessaire */}
            </HeaderLeft>
            <HeaderRight>
                <UserMenu />
            </HeaderRight>
        </HeaderContainer>
    );
}
