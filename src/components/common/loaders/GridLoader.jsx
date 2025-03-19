import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
    padding: 16px;
`;

const Skeleton = styled.div`
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 8px;
    padding: 16px;
    animation: pulse 1.5s ease-in-out infinite;

    @keyframes pulse {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
        100% {
            opacity: 1;
        }
    }

    .image {
        width: 100%;
        aspect-ratio: 1;
        background: ${({ theme }) => theme.colors.secondaryLight};
        border-radius: 4px;
        margin-bottom: 16px;
    }

    .title {
        height: 16px;
        width: 80%;
        background: ${({ theme }) => theme.colors.secondaryLight};
        border-radius: 2px;
        margin-bottom: 8px;
    }

    .subtitle {
        height: 14px;
        width: 60%;
        background: ${({ theme }) => theme.colors.secondaryLight};
        border-radius: 2px;
    }
`;

export const GridLoader = ({ count = 12 }) => {
    return (
        <Grid>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index}>
                    <div className="image" />
                    <div className="title" />
                    <div className="subtitle" />
                </Skeleton>
            ))}
        </Grid>
    );
};

GridLoader.propTypes = {
    /** Nombre d'éléments à afficher */
    count: PropTypes.number,
};

export default GridLoader;
