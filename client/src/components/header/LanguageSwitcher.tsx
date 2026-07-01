import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const nextLanguage = i18n.language === "fa" ? "en" : "fa";

  const changeLanguage = async () => {
    await i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  return (
    <button type="button" onClick={changeLanguage}>
      {i18n.language === "fa" ? "English" : "فارسی"}
    </button>
  );
}
