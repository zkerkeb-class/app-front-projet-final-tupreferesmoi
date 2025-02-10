import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { DEFAULT_IMAGES } from '../../../features/player/constants';
import { FiMusic, FiUser, FiDisc, FiList } from 'react-icons/fi';

// Types de filtres disponibles
const FILTER_TYPES = {
    ALL: 'Tout',
    TRACKS: 'Titres',
    ARTISTS: 'Artistes',
    ALBUMS: 'Albums',
    PLAYLISTS: 'Playlists'
};

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const ResultsContainer = styled.div`
    background-color: #282828;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-radius: 0.5rem;
    overflow: hidden;
    animation: ${fadeIn} 0.2s ease-out;
    border: 1px solid #333333;
    backdrop-filter: blur(8px);
`;

const ScrollContainer = styled.div`
    max-height: 70vh;
    overflow-y: auto;
    padding: 0.75rem;
`;

const LoadingContainer = styled(ResultsContainer)`
    padding: 1rem;
`;

const LoadingItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: .5;
        }
    }
`;

const LoadingImage = styled.div`
    width: 3rem;
    height: 3rem;
    background-color: #333333;
    border-radius: 0.375rem;
`;

const LoadingText = styled.div`
    flex: 1;
    space-y: 0.5rem;
`;

const LoadingTitle = styled.div`
    height: 1rem;
    background-color: #333333;
    border-radius: 0.25rem;
    width: 75%;
`;

const LoadingSubtitle = styled.div`
    height: 0.75rem;
    background-color: #333333;
    border-radius: 0.25rem;
    width: 50%;
    margin-top: 0.5rem;
`;

const SectionContainer = styled.div`
    margin-bottom: 1rem;
    &:last-child {
        margin-bottom: 0;
    }
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
    line-height: 1;
`;

const SectionIcon = styled.div`
    color: #10b981;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 16px;
`;

const ItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const ResultItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: all 0.2s ease;

    &:hover {
        background-color: #333333;
    }
`;

const ImageWrapper = styled.div`
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    position: relative;
    border-radius: ${props => props.$isArtist ? '9999px' : '0.375rem'};
    overflow: hidden;
    transition: all 0.2s ease;

    ${ResultItem}:hover & {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
`;

const ItemContent = styled.div`
    flex: 1;
    min-width: 0;
`;

const ItemTitle = styled.p`
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ItemSubtitle = styled.p`
    color: #9ca3af;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const IconFallback = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333333;
    color: #666666;
    transition: all 0.2s ease;

    ${ResultItem}:hover & {
        color: #888888;
    }
`;

const FilterPills = styled.div`
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    border-bottom: 1px solid #333333;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const FilterPill = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: 1px solid ${props => props.$isActive ? '#1DB954' : '#727272'};
    background-color: ${props => props.$isActive ? '#1DB954' : 'transparent'};
    color: ${props => props.$isActive ? '#000' : '#fff'};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
        border-color: #fff;
    }
`;

const NoResults = styled.div`
    padding: 2rem;
    text-align: center;
    color: #9ca3af;
`;

const SearchResults = ({ results, onResultClick, isLoading, activeFilter, onFilterChange }) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <LoadingContainer>
                <FilterPills>
                    {Object.values(FILTER_TYPES).map((filter) => (
                        <FilterPill
                            key={filter}
                            $isActive={activeFilter === filter}
                            onClick={() => onFilterChange(filter)}
                        >
                            {filter}
                        </FilterPill>
                    ))}
                </FilterPills>
                <div style={{ padding: '1rem' }}>
                    {[1, 2, 3].map((i) => (
                        <LoadingItem key={i}>
                            <LoadingImage />
                            <LoadingText>
                                <LoadingTitle />
                                <LoadingSubtitle />
                            </LoadingText>
                        </LoadingItem>
                    ))}
                </div>
            </LoadingContainer>
        );
    }

    const hasResults = results && (results.tracks?.length > 0 || results.artists?.length > 0 || results.albums?.length > 0 || results.playlists?.length > 0);
    const hasFilteredResults = activeFilter === 'Tout' ? hasResults :
        results && (
            (activeFilter === 'Titres' && results.tracks?.length > 0) ||
            (activeFilter === 'Artistes' && results.artists?.length > 0) ||
            (activeFilter === 'Albums' && results.albums?.length > 0) ||
            (activeFilter === 'Playlists' && results.playlists?.length > 0)
        );

    if (!results) {
        return null;
    }

    const handleItemClick = (type, id) => {
        onResultClick?.();
        router.push(`/${type}/${id}`);
    };

    const ResultSection = ({ title, icon: Icon, items, type, renderItem }) => {
        if (!items?.length) return null;
        
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionIcon>
                        <Icon size={16} />
                    </SectionIcon>
                    <h3>{title}</h3>
                </SectionHeader>
                <ItemsContainer>
                    {items.map((item) => renderItem(item))}
                </ItemsContainer>
            </SectionContainer>
        );
    };

    const renderFallbackIcon = (type, size = 20) => {
        switch (type) {
            case 'track':
                return <FiMusic size={size} />;
            case 'artist':
                return <FiUser size={size} />;
            case 'album':
                return <FiDisc size={size} />;
            case 'playlist':
                return <FiList size={size} />;
            default:
                return null;
        }
    };

    // Filtrer les sections à afficher en fonction du filtre actif
    const shouldShowSection = (sectionType) => {
        if (activeFilter === 'Tout') return true;
        switch (sectionType) {
            case 'tracks':
                return activeFilter === 'Titres';
            case 'artists':
                return activeFilter === 'Artistes';
            case 'albums':
                return activeFilter === 'Albums';
            case 'playlists':
                return activeFilter === 'Playlists';
            default:
                return false;
        }
    };

    const renderPlaylistItem = (playlist) => (
        <ResultItem
            key={playlist._id}
            onClick={() => handleItemClick('playlists', playlist._id)}
        >
            <ImageWrapper>
                {playlist.coverImage?.medium ? (
                    <Image
                        src={playlist.coverImage.medium}
                        alt={playlist.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <IconFallback>
                        {renderFallbackIcon('playlist')}
                    </IconFallback>
                )}
            </ImageWrapper>
            <ItemContent>
                <ItemTitle>{playlist.name}</ItemTitle>
                <ItemSubtitle>
                    {playlist.userId?.username || 'Utilisateur inconnu'} • Playlist
                </ItemSubtitle>
            </ItemContent>
        </ResultItem>
    );

    return (
        <ResultsContainer>
            <FilterPills>
                {Object.values(FILTER_TYPES).map((filter) => (
                    <FilterPill
                        key={filter}
                        $isActive={activeFilter === filter}
                        onClick={() => onFilterChange(filter)}
                    >
                        {filter}
                    </FilterPill>
                ))}
            </FilterPills>
            
            {!hasFilteredResults ? (
                <NoResults>
                    Aucun résultat trouvé {activeFilter !== 'Tout' ? `dans ${activeFilter.toLowerCase()}` : ''}
                </NoResults>
            ) : (
                <ScrollContainer>
                    {shouldShowSection('tracks') && (
                        <ResultSection
                            title="Titres"
                            icon={FiMusic}
                            items={results.tracks}
                            type="tracks"
                            renderItem={(track) => (
                                <ResultItem
                                    key={track._id}
                                    onClick={() => handleItemClick('tracks', track._id)}
                                >
                                    <ImageWrapper>
                                        {track.albumId?.coverImage?.medium ? (
                                            <Image
                                                src={track.albumId.coverImage.medium}
                                                alt={track.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <IconFallback>
                                                {renderFallbackIcon('track')}
                                            </IconFallback>
                                        )}
                                    </ImageWrapper>
                                    <ItemContent>
                                        <ItemTitle>{track.title}</ItemTitle>
                                        <ItemSubtitle>
                                            {track.artistId?.name || 'Artiste inconnu'} • {track.albumId?.title || 'Album inconnu'}
                                        </ItemSubtitle>
                                    </ItemContent>
                                </ResultItem>
                            )}
                        />
                    )}

                    {shouldShowSection('artists') && (
                        <ResultSection
                            title="Artistes"
                            icon={FiUser}
                            items={results.artists}
                            type="artists"
                            renderItem={(artist) => (
                                <ResultItem
                                    key={artist._id}
                                    onClick={() => handleItemClick('artists', artist._id)}
                                >
                                    <ImageWrapper $isArtist>
                                        {artist.image?.medium ? (
                                            <Image
                                                src={artist.image.medium}
                                                alt={artist.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <IconFallback>
                                                {renderFallbackIcon('artist')}
                                            </IconFallback>
                                        )}
                                    </ImageWrapper>
                                    <ItemContent>
                                        <ItemTitle>{artist.name}</ItemTitle>
                                        <ItemSubtitle>Artiste</ItemSubtitle>
                                    </ItemContent>
                                </ResultItem>
                            )}
                        />
                    )}

                    {shouldShowSection('albums') && (
                        <ResultSection
                            title="Albums"
                            icon={FiDisc}
                            items={results.albums}
                            type="albums"
                            renderItem={(album) => (
                                <ResultItem
                                    key={album._id}
                                    onClick={() => handleItemClick('albums', album._id)}
                                >
                                    <ImageWrapper>
                                        {album.coverImage?.medium ? (
                                            <Image
                                                src={album.coverImage.medium}
                                                alt={album.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <IconFallback>
                                                {renderFallbackIcon('album')}
                                            </IconFallback>
                                        )}
                                    </ImageWrapper>
                                    <ItemContent>
                                        <ItemTitle>{album.title}</ItemTitle>
                                        <ItemSubtitle>
                                            {album.artistId?.name || 'Artiste inconnu'} • Album
                                        </ItemSubtitle>
                                    </ItemContent>
                                </ResultItem>
                            )}
                        />
                    )}

                    {shouldShowSection('playlists') && (
                        <ResultSection
                            title="Playlists"
                            icon={FiList}
                            items={results.playlists}
                            type="playlists"
                            renderItem={renderPlaylistItem}
                        />
                    )}
                </ScrollContainer>
            )}
        </ResultsContainer>
    );
};

export default SearchResults; 