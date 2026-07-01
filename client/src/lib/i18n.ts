import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fa from "../locales/fa.json";
import en from "../locales/en.json";

const savedLanguage = localStorage.getItem("language") || "fa";

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
  },
  lng: savedLanguage,
  fallbackLng: "fa",
  interpolation: {
    escapeValue: false,
  },
});
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
  
  document.title = lng === 'fa' ? 'طراحی پرسشنامه' : 'Form Builder';
});
const updateDocumentDirection = (language: string) => {
  const direction = language === "fa" ? "rtl" : "ltr";

  document.documentElement.lang = language;
  document.documentElement.dir = direction;
};

updateDocumentDirection(i18n.language);

i18n.on("languageChanged", updateDocumentDirection);

export default i18n;
