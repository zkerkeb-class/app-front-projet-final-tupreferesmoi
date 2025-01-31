import styled, { css } from "styled-components";

export const CardContainer = styled.div`
    background: transparent;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;

    &:hover {
        background: ${({ theme }) => theme.colors.secondary};

        .play-button {
            opacity: 1;
            transform: translateY(0);
        }

        ${({ $type }) =>
            $type !== "artist" &&
            css`
                .image::after {
                    opacity: 1;
                }
            `}
    }
`;

export const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 16px;
    aspect-ratio: 1;
    border-radius: ${({ $type }) => ($type === "artist" ? "50%" : "4px")};
    overflow: hidden;

    ${({ $type }) =>
        $type === "artist" &&
        css`
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        `}

    .play-button {
        position: absolute;
        right: 8px;
        bottom: 8px;
        opacity: 0;
        transform: translateY(8px);
        transition: all 0.3s ease;
        z-index: 2;

        button {
            background: ${({ theme }) => theme.colors.primary} !important;
            color: ${({ theme }) => theme.colors.text} !important;
        }

        &:hover {
            transform: translateY(0) scale(1.1);
        }
    }

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.4) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;

export const Content = styled.div`
    h3 {
        font-size: 16px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    p {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;
