import styled from "styled-components";

export const PlayerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    background-color: ${({ theme }) => theme.colors.secondary};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 16px;
    display: grid;
    grid-template-columns: minmax(180px, 1fr) minmax(400px, 2fr) minmax(180px, 1fr);
    align-items: center;
    justify-content: center;
    z-index: 100;

    > * {
        min-width: 0;
    }

    .disabled-track-info {
        grid-column: 1;
        opacity: 0.5;
        pointer-events: none;
    }

    @media (max-width: 768px) {
        height: 64px;
        padding: 0 8px;
        grid-template-columns: auto 1fr auto;
        gap: 8px;

        > *:first-child {
            max-width: 200px;
        }
    }

    @media (max-width: 375px) {
        height: 120px;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        padding: 8px;
        gap: 4px;

        > *:first-child {
            max-width: none;
            justify-self: center;
        }

        > *:nth-child(2) {
            order: -1;
        }
    }
`;
