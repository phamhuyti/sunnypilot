import viDisplay from './vi-display.json';
import type { Locale } from './i18n';

/** Translate only the visible label; device enums and exported values stay canonical. */
export function localizeValue(value: string | number, locale: Locale = 'vi'): string {
    const text = String(value);
    if (locale !== 'vi') return text;
    const dictionary = viDisplay as Record<string, string>;
    if (dictionary[text]) return dictionary[text];
    if (text.includes('\n')) return text.split('\n').map(line => localizeValue(line, locale)).join('\n');
    if (text.includes(' · ')) return text.split(' · ').map(part => localizeValue(part, locale)).join(' · ');
    const polarity = text.match(/^Community polarity (\d+)\/100$/);
    if (polarity) return `Đánh giá cộng đồng ${polarity[1]}/100`;
    const evidence = text.match(/^([+−] )?(tag|feel|best for|badge|category|pro|con|consensus|note): (.*)$/);
    if (evidence) {
        const labels: Record<string, string> = { tag: 'thẻ', feel: 'cảm giác', 'best for': 'phù hợp nhất', badge: 'nhãn', category: 'danh mục', pro: 'ưu điểm', con: 'nhược điểm', consensus: 'cộng đồng', note: 'ghi chú' };
        return `${evidence[1] ?? ''}${labels[evidence[2]]}: ${dictionary[evidence[3]] ?? evidence[3]}`;
    }
    return text;
}
