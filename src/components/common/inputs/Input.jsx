import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { InputContainer, StyledInput } from "./styles/Input.styles";

/**
 * Input réutilisable avec support pour les icônes
 * @example
 * import { Search } from "react-feather";
 *
 * <Input
 *   placeholder="Rechercher..."
 *   icon={<Search />}
 *   onChange={(e) => console.log(e.target.value)}
 * />
 */
export const Input = forwardRef(
    (
        {
            icon,
            variant = "default",
            error,
            className = "",
            disabled = false,
            fullWidth = false,
            placeholder,
            value,
            onChange,
            onFocus,
            onBlur,
            ...props
        },
        ref
    ) => {
        return (
            <InputContainer
                className={className}
                $hasIcon={!!icon}
                $variant={variant}
                $error={error}
                $fullWidth={fullWidth}
            >
                {icon && <span className="icon">{icon}</span>}
                <StyledInput
                    ref={ref}
                    $hasIcon={!!icon}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...props}
                />
            </InputContainer>
        );
    }
);

Input.displayName = "Input";

Input.propTypes = {
    /** Icône à afficher dans l'input */
    icon: PropTypes.node,
    /** Variante de style */
    variant: PropTypes.oneOf(["default", "filled", "outlined"]),
    /** Message d'erreur */
    error: PropTypes.string,
    /** Classes CSS additionnelles */
    className: PropTypes.string,
    /** État désactivé */
    disabled: PropTypes.bool,
    /** Prend toute la largeur disponible */
    fullWidth: PropTypes.bool,
    /** Texte de placeholder */
    placeholder: PropTypes.string,
    /** Valeur de l'input */
    value: PropTypes.string,
    /** Fonction appelée au changement de valeur */
    onChange: PropTypes.func,
    /** Fonction appelée au focus */
    onFocus: PropTypes.func,
    /** Fonction appelée à la perte du focus */
    onBlur: PropTypes.func,
};

export default Input;
