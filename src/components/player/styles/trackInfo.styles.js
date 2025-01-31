import styled from "styled-components";

export const TrackInfoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;

    img {
        border-radius: 4px;
    }

    .track-text {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .title {
            color: ${({ theme }) => theme.colors.text};
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
`;
