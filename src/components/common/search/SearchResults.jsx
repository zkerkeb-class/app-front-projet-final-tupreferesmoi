import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { DEFAULT_IMAGES } from '../../../features/player/constants';
import { FiMusic, FiUser, FiDisc } from 'react-icons/fi';

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
`;

const SectionIcon = styled.div`
    color: #10b981;
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

const SearchResults = ({ results, onResultClick, isLoading }) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <LoadingContainer>
                <div>
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

    if (!results || (!results.tracks?.length && !results.artists?.length && !results.albums?.length)) {
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

    return (
        <ResultsContainer>
            <ScrollContainer>
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
                                <Image
                                    src={track.albumId?.cover || DEFAULT_IMAGES}
                                    alt={track.title}
                                    width={40}
                                    height={40}
                                    style={{ objectFit: 'cover' }}
                                />
                            </ImageWrapper>
                            <ItemContent>
                                <ItemTitle>{track.title}</ItemTitle>
                                <ItemSubtitle>
                                    {track.featuring?.map(artist => artist.name).join(', ')}
                                </ItemSubtitle>
                            </ItemContent>
                        </ResultItem>
                    )}
                />

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
                                <Image
                                    src={artist.photo || DEFAULT_IMAGES}
                                    alt={artist.name}
                                    width={40}
                                    height={40}
                                    style={{ objectFit: 'cover' }}
                                />
                            </ImageWrapper>
                            <ItemContent>
                                <ItemTitle>{artist.name}</ItemTitle>
                                <ItemSubtitle>Artiste</ItemSubtitle>
                            </ItemContent>
                        </ResultItem>
                    )}
                />

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
                                <Image
                                    src={album.cover || DEFAULT_IMAGES}
                                    alt={album.title}
                                    width={40}
                                    height={40}
                                    style={{ objectFit: 'cover' }}
                                />
                            </ImageWrapper>
                            <ItemContent>
                                <ItemTitle>{album.title}</ItemTitle>
                                <ItemSubtitle>
                                    {album.artistId?.name || 'Album'}
                                </ItemSubtitle>
                            </ItemContent>
                        </ResultItem>
                    )}
                />
            </ScrollContainer>
        </ResultsContainer>
    );
};

export default SearchResults; 