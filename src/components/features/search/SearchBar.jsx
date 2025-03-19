import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    forwardRef,
} from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { musicApi } from "@services/musicApi";
import { DynamicSearchResults } from "@components/common/dynamic";
import { Search, X } from "react-feather";

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
    border-radius: 9999px;
    ${(props) =>
        props.$isFocused &&
        `
        background-color: #2a2a2a;
    `}
`;

const SearchIcon = styled.div`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
    color: ${(props) => (props.$isFocused ? "#fff" : "#9ca3af")};
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
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
        box-shadow: none;
        -webkit-appearance: none;
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
    position: fixed;
    background-color: #121212;
    z-index: 1000;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    margin-top: 0.5rem;
    border: 1px solid #333;
`;

const SearchBar = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [resultsPosition, setResultsPosition] = useState({ top: 0, width: 0, left: 0 });
    const searchTimeout = useRef(null);
    const searchRef = useRef(null);
    const inputWrapperRef = useRef(null);

    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults(null);
            return;
        }

        setIsLoading(true);
        try {
            const response = await musicApi.globalSearch(searchQuery);
            if (response.success) {
                setResults(response.data);
            } else {
                console.error("Search failed:", response.error);
                setResults(null);
            }
        } catch (error) {
            console.error("Search error:", error);
            setResults(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (query) {
            searchTimeout.current = setTimeout(() => {
                handleSearch(query);
            }, DEBOUNCE_DELAY);
        } else {
            setResults(null);
        }

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [query, handleSearch]);

    // Handle click outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Calculate position for dropdown results and handle resize
    useEffect(() => {
        const updatePosition = () => {
            if (inputWrapperRef.current) {
                const rect = inputWrapperRef.current.getBoundingClientRect();
                setResultsPosition({
                    top: rect.bottom,
                    width: rect.width,
                    left: rect.left
                });
            }
        };
        
        if (isFocused && (results || isLoading)) {
            updatePosition();
            // Petit délai pour s'assurer que tout est bien rendu
            setTimeout(updatePosition, 50);
        }
        
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [isFocused, results, isLoading]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleClear = () => {
        setQuery("");
        setResults(null);
        setActiveFilter("ALL");
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleResultClick = () => {
        setQuery("");
        setResults(null);
        setIsFocused(false);
    };

    return (
        <SearchContainer ref={searchRef}>
            <SearchForm onSubmit={(e) => e.preventDefault()}>
                <InputWrapper ref={inputWrapperRef} $isFocused={isFocused}>
                    <SearchIcon $isFocused={isFocused}>
                        <Search size={18} />
                    </SearchIcon>
                    <SearchInput
                        ref={ref}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        placeholder={t("header.searchPlaceholder")}
                        aria-label={t("header.searchPlaceholder")}
                    />
                    {query && (
                        <ClearButton
                            type="button"
                            onClick={handleClear}
                            aria-label={t("common.cancel")}
                        >
                            <X size={20} />
                        </ClearButton>
                    )}
                </InputWrapper>
            </SearchForm>
            {(results || isLoading) && isFocused && (
                <ResultsWrapper 
                    style={{
                        top: `${resultsPosition.top + 8}px`,
                        width: `${resultsPosition.width}px`,
                        left: `${resultsPosition.left}px`
                    }}
                >
                    <DynamicSearchResults
                        results={results}
                        onResultClick={handleResultClick}
                        isLoading={isLoading}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                </ResultsWrapper>
            )}
        </SearchContainer>
    );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
