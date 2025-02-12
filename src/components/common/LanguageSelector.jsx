import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'react-feather';

const Container = styled.div`
    position: relative;
    display: inline-block;
`;

const LanguageButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 50px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 700;
    height: 32px;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    ${({ $isOpen }) => !$isOpen && `
        &:hover::before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: -40px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 12px;
            background-color: #282828;
            color: white;
            font-size: 0.875rem;
            border-radius: 4px;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1001;
        }
    `}
`;

const LanguageLabel = styled.div`
    padding: 0 8px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const LanguageMenu = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: #282828;
    border-radius: 4px;
    padding: 4px;
    min-width: 120px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const LanguageOption = styled.button`
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.text};
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    border-radius: 2px;
    font-weight: ${({ $active }) => $active ? '700' : '400'};

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const languages = [
    { code: 'fr', label: 'FR', fullName: 'Français' },
    { code: 'en', label: 'EN', fullName: 'English' },
    { code: 'ar', label: 'ع', fullName: 'العربية' }
];

const LanguageSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('fr');
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLanguageSelect = (code) => {
        setSelectedLanguage(code);
        setIsOpen(false);
        // La logique de changement de langue sera implémentée plus tard
    };

    const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

    return (
        <Container ref={menuRef}>
            <LanguageButton onClick={toggleMenu} data-tooltip={currentLanguage?.fullName} $isOpen={isOpen}>
                <LanguageLabel>
                    {currentLanguage?.label}
                    <ChevronDown size={16} />
                </LanguageLabel>
            </LanguageButton>
            <LanguageMenu $isOpen={isOpen}>
                {languages.map((language) => (
                    <LanguageOption
                        key={language.code}
                        $active={selectedLanguage === language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                    >
                        {language.fullName}
                    </LanguageOption>
                ))}
            </LanguageMenu>
        </Container>
    );
};

export default LanguageSelector;