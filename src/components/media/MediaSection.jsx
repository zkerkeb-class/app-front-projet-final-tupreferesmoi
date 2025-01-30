"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";

const Section = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};

    &:hover h2 {
        text-decoration: underline;
    }
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    margin: 0;
    cursor: pointer;
`;

const ShowAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;

    &:hover {
        text-decoration: underline;
    }
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

export default function MediaSection({ title, children, href }) {
    return (
        <Section>
            <Header>
                <Link href={href || "#"} style={{ textDecoration: "none" }}>
                    <TitleContainer>
                        <Title>{title}</Title>
                    </TitleContainer>
                </Link>
                <ShowAllLink href={href || "#"}>Tout afficher</ShowAllLink>
            </Header>
            <Grid>{children}</Grid>
        </Section>
    );
}
