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
    max-width: 300px;

    img {
        border-radius: 4px;
        flex-shrink: 0;
        width: 56px;
        height: 56px;
    }

    .track-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        flex: 1;
        overflow: hidden;

        .title, .artist {
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            text-overflow: ellipsis;

            span {
                display: inline-block;
                position: relative;
                padding-right: 12px;
                max-width: none;
                width: auto;

                &.animate {
                    animation: ${scrollText} 12s linear infinite;
                }
            }
        }

        .title {
            color: ${({ theme }) => theme.colors.text};
            font-size: 14px;
            font-weight: 500;
        }

        .artist {
            color: ${({ theme }) => theme.colors.textSecondary};
            font-size: 12px;
        }
    }
`;
