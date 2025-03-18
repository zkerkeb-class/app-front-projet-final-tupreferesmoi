import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@components/common';
import { Section } from '@components/common/sections/Section';
import { GridLoader } from '@components/common/loaders';
import { MediaGrid } from './MediaGrid';

export const MediaSection = ({
    items,
    isLoading,
    type,
    titleKey,
    href,
    priorityCount = 3,
    onItemClick,
    onItemPlay,
    getItemProps = () => ({})
}) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <Section title={t(titleKey)} href={href} showAllText={t('common.showAll')}>
                <GridLoader count={6} />
            </Section>
        );
    }

    return (
        <Section title={t(titleKey)} href={href} showAllText={t('common.showAll')}>
            <MediaGrid>
                {items.map((item, index) => (
                    <Card
                        key={item._id || item.id || `${type}-${index}`}
                        type={type}
                        onClick={() => onItemClick?.(item._id || item.id)}
                        onItemPlay={onItemPlay ? () => onItemPlay(item, index) : undefined}
                        priority={index < priorityCount}
                        {...getItemProps(item)}
                    />
                ))}
            </MediaGrid>
        </Section>
    );
};

MediaSection.propTypes = {
    items: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['album', 'artist', 'playlist']).isRequired,
    titleKey: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    priorityCount: PropTypes.number,
    onItemClick: PropTypes.func,
    onItemPlay: PropTypes.func,
    getItemProps: PropTypes.func
}; 