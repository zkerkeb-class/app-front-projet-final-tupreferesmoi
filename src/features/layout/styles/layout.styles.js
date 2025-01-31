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
`;

export const MainContent = styled.main`
    flex: 1;
    overflow-y: auto;
    position: relative;
    background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
    background-color: ${({ theme }) => theme.colors.background};
`;

export const ContentWrapper = styled.div`
    padding-bottom: 90px; // Pour le lecteur audio
`;
