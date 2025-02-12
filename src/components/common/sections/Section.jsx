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
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    flex-direction: ${({ $isRTL }) => $isRTL ? 'row-reverse' : 'row'};
`;

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

const ShowAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Content = styled.div`
    margin-bottom: 48px;
`;

export function Section({ title, children, href, showAllText }) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <SectionContainer $isRTL={isRTL}>
            <SectionHeader $isRTL={isRTL}>
                <Title>{title}</Title>
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
