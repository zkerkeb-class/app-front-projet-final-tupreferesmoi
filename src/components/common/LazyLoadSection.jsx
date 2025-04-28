import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const LazyLoadSection = ({ children, threshold = 0.1 }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { ref, inView } = useInView({
        threshold,
        triggerOnce: true
    });

    if (inView && !isLoaded) {
        setIsLoaded(true);
    }

    return (
        <div ref={ref}>
            {isLoaded ? children : <div style={{ height: '200px' }} />}
        </div>
    );
}; 