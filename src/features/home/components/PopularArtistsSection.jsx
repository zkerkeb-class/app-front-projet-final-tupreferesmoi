import React from 'react';
import { MediaSection } from './MediaSection';

export const PopularArtistsSection = ({ artists, isLoading, onArtistClick }) => (
    <MediaSection
        items={artists}
        isLoading={isLoading}
        type="artist"
        titleKey="home.popularArtists"
        href="/artists"
        onItemClick={onArtistClick}
        getItemProps={(artist) => ({
            title: artist.name,
            imageUrl: artist.imageUrl
        })}
    />
); 