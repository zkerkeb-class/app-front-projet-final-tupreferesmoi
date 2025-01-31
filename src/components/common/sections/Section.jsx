import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styled from "styled-components";

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text};
    font-size: 2rem;
    margin: 0;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const ViewAll = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Content = styled.div`
    margin-bottom: 48px;
`;

export const Section = ({ title, href, children }) => {
    return (
        <div>
            <Header>
                <Link href={href} style={{ textDecoration: "none" }}>
                    <Title>{title}</Title>
                </Link>
                <ViewAll href={href}>Tout afficher</ViewAll>
            </Header>
            <Content>{children}</Content>
        </div>
    );
};

Section.propTypes = {
    /** Titre de la section */
    title: PropTypes.string.isRequired,
    /** Lien vers la page complète */
    href: PropTypes.string.isRequired,
    /** Contenu de la section */
    children: PropTypes.node.isRequired,
};

export default Section;
