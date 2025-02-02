import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DEFAULT_IMAGES } from '../../../features/player/constants';
import { FiMusic, FiUser, FiDisc } from 'react-icons/fi';

const SearchResults = ({ results, onResultClick, isLoading }) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="absolute w-full bg-black/90 backdrop-blur-md rounded-xl shadow-2xl mt-2 p-4 z-50 max-h-[80vh] overflow-y-auto border border-gray-800">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-md"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!results || (!results.tracks?.length && !results.artists?.length && !results.albums?.length)) {
        return null;
    }

    const handleItemClick = (type, id) => {
        onResultClick?.();
        router.push(`/${type}/${id}`);
    };

    return (
        <div className="absolute w-full bg-black/90 backdrop-blur-md rounded-xl shadow-2xl mt-2 p-4 z-50 max-h-[80vh] overflow-y-auto border border-gray-800">
            {results.tracks?.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-white text-lg font-bold mb-3">
                        <FiMusic className="text-green-500" />
                        <h3>Titres</h3>
                    </div>
                    {results.tracks.map((track) => (
                        <div
                            key={track._id}
                            className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => handleItemClick('tracks', track._id)}
                        >
                            <div className="flex-shrink-0 w-10 h-10 relative">
                                <Image
                                    src={track.albumId?.cover || DEFAULT_IMAGES.TRACK}
                                    alt={track.title}
                                    width={40}
                                    height={40}
                                    className="rounded object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{track.title}</p>
                                <p className="text-gray-400 text-xs truncate">
                                    {track.featuring?.map(artist => artist.name).join(', ')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results.artists?.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-white text-lg font-bold mb-3">
                        <FiUser className="text-green-500" />
                        <h3>Artistes</h3>
                    </div>
                    {results.artists.map((artist) => (
                        <div
                            key={artist._id}
                            className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => handleItemClick('artists', artist._id)}
                        >
                            <div className="flex-shrink-0 w-10 h-10 relative">
                                <Image
                                    src={artist.photo || DEFAULT_IMAGES.ARTIST}
                                    alt={artist.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{artist.name}</p>
                                <p className="text-gray-400 text-xs truncate">Artiste</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results.albums?.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-white text-lg font-bold mb-3">
                        <FiDisc className="text-green-500" />
                        <h3>Albums</h3>
                    </div>
                    {results.albums.map((album) => (
                        <div
                            key={album._id}
                            className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => handleItemClick('albums', album._id)}
                        >
                            <div className="flex-shrink-0 w-10 h-10 relative">
                                <Image
                                    src={album.cover || DEFAULT_IMAGES.ALBUM}
                                    alt={album.title}
                                    width={40}
                                    height={40}
                                    className="rounded object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{album.title}</p>
                                <p className="text-gray-400 text-xs truncate">
                                    {album.artistId?.name || 'Album'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults; 