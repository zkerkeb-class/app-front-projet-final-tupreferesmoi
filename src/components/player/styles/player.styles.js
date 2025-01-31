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
    grid-template-columns: minmax(180px, 1fr) minmax(400px, 2fr) minmax(
            180px,
            1fr
        );
    align-items: center;
    justify-content: center;
    z-index: 100;

    > * {
        min-width: 0; // Pour éviter le débordement
    }

    .disabled-track-info {
        grid-column: 1;
        opacity: 0.5;
        pointer-events: none;
    }
`;
