import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { getTheme } from '@styles/theme';
import GlobalStyle from '@styles/GlobalStyle';
import { useTheme } from '@contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { QueryProvider } from './QueryProvider';

// Chargement différé des traductions
const loadI18n = () => import('@config/i18n');

export default function FeatureProviders({ children }) {
    const { isDarkTheme } = useTheme();
    const { i18n } = useTranslation();

    useEffect(() => {
        // Chargement asynchrone des traductions
        loadI18n();
    }, []);

    useEffect(() => {
        // Mise à jour de la direction du document
        const currentLang = i18n.language;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
    }, [i18n.language]);

    return (
        <Provider store={store}>
            <QueryProvider>
                <StyledThemeProvider theme={getTheme(isDarkTheme)}>
                    <GlobalStyle />
                    {children}
                </StyledThemeProvider>
            </QueryProvider>
        </Provider>
    );
} 