import styled from "styled-components";
import { VolumeControlContainer } from "./volumeControl.styles";
import { ControlsContainer } from "./playbackControls.styles";

export const FullscreenContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.background};
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;

    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        filter: blur(30px);
        opacity: 0.3;
        object-fit: cover;
    }

    .main-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -65%);
        width: 100%;
        max-width: 1000px;
        padding: 0 48px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            text-align: center;
            width: 100%;
            max-width: 300px;

            img {
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                border-radius: 4px;
                width: 100%;
                height: auto;
                max-width: 300px;
            }

            .track-info {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 24px;
                width: 100%;

                .title {
                    font-size: 24px;
                    font-weight: 700;
                    color: ${({ theme }) => theme.colors.text};
                }

                .artist {
                    font-size: 14px;
                    color: ${({ theme }) => theme.colors.textSecondary};
                }
            }
        }
    }

    .player-section {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 64px;
        opacity: ${({ $showControls }) => ($showControls ? 1 : 0)};
        transition: opacity 0.3s ease;

        .controls-wrapper {
            width: 100%;
            max-width: 1000px;
            padding: 0 48px;
            display: flex;
            justify-content: center;
        }

        ${ControlsContainer} {
            width: 100%;
            max-width: 800px;

            .control-buttons {
                gap: 32px;
                margin-bottom: 32px;
                justify-content: center;

                button {
                    width: 40px;
                    height: 40px;

                    svg {
                        width: 24px;
                        height: 24px;
                    }

                    &.play-pause {
                        width: 48px;
                        height: 48px;

                        svg {
                            width: 20px;
                            height: 20px;
                        }
                    }
                }
            }

            .progress-container {
                width: 100%;
                min-width: 400px;
            }
        }

        ${VolumeControlContainer} {
            position: absolute;
            bottom: 16px;
            right: 32px;
            padding-right: 0;

            .volume-slider {
                width: 120px;
            }

            button {
                width: 40px;
                height: 40px;

                svg {
                    width: 24px;
                    height: 24px;
                }
            }
        }
    }
`;

export const MinimizeButton = styled.button`
    position: fixed;
    top: 24px;
    right: 24px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: pointer;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.3s ease;
    z-index: 2;

    &:hover {
        color: ${({ theme }) => theme.colors.text};
    }
`;
