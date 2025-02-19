import styled from "styled-components";

export const ControlsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-self: center;
    width: 100%;
    padding: 0 16px;
    gap: 8px;
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
    position: relative;

    &[disabled]::before {
        position: absolute;
        right: -50px;
        top: 50%;
        transform: translateY(-50%);
        color: white;
    }

    .control-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        min-width: 200px;
        width: 100%;

        .main-controls {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        @media (max-width: 768px) {
            padding: 0;
            gap: 4px;

            .main-controls {
                gap: 4px;
            }

            button {
                width: 24px;
                height: 24px;

                svg {
                    width: 14px;
                    height: 14px;
                }

                &.play-pause {
                    width: 32px;
                    height: 32px;

                    svg {
                        width: 14px;
                        height: 14px;
                    }
                }
            }
        }

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
            transition: all 0.2s;

            svg {
                width: 20px;
                height: 20px;
            }

            &:hover:not(:disabled) {
                color: ${({ theme }) => theme.colors.text};
                transform: scale(1.06);
            }

            &[data-active="true"] {
                color: ${({ theme }) => theme.colors.primary};
            }

            &.play-pause {
                background: ${({ theme }) => theme.colors.text};
                border-radius: 50%;
                color: ${({ theme }) => theme.colors.background};
                width: 32px;
                height: 32px;

                svg {
                    width: 14px;
                    height: 14px;
                }

                &:hover:not(:disabled) {
                    transform: scale(1.06);
                }
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
    }

    .progress-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 200px;

        @media (max-width: 768px) {
            min-width: 0;
            gap: 2px;
            font-size: 12px;
        }
    }
`;
