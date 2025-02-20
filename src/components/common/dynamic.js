import dynamic from 'next/dynamic';
import ComponentLoader from './loaders/ComponentLoader';

// Modals - Ces composants doivent rester dynamiques car ils sont chargés à la demande
export const DynamicAddToPlaylistModal = dynamic(
    () => import('./AddToPlaylistModal'),
    {
        loading: () => <ComponentLoader />,
        ssr: false
    }
);

// Search Components - Le composant de recherche doit rester dynamique car il n'est chargé que lors d'une recherche
export const DynamicSearchResults = dynamic(
    () => import('./search/SearchResults'),
    {
        loading: () => <ComponentLoader />,
        ssr: false
    }
); 