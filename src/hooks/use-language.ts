import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageState {
  language: Language;
  direction: Direction;
  isRTL: boolean;
}

interface LanguageActions {
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const languageMap: Record<Language, Direction> = {
  'en': 'ltr',
  'ar': 'rtl'
};

export const useLanguageStore = create<LanguageState & LanguageActions>()(
  persist(
    (set, get) => ({
      // State
  language: 'ar',
  direction: 'rtl',
  isRTL: true,

      // Actions
      setLanguage: (language: Language) => {
        const direction = languageMap[language];
        const isRTL = direction === 'rtl';
        
        // Update document attributes
        document.documentElement.setAttribute('dir', direction);
        document.documentElement.setAttribute('lang', language);
        
        set({
          language,
          direction,
          isRTL
        });
      },

      toggleLanguage: () => {
        const { language } = get();
        const newLanguage = language === 'en' ? 'ar' : 'en';
        get().setLanguage(newLanguage);
      }
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply language and direction on page load
          document.documentElement.setAttribute('dir', state.direction);
          document.documentElement.setAttribute('lang', state.language);
        }
      }
    }
  )
);