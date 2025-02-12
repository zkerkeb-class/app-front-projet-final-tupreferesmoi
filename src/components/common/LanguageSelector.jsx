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
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #282828;
    border: none;
    border-radius: 500px;
    color: #fff;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;

    &:hover {
        background-color: #333;
    }
`;

const LanguageMenu = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background-color: #282828;
    border-radius: 4px;
    padding: 0.5rem;
    min-width: 120px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const LanguageOption = styled.button`
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    color: ${({ $active, theme }) => $active ? theme.colors.primary : '#fff'};
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    border-radius: 2px;

    &:hover {
        background-color: #333;
    }
`;

const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' }
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

    return (
        <Container ref={menuRef}>
            <LanguageButton onClick={toggleMenu}>
                {languages.find(lang => lang.code === selectedLanguage)?.label}
                <ChevronDown size={16} />
            </LanguageButton>
            <LanguageMenu $isOpen={isOpen}>
                {languages.map((language) => (
                    <LanguageOption
                        key={language.code}
                        $active={selectedLanguage === language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                    >
                        {language.label}
                    </LanguageOption>
                ))}
            </LanguageMenu>
        </Container>
    );
};

export default LanguageSelector; 