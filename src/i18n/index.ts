import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "wanderly_lang",
    },
    interpolation: { escapeValue: false },
  });

const getCleanLng = (lng: string | undefined): string => {
  if (!lng) return "en";
  const shortLng = lng.split("-")[0];
  return ["en", "ar"].includes(shortLng) ? shortLng : "en";
};

const applyDir = (lng: string | undefined) => {
  const cleanLng = getCleanLng(lng);
  const dir = cleanLng === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", cleanLng);
};

applyDir(i18n.resolvedLanguage || i18n.language);
i18n.on("languageChanged", (lng) => applyDir(lng));

export default i18n;