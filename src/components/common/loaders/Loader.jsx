import React from "react";
import PropTypes from "prop-types";
import { LoaderContainer, Spinner } from "./styles/Loader.styles";

/**
 * Loader réutilisable avec différentes variantes
 * @example
 * <Loader size="medium" variant="primary" fullscreen />
 */
export const Loader = ({ 
    size = "medium", 
    variant = "primary", 
    fullscreen = false, 
    className = "" 
}) => {
    return (
        <LoaderContainer $fullscreen={fullscreen} className={className}>
            <Spinner $size={size} $variant={variant} />
        </LoaderContainer>
    );
};

Loader.propTypes = {
    /** Taille du loader */
    size: PropTypes.oneOf(["small", "medium", "large"]),
    /** Variante de couleur */
    variant: PropTypes.oneOf(["primary", "secondary", "white"]),
    /** Affiche le loader en plein écran */
    fullscreen: PropTypes.bool,
    /** Classes CSS additionnelles */
    className: PropTypes.string,
};

/**
 * HOC pour ajouter un lazy loading à un composant
 * @example
 * const LazyComponent = withLazyLoading(MyComponent);
 *
 * <LazyComponent loading={isLoading}>
 *   <MyComponent />
 * </LazyComponent>
 */
export const withLazyLoading = (WrappedComponent) => {
    const WithLazyLoading = ({ 
        loading = false, 
        loaderProps = {}, 
        children, 
        ...props 
    }) => {
        if (loading) {
            return <Loader {...loaderProps} />;
        }

        return <WrappedComponent {...props}>{children}</WrappedComponent>;
    };

    WithLazyLoading.propTypes = {
        /** État de chargement */
        loading: PropTypes.bool,
        /** Props à passer au loader */
        loaderProps: PropTypes.object,
        /** Contenu du composant */
        children: PropTypes.node,
    };

    return WithLazyLoading;
};

export default Loader;
