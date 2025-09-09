import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure HTML lang/dir are set before React renders to avoid FOUC
(() => {
	try {
		const STORAGE_KEY = 'language-storage';
		const persisted = localStorage.getItem(STORAGE_KEY);
		// Zustand persist typically stores { state: { language, direction, ... }, version?: number }
		let language: 'en' | 'ar' = 'en';
		let direction: 'ltr' | 'rtl' = 'ltr';
		// Fallback to simple 'locale' key if present (e.g. set elsewhere)
		const looseLocale = localStorage.getItem('locale');
		if (persisted) {
			const parsed = JSON.parse(persisted);
			const state = parsed?.state ?? parsed;
			if (state?.language === 'ar') {
				language = 'ar';
				direction = 'rtl';
			} else if (state?.language === 'en') {
				language = 'en';
				direction = 'ltr';
			} else if (state?.direction === 'rtl' || state?.direction === 'ltr') {
				direction = state.direction;
				language = direction === 'rtl' ? 'ar' : 'en';
			}
		} else if (looseLocale === 'ar' || looseLocale === 'en') {
			language = looseLocale;
			direction = looseLocale === 'ar' ? 'rtl' : 'ltr';
		}
		document.documentElement.lang = language;
		document.documentElement.dir = direction;
	} catch {
		// Fallback defaults
		document.documentElement.lang = 'en';
		document.documentElement.dir = 'ltr';
	}
})();

createRoot(document.getElementById('root')!).render(<App />);
