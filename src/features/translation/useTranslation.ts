import { useLanguageStore } from './useLanguageStore';
import en from './idioms/en';

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const t = (key: string): string =>
    language === 'en' ? en[key] ?? key : key;

  return { t, language, setLanguage };
}
