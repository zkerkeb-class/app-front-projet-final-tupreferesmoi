"use client";

import React from "react";
import styled from "styled-components";

const Section = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Grid = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.spacing.md};
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    /* Masquer la scrollbar tout en gardant la fonctionnalité */
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export default function MediaSection({ title, children }) {
    return (
        <Section>
            <Title>{title}</Title>
            <Grid>{children}</Grid>
        </Section>
    );
}
