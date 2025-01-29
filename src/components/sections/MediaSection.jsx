"use client";

import React from "react";
import styled from "styled-components";

const Section = styled.section`
    margin-bottom: 32px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    font-weight: bold;
    margin: 0;
`;

const ViewAll = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    font-size: 14px;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
`;

export default function MediaSection({ title, onViewAll, children }) {
    return (
        <Section>
            <SectionHeader>
                <Title>{title}</Title>
                {onViewAll && <ViewAll onClick={onViewAll}>Voir tout</ViewAll>}
            </SectionHeader>
            <Grid>{children}</Grid>
        </Section>
    );
}
