import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "../locales/en.json";
import frTranslations from "../locales/fr.json";
import arTranslations from "../locales/ar.json";

// Fonction pour détecter la direction du texte en fonction de la langue
const getLanguageDirection = (lng) => {
    return lng === 'ar' ? 'rtl' : 'ltr';
};

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enTranslations,
        },
        fr: {
            translation: frTranslations,
        },
        ar: {
            translation: arTranslations,
        },
    },
    lng: localStorage.getItem('i18nextLng') || "fr", // Utilise la langue stockée ou le français par défaut
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

// Mettre à jour la direction du document lors du changement de langue
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = getLanguageDirection(lng);
    document.documentElement.lang = lng;
});

export default i18n;
