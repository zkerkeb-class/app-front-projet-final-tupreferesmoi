import styled from "styled-components";

const StyledPlayButton = styled.button`
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: ${({ size }) => size === "small" ? "24px" : "56px"};
    height: ${({ size }) => size === "small" ? "24px" : "56px"};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0,0,0,.3);

    &:hover {
        transform: scale(1.06);
        background: ${({ theme }) => theme.colors.primaryHover};
    }

    svg {
        width: ${({ size }) => size === "small" ? "12px" : "24px"};
        height: ${({ size }) => size === "small" ? "12px" : "24px"};
    }
`;

export const PlayButton = ({ onClick, isPlaying, size = "large" }) => {
    return (
        <StyledPlayButton onClick={onClick} size={size}>
            {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4L20 12L6 20V4Z" fill="currentColor"/>
                </svg>
            )}
        </StyledPlayButton>
    );
}; 