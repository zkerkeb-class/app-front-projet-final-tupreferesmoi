import styled from "styled-components";

export const VolumeControlContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding-right: 32px;

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
    }
`;
