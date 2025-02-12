import React, { memo } from "react";
import PropTypes from "prop-types";
import { StyledIconButton } from "./styles/IconButton.styles";

/**
 * Bouton avec icône réutilisable
 * @example
 * import { Play } from "react-feather";
 *
 * <IconButton
 *   onClick={() => console.log("clicked")}
 *   variant="primary"
 *   active={isActive}
 * >
 *   <Play />
 * </IconButton>
 */
const IconButton = memo(({
    children,
    variant = "default",
    $active = false,
    disabled = false,
    onClick,
    className = "",
    title,
    size = "medium",
    ...otherProps
}) => {
    // Filtrer les props pour ne pas les passer au DOM
    const { active, ...restProps } = otherProps;

    return (
        <StyledIconButton
            onClick={onClick}
            disabled={disabled}
            className={className}
            title={title}
            $variant={variant}
            $size={size}
            $active={$active || active} // Support des deux syntaxes pour la rétrocompatibilité
            {...restProps}
        >
            {children}
        </StyledIconButton>
    );
});

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
    /** Contenu du bouton (généralement une icône) */
    children: PropTypes.node.isRequired,
    /** Variante du bouton */
    variant: PropTypes.oneOf(["default", "primary", "secondary"]),
    /** État actif du bouton */
    $active: PropTypes.bool,
    /** État désactivé du bouton */
    disabled: PropTypes.bool,
    /** Fonction appelée au clic */
    onClick: PropTypes.func,
    /** Classes CSS additionnelles */
    className: PropTypes.string,
    /** Texte au survol */
    title: PropTypes.string,
    /** Taille du bouton */
    size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default IconButton;
