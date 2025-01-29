"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";

const Section = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

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
            <Link href={href || "#"} style={{ textDecoration: "none" }}>
                <TitleContainer>
                    <Title>{title}</Title>
                </TitleContainer>
            </Link>
            <Grid>{children}</Grid>
        </Section>
    );
}
