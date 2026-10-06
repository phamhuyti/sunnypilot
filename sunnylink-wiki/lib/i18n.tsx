'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';

// Load Vietnamese at first paint; retain English for fallback and language switching.
import en from '../locales/en.json';
import vi from '../locales/vi.json';

export type Locale = 'vi' | 'en' | 'ko' | 'zh' | 'fr' | 'de' | 'es';

export const SUPPORTED_LOCALES: Locale[] = ['vi', 'en', 'ko', 'zh', 'fr', 'de', 'es'];

export const LOCALE_META: Record<Locale, { flag: string; name: string }> = {
    vi: { flag: '🇻🇳', name: 'Tiếng Việt' },
    en: { flag: '🇺🇸', name: 'English' },
    ko: { flag: '🇰🇷', name: '한국어' },
    zh: { flag: '🇨🇳', name: '中文' },
    fr: { flag: '🇫🇷', name: 'Français' },
    de: { flag: '🇩🇪', name: 'Deutsch' },
    es: { flag: '🇲🇽', name: 'Español' },
};

type Messages = Record<string, string>;

const localeLoaders: Record<Locale, () => Promise<{ default: Messages }>> = {
    vi: () => Promise.resolve({ default: vi as Messages }),
    en: () => Promise.resolve({ default: en as Messages }),
    ko: () => import('../locales/ko.json') as Promise<{ default: Messages }>,
    zh: () => import('../locales/zh.json') as Promise<{ default: Messages }>,
    fr: () => import('../locales/fr.json') as Promise<{ default: Messages }>,
    de: () => import('../locales/de.json') as Promise<{ default: Messages }>,
    es: () => import('../locales/es.json') as Promise<{ default: Messages }>,
};

const messagesCache: Partial<Record<Locale, Messages>> = {
    vi: vi as Messages,
    en: en as Messages,
};

const STORAGE_KEY = 'sunnylink-wiki-vi-locale';

function detectZhFlag(): string {
    if (typeof navigator === 'undefined') return '🇨🇳';
    const lang = navigator.language?.toLowerCase() ?? '';
    // Taiwanese locales use zh-TW or zh-Hant
    if (lang === 'zh-tw' || lang.startsWith('zh-hant')) return '🇹🇼';
    return '🇨🇳';
}

function getSavedLocale(): Locale | null {
    if (typeof localStorage === 'undefined') return null;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SUPPORTED_LOCALES.includes(saved as Locale)) {
            return saved as Locale;
        }
    } catch {
        // localStorage may be blocked
    }
    return null;
}

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    getLocaleMeta: () => Record<Locale, { flag: string; name: string }>;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: 'vi',
    setLocale: () => { },
    t: (key: string) => key,
    getLocaleMeta: () => LOCALE_META,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('vi');
    const [zhFlag] = useState<string>(() => detectZhFlag());
    const [, setMessagesVersion] = useState(0);

    // Keep the server render and hydration identical, then restore an explicit choice.
    useEffect(() => {
        const saved = getSavedLocale();
        if (saved) setLocaleState(saved);
    }, []);

    // Load other locale messages dynamically when selected
    useEffect(() => {
        if (messagesCache[locale]) return;
        let active = true;
        localeLoaders[locale]().then((mod) => {
            messagesCache[locale] = mod.default;
            if (active) {
                setMessagesVersion((v) => v + 1);
            }
        });
        return () => {
            active = false;
        };
    }, [locale]);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        try {
            localStorage.setItem(STORAGE_KEY, newLocale);
        } catch {
            // ignore
        }
        // Update <html lang> attribute
        document.documentElement.lang = newLocale;
    }, []);

    // Sync <html lang> on client
    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const t = useCallback(
        (key: string, params?: Record<string, string | number>): string => {
            const localized = messagesCache[locale]?.[key];
            const english = messagesCache.en?.[key];
            if (localized === undefined && english === undefined && process.env.NODE_ENV !== 'production') {
                // A missing key renders as the key itself, which is how raw
                // strings like `cars.recommended` reach the page.
                console.warn(`[i18n] Missing translation for "${key}" (locale: ${locale})`);
            }
            let value = localized ?? english ?? key;
            if (params) {
                Object.entries(params).forEach(([k, v]) => {
                    value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
                });
            }
            return value;
        },
        [locale]
    );

    const getLocaleMeta = useCallback(
        (): Record<Locale, { flag: string; name: string }> => ({
            ...LOCALE_META,
            zh: { ...LOCALE_META.zh, flag: zhFlag },
        }),
        [zhFlag]
    );

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, getLocaleMeta }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export const useTranslation = useLanguage;
