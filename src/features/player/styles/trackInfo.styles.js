import styled, { keyframes } from "styled-components";

const scrollText = keyframes`
    0%, 15% { transform: translateX(0); }
    85%, 100% { transform: translateX(min(-100%, -200px)); }
`;

export const TrackInfoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;
    overflow: hidden;

    img {
        border-radius: 4px;
        object-fit: cover;
    }

    .track-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        flex: 1;

        .title, .artist {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .title {
            color: ${({ theme }) => theme.colors.text};
            font-weight: 500;
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 0.875rem;
        }
    }

    @media (max-width: 768px) {
        gap: 8px;

        img {
            width: 40px !important;
            height: 40px !important;
        }

        .track-text {
            gap: 2px;

            .title {
                font-size: 0.875rem;
            }

            .artist {
                font-size: 0.75rem;
            }
        }
    }

    @media (max-width: 375px) {
        justify-content: center;
        width: 100%;
        gap: 8px;

        img {
            width: 32px !important;
            height: 32px !important;
        }

        .track-text {
            flex: 0 1 auto;
            text-align: center;
            max-width: 200px;
        }
    }
`;
