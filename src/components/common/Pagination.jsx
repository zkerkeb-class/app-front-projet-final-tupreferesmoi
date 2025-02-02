import React from "react";
import styled from "styled-components";

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-top: 40px;
    padding: 20px;
`;

const PageInfo = styled.div`
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
    min-width: 150px;
    text-align: center;
`;

const NavigationButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    font-size: 20px;
    font-weight: 700;
    line-height: 0;
    position: relative;
    top: -1px;

    &:hover:not(:disabled) {
        transform: scale(1.1);
        background: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.text};
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        &:hover {
            transform: none;
            background: ${({ theme }) => theme.colors.surface};
        }
    }
`;

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    onPreviousPage,
    onNextPage,
    itemsLabel = "éléments",
}) => {
    return (
        <PaginationContainer>
            <NavigationButton
                onClick={onPreviousPage}
                disabled={currentPage === 1}
                aria-label="Page précédente"
            >
                ‹
            </NavigationButton>
            <PageInfo>
                Page {currentPage} sur {totalPages} ({totalItems} {itemsLabel})
            </PageInfo>
            <NavigationButton
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                aria-label="Page suivante"
            >
                ›
            </NavigationButton>
        </PaginationContainer>
    );
};

export default Pagination;
