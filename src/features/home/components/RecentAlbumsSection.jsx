import React from 'react';
import { MediaSection } from './MediaSection';

export const RecentAlbumsSection = ({ albums, isLoading, onAlbumClick }) => (
    <MediaSection
        items={albums}
        isLoading={isLoading}
        type="album"
        titleKey="home.recentAlbums"
        href="/albums"
        onItemClick={onAlbumClick}
        getItemProps={(album) => ({
            title: album.title,
            subtitle: album.artist,
            imageUrl: album.coverUrl
        })}
    />
); 