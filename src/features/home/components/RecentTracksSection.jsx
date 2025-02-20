import React from 'react';
import { useTrackPlayback } from '@hooks/useTrackPlayback';
import { MediaSection } from './MediaSection';

export const RecentTracksSection = ({ tracks, isLoading, onTrackClick }) => {
    const { handlePlay, isCurrentTrack, isPlaying } = useTrackPlayback();

    return (
        <MediaSection
            items={tracks}
            isLoading={isLoading}
            type="playlist"
            titleKey="home.recentTracks"
            href="/tracks"
            priorityCount={4}
            onItemClick={onTrackClick}
            onItemPlay={(track, index) => handlePlay(track, { tracks, index })}
            getItemProps={(track) => ({
                title: track.title,
                subtitle: track.artist,
                imageUrl: track.coverUrl,
                isPlaying: isCurrentTrack(track) && isPlaying
            })}
        />
    );
}; 