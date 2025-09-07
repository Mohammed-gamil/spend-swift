import { useEffect } from 'react';
import { useLanguageStore } from '@/hooks/use-language';

interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * LanguageProvider - Provider component that manages HTML document attributes
 * Updates document.documentElement lang and dir attributes based on language store
 * Should wrap the entire app to ensure proper RTL/LTR handling
 */
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { language, direction } = useLanguageStore();

  useEffect(() => {
    // Update HTML document attributes
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    
    // Update page title based on language
    const titles = {
      en: 'Purchase Request Management System',
      ar: 'نظام إدارة طلبات الشراء'
    };
    document.title = titles[language];
  }, [language, direction]);

  return <>{children}</>;
};