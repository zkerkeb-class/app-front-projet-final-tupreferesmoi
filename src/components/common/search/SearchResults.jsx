import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { DEFAULT_IMAGES } from '../../../features/player/constants';
import { FiMusic, FiUser, FiDisc, FiList } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Music, User, Disc, List } from 'react-feather';

// Types de filtres disponibles
const FILTER_TYPES = {
    ALL: 'search.filters.all',
    TRACKS: 'search.filters.tracks',
    ARTISTS: 'search.filters.artists',
    ALBUMS: 'search.filters.albums',
    PLAYLISTS: 'search.filters.playlists'
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
    const { t } = useTranslation();

    const filterButtons = [
        { key: 'ALL', label: t('search.filters.all'), icon: null },
        { key: 'TRACKS', label: t('search.filters.tracks'), icon: FiMusic },
        { key: 'ARTISTS', label: t('search.filters.artists'), icon: FiUser },
        { key: 'ALBUMS', label: t('search.filters.albums'), icon: FiDisc },
        { key: 'PLAYLISTS', label: t('search.filters.playlists'), icon: FiList }
    ];

    if (isLoading) {
        return (
            <LoadingContainer>
                <FilterPills>
                    {filterButtons.map(({ key, label }) => (
                        <FilterPill
                            key={key}
                            $isActive={activeFilter === key}
                            onClick={() => onFilterChange(key)}
                        >
                            {label}
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
                        {Icon && <Icon size={16} />}
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

    const shouldShowSection = (sectionType) => {
        if (activeFilter === 'ALL') return true;
        switch (sectionType) {
            case 'tracks':
                return activeFilter === 'TRACKS';
            case 'artists':
                return activeFilter === 'ARTISTS';
            case 'albums':
                return activeFilter === 'ALBUMS';
            case 'playlists':
                return activeFilter === 'PLAYLISTS';
            default:
                return false;
        }
    };

    const renderTrackItem = (track) => (
        <ResultItem
            key={track._id}
            onClick={() => handleItemClick('tracks', track._id)}
        >
            <ImageWrapper>
                {track.albumId?.coverImage?.thumbnail ? (
                    <Image
                        src={track.albumId.coverImage.thumbnail}
                        alt={track.title}
                        fill
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <IconFallback>
                        {renderFallbackIcon('track', 24)}
                    </IconFallback>
                )}
            </ImageWrapper>
            <ItemContent>
                <ItemTitle>{track.title}</ItemTitle>
                <ItemSubtitle>
                    {t('search.labels.artist')}: {track.artist}
                </ItemSubtitle>
            </ItemContent>
        </ResultItem>
    );

    const renderArtistItem = (artist) => (
        <ResultItem
            key={artist._id}
            onClick={() => handleItemClick('artists', artist._id)}
        >
            <ImageWrapper $isArtist>
                {artist.image?.thumbnail ? (
                    <Image
                        src={artist.image.thumbnail}
                        alt={artist.name}
                        fill
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <IconFallback>
                        {renderFallbackIcon('artist', 24)}
                    </IconFallback>
                )}
            </ImageWrapper>
            <ItemContent>
                <ItemTitle>{artist.name}</ItemTitle>
                <ItemSubtitle>{t('search.labels.artist')}</ItemSubtitle>
            </ItemContent>
        </ResultItem>
    );

    const renderAlbumItem = (album) => (
        <ResultItem
            key={album._id}
            onClick={() => handleItemClick('albums', album._id)}
        >
            <ImageWrapper>
                {album.coverImage?.thumbnail ? (
                    <Image
                        src={album.coverImage.thumbnail}
                        alt={album.title}
                        fill
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <IconFallback>
                        {renderFallbackIcon('album', 24)}
                    </IconFallback>
                )}
            </ImageWrapper>
            <ItemContent>
                <ItemTitle>{album.title}</ItemTitle>
                <ItemSubtitle>
                    {t('search.labels.album')} • {album.artist}
                </ItemSubtitle>
            </ItemContent>
        </ResultItem>
    );

    const renderPlaylistItem = (playlist) => (
        <ResultItem
            key={playlist._id}
            onClick={() => handleItemClick('playlists', playlist._id)}
        >
            <ImageWrapper>
                {playlist.coverImage?.thumbnail ? (
                    <Image
                        src={playlist.coverImage.thumbnail}
                        alt={playlist.name}
                        fill
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <IconFallback>
                        {renderFallbackIcon('playlist', 24)}
                    </IconFallback>
                )}
            </ImageWrapper>
            <ItemContent>
                <ItemTitle>{playlist.name}</ItemTitle>
                <ItemSubtitle>
                    {t('search.labels.playlist')} • {playlist.owner?.username || t('playlists.unknownUser')}
                </ItemSubtitle>
            </ItemContent>
        </ResultItem>
    );

    const hasResults = results && (
        results.tracks?.length > 0 ||
        results.artists?.length > 0 ||
        results.albums?.length > 0 ||
        results.playlists?.length > 0
    );

    const hasFilteredResults = activeFilter === 'ALL' ? hasResults :
        results && (
            (activeFilter === 'TRACKS' && results.tracks?.length > 0) ||
            (activeFilter === 'ARTISTS' && results.artists?.length > 0) ||
            (activeFilter === 'ALBUMS' && results.albums?.length > 0) ||
            (activeFilter === 'PLAYLISTS' && results.playlists?.length > 0)
        );

    return (
        <ResultsContainer>
            <FilterPills>
                {filterButtons.map(({ key, label }) => (
                    <FilterPill
                        key={key}
                        $isActive={activeFilter === key}
                        onClick={() => onFilterChange(key)}
                    >
                        {label}
                    </FilterPill>
                ))}
            </FilterPills>
            
            {!hasFilteredResults ? (
                <NoResults>
                    {t('search.noResults')} {activeFilter !== 'ALL' && t('search.noResultsIn', { filter: filterButtons.find(f => f.key === activeFilter)?.label.toLowerCase() })}
                </NoResults>
            ) : (
                <ScrollContainer>
                    {shouldShowSection('tracks') && (
                        <ResultSection
                            title={t('search.sections.tracks')}
                            icon={FiMusic}
                            items={results?.tracks}
                            type="track"
                            renderItem={renderTrackItem}
                        />
                    )}
                    {shouldShowSection('artists') && (
                        <ResultSection
                            title={t('search.sections.artists')}
                            icon={FiUser}
                            items={results?.artists}
                            type="artist"
                            renderItem={renderArtistItem}
                        />
                    )}
                    {shouldShowSection('albums') && (
                        <ResultSection
                            title={t('search.sections.albums')}
                            icon={FiDisc}
                            items={results?.albums}
                            type="album"
                            renderItem={renderAlbumItem}
                        />
                    )}
                    {shouldShowSection('playlists') && (
                        <ResultSection
                            title={t('search.sections.playlists')}
                            icon={FiList}
                            items={results?.playlists}
                            type="playlist"
                            renderItem={renderPlaylistItem}
                        />
                    )}
                </ScrollContainer>
            )}
        </ResultsContainer>
    );
};

export default SearchResults; 