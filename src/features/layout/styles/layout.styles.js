import styled from "styled-components";

export const AppLayout = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const MainWrapper = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
`;

export const SidebarWrapper = styled.div`
    width: 240px;
    background-color: ${({ theme }) => theme.colors.background};
    overflow-y: auto;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const MainContent = styled.main`
    flex: 1;
    overflow-y: auto;
    position: relative;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    background-color: ${({ theme }) => theme.colors.background};
    
    @media (max-width: 768px) {
        padding: 0 ${({ theme }) => theme.spacing.sm};
    }
`;

export const ContentWrapper = styled.div`
    padding-bottom: 90px; // Pour le lecteur audio
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    
    @media (max-width: 768px) {
        padding-bottom: 120px;
    }
`;

// Nouvelles classes pour le responsive
export const ResponsiveGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: ${({ theme }) => theme.spacing.sm};
        padding: ${({ theme }) => theme.spacing.sm};
    }
`;

export const ResponsiveSection = styled.section`
    margin: ${({ theme }) => theme.spacing.xl} 0;
    
    @media (max-width: 768px) {
        margin: ${({ theme }) => theme.spacing.md} 0;
    }
`;

export const ResponsiveTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding: 0 ${({ theme }) => theme.spacing.md};
    
    @media (max-width: 768px) {
        font-size: 1.25rem;
        margin-bottom: ${({ theme }) => theme.spacing.sm};
        padding: 0 ${({ theme }) => theme.spacing.sm};
    }
`;
