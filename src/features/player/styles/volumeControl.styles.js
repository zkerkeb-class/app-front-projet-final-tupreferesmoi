import styled from "styled-components";

export const VolumeControlContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    gap: 8px;

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        padding: 0;
        color: ${({ theme }) => theme.colors.textSecondary};
        cursor: pointer;
        width: 32px;
        height: 32px;

        svg {
            width: 20px;
            height: 20px;
        }

        &:hover {
            color: ${({ theme }) => theme.colors.text};
        }
    }

    .volume-slider {
        width: 93px;
        transition: all 0.2s ease;
    }

    @media (min-width: 769px) {
        &:hover .volume-slider {
            display: block;
        }
    }

    @media (max-width: 768px) {
        .volume-slider {
            display: block;
            position: fixed;
            bottom: 130px;
            right: 16px;
            transform: rotate(-90deg);
            transform-origin: bottom right;
            width: 100px;
            opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
            pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
            background-color: ${({ theme }) => theme.colors.secondary};
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
            z-index: 1000;
        }
    }
`;
