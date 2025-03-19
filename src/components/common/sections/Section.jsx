"use client";

import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const SectionContainer = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    direction: ${({ $isRTL }) => $isRTL ? 'rtl' : 'ltr'};
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
    padding: 0 24px;
    flex-direction: ${({ $isRTL }) => $isRTL ? 'row-reverse' : 'row'};

    @media (max-width: 900px) {
        padding: 0 16px;
    }

    @media (max-width: 400px) {
        padding: 0 12px;
    }
`;

const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    cursor: pointer;

    @media (max-width: 1200px) {
        font-size: 1.8rem;
    }

    @media (max-width: 900px) {
        font-size: 1.6rem;
    }

    @media (max-width: 680px) {
        font-size: 1.4rem;
    }

    &:hover {
        text-decoration: underline;
    }
`;

const ShowAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding-bottom: 0.3rem;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Content = styled.div`
    width: 100%;
`;

export function Section({ title, children, href, showAllText }) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <SectionContainer $isRTL={isRTL}>
            <SectionHeader $isRTL={isRTL}>
                <Link href={href || "#"} style={{ textDecoration: "none" }}>
                    <Title>{title}</Title>
                </Link>
                {href && <ShowAllLink href={href}>{showAllText}</ShowAllLink>}
            </SectionHeader>
            <Content>{children}</Content>
        </SectionContainer>
    );
}

Section.propTypes = {
    /** Titre de la section */
    title: PropTypes.string.isRequired,
    /** Lien vers la page complète */
    href: PropTypes.string,
    /** Contenu de la section */
    children: PropTypes.node.isRequired,
    /** Texte du lien "Tout afficher" */
    showAllText: PropTypes.string,
};

export default Section;
