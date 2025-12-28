'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import enTranslations from '@/translations/en.json';
import bnTranslations from '@/translations/bn.json';

type Language = 'en' | 'bn';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: enTranslations,
  bn: bnTranslations,
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const lang = get().language;
        const keys = key.split('.');
        let value: any = translations[lang];
        
        for (const k of keys) {
          value = value?.[k];
        }
        
        return value || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
