import { useLanguageStore } from './use-language';
import { translations, TranslationKey } from '@/lib/translations';

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return { t, language };
};