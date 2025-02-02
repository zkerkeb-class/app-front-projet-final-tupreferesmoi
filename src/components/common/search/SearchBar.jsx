import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { musicApi } from '../../../services/musicApi';
import SearchResults from './SearchResults';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const DEBOUNCE_DELAY = 300; // milliseconds

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 36rem;
`;

const SearchForm = styled.form`
    position: relative;
`;

const InputWrapper = styled.div`
    position: relative;
    transition: all 0.3s ease;
    ${props => props.$isFocused && `
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    `}
`;

const SearchIcon = styled.div`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
    color: ${props => props.$isFocused ? '#fff' : '#9ca3af'};
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 0.75rem 2.75rem;
    background-color: #242424;
    color: white;
    border-radius: 9999px;
    border: none;
    font-size: 0.875rem;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        background-color: #2a2a2a;
    }

    &:hover {
        background-color: #2a2a2a;
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

const ClearButton = styled.button`
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    padding: 0.25rem;
    border-radius: 9999px;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: white;
        background-color: #333333;
    }
`;

const ResultsWrapper = styled.div`
    position: absolute;
    width: 100%;
    top: 100%;
    margin-top: 0.5rem;
    z-index: 50;
`;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();

    // Handle click outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId;
            return (value) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (!value.trim()) {
                    setResults(null);
                    setIsLoading(false);
                    return;
                }
                setIsLoading(true);
                timeoutId = setTimeout(async () => {
                    try {
                        const response = await musicApi.globalSearch(value);
                        if (response.success) {
                            setResults(response.data);
                            setShowResults(true);
                        } else {
                            console.error('Search failed:', response.error);
                            setResults(null);
                        }
                    } catch (error) {
                        console.error('Search error:', error);
                        setResults(null);
                    } finally {
                        setIsLoading(false);
                    }
                }, DEBOUNCE_DELAY);
            };
        })(),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            debouncedSearch(value);
        } else {
            setShowResults(false);
            setResults(null);
        }
    };

    const handleClearSearch = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSearchTerm('');
        setResults(null);
        setShowResults(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleResultClick = useCallback(() => {
        setShowResults(false);
        setIsFocused(false);
    }, []);

    return (
        <SearchContainer ref={searchRef}>
            <SearchForm onSubmit={e => e.preventDefault()}>
                <InputWrapper $isFocused={isFocused}>
                    <SearchIcon $isFocused={isFocused}>
                        <FiSearch size={18} />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            setIsFocused(true);
                            if (searchTerm.trim()) setShowResults(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Rechercher des titres, artistes ou albums..."
                        spellCheck="false"
                    />
                    {searchTerm && (
                        <ClearButton
                            type="button"
                            onClick={handleClearSearch}
                        >
                            <IoMdClose size={20} />
                        </ClearButton>
                    )}
                </InputWrapper>
            </SearchForm>
            {showResults && (
                <ResultsWrapper>
                    <SearchResults
                        results={results}
                        isLoading={isLoading}
                        onResultClick={handleResultClick}
                    />
                </ResultsWrapper>
            )}
        </SearchContainer>
    );
};

export default SearchBar; 