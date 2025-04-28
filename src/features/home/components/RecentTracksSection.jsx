import React from 'react';
import { useTrackPlayback } from '@hooks/useTrackPlayback';
import { MediaSection } from './MediaSection';

export const RecentTracksSection = ({ tracks, isLoading, onTrackClick }) => {
    const { handlePlay, isCurrentTrack, isPlaying } = useTrackPlayback();

    return (
        <MediaSection
            items={tracks}
            isLoading={isLoading}
            type="track"
            titleKey="home.recentTracks"
            href="/tracks"
            priorityCount={4}
            onItemClick={onTrackClick}
            onPlay={(track, index) => handlePlay(track, { tracks, index })}
            getItemProps={(track) => ({
                title: track.title,
                subtitle: typeof track.artist === 'object' ? track.artist.name : track.artist,
                imageUrl: track.coverUrl,
                isPlaying: isCurrentTrack(track) && isPlaying
            })}
        />
    );
}; 