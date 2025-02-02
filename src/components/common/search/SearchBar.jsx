import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { musicApi } from '../../../services/musicApi';
import SearchResults from './SearchResults';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const DEBOUNCE_DELAY = 300; // milliseconds

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const router = useRouter();

    // Handle click outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
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

    const handleClearSearch = () => {
        setSearchTerm('');
        setResults(null);
        setShowResults(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
            setShowResults(false);
        }
    };

    return (
        <div className="relative w-full max-w-xl" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => searchTerm.trim() && setShowResults(true)}
                        placeholder="Rechercher des titres, artistes ou albums..."
                        className="w-full px-4 py-2.5 pl-11 pr-10 bg-white/10 text-white rounded-full 
                                 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/20
                                 hover:bg-white/20 transition-all duration-200"
                        spellCheck="false"
                    />
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                                     hover:text-white transition-colors duration-200"
                        >
                            <IoMdClose className="text-xl" />
                        </button>
                    )}
                </div>
            </form>
            {showResults && (
                <SearchResults
                    results={results}
                    isLoading={isLoading}
                    onResultClick={() => setShowResults(false)}
                />
            )}
        </div>
    );
};

export default SearchBar; 