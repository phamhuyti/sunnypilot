'use client';

import { useState, useEffect } from 'react';
import { useLanguage, Locale } from './i18n';
import modelsEn from '../data/models.json';
import modelsVi from '../data/models.vi.json';

const modelsLoaders: Record<Locale, () => Promise<{ default: unknown }>> = {
    vi: () => Promise.resolve({ default: modelsVi }),
    en: () => Promise.resolve({ default: modelsEn }),
    ko: () => import('../data/models.ko.json'),
    zh: () => import('../data/models.zh.json'),
    fr: () => import('../data/models.fr.json'),
    de: () => import('../data/models.de.json'),
    es: () => import('../data/models.es.json'),
};

const modelsCache: Partial<Record<Locale, typeof modelsEn>> = {
    vi: modelsVi as unknown as typeof modelsEn,
    en: modelsEn,
};

export function useTranslatedModels() {
    const { locale } = useLanguage();
    const [data, setData] = useState<typeof modelsEn>(() => modelsCache[locale] ?? modelsVi as unknown as typeof modelsEn);

    useEffect(() => {
        if (modelsCache[locale]) return;

        let isMounted = true;
        modelsLoaders[locale]().then((mod) => {
            const typedData = mod.default as unknown as typeof modelsEn;
            modelsCache[locale] = typedData;
            if (isMounted) {
                setData(typedData);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [locale]);

    return modelsCache[locale] ?? data;
}
