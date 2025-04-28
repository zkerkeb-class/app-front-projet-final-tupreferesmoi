import styled from 'styled-components';

export const MediaGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
    padding: 0 24px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    @media (max-width: 900px) {
        gap: 16px;
        padding: 0 16px;
    }

    @media (max-width: 680px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
        padding: 0 16px;
        font-size: 0.9rem;
    }

    @media (max-width: 400px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
        padding: 0 12px;
        font-size: 0.8rem;
    }
`; 