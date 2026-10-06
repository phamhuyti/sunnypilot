import PageShell from '@/components/PageShell';
import ModelLibrary from '@/components/ModelLibrary';
import type { Metadata } from 'next';
import modelsData from '@/data/models.vi.json';
import { fetchModelForumActivity, type ForumActivityMap } from '@/lib/discourse-models-sync';

// Weekly sync of forum vote/comment activity onto each model card.
// Pairs with the per-fetch revalidate inside lib/discourse-models-sync.
export const revalidate = 604800; // 7 days (604800 seconds)

// ──────────────────────────────────────────────────────────────────────
// SEO target: capture searches for "openpilot models" / "comma.ai
// driving models" and surface this database as the authoritative list.
// Keywords are seeded across <head>, an H1-led hero, a long-form FAQ at
// the bottom, and JSON-LD (BreadcrumbList + FAQPage + WebPage).
// ──────────────────────────────────────────────────────────────────────

const SITE_URL = 'https://www.sunnylink.wiki';
const PAGE_URL = `${SITE_URL}/models`;

// Pull the live model count straight from the dataset so the SEO copy
// and structured data never drift from reality.
const MODEL_COUNT = (() => {
    const seen = new Set<string>();
    for (const category of modelsData.categories as { models: { name: string }[] }[]) {
        for (const m of category.models) seen.add(m.name);
    }
    return seen.size;
})();
const LAST_UPDATED = modelsData.lastUpdated;

const TITLE =
    `Mô hình lái openpilot — Cơ sở dữ liệu và so sánh (${MODEL_COUNT}+ mô hình comma.ai và sunnypilot)`;
const DESCRIPTION =
    `Tra cứu và so sánh ${MODEL_COUNT}+ mô hình lái openpilot, comma.ai và sunnypilot theo đánh giá cộng đồng, ngày phát hành, cảm giác đánh lái và khả năng giữ làn. Cập nhật các mô hình E2E mới nhất.`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        'openpilot models',
        'openpilot driving models',
        'openpilot model list',
        'openpilot model comparison',
        'best openpilot model',
        'comma.ai models',
        'comma ai driving models',
        'comma 3x models',
        'comma 3 models',
        'comma.ai self-driving models',
        'sunnypilot models',
        'sunnypilot driving models',
        'sunnylink models',
        'WMI openpilot',
        'world model iteration',
        'end-to-end openpilot model',
        'openpilot E2E model',
        'openpilot wiki',
        'openpilot model 2026',
        'openpilot tuning',
        'sunnylink wiki',
    ],
    alternates: {
        canonical: PAGE_URL,
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: PAGE_URL,
        siteName: 'Sunnylink Wiki',
        type: 'website',
        locale: 'vi_VN',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Mô hình lái openpilot — So sánh đầy đủ",
        description: DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
};

// FAQ content — also fed into JSON-LD below. Each answer is intentionally
// keyword-rich and self-contained so it can earn its own snippet.
const FAQ: { q: string; a: string }[] = [
    {
        q: "Mô hình lái openpilot là gì?",
        a: "Mô hình lái openpilot là mạng nơ-ron cốt lõi của openpilot — hệ thống hỗ trợ lái nâng cao mã nguồn mở của comma.ai. Mỗi mô hình được huấn luyện trên hàng triệu dặm dữ liệu lái thực tế để dự đoán đánh lái, vị trí trong làn và điều khiển dọc. Mỗi mô hình có phong cách riêng: bám giữa làn, cắt đỉnh cua hoặc ưu tiên độ thoải mái cho hành khách.",
    },
    {
        q: "Mô hình openpilot nào tốt nhất hiện nay?",
        a: "Không có một mô hình openpilot tốt nhất cho mọi trường hợp — lựa chọn phù hợp tùy xe và cách lái. WMI V12 là mô hình chủ lực cho lái hằng ngày năm 2026; OP Model 10 v3 là gợi ý Off-Policy hiện tại; Down to Ride v6 được ưa chuộng vì độ êm; Dark Souls v2 hợp xe tải và SUV; Recertified Herbalist vẫn là chuẩn ổn định trên cao tốc. Dùng bảng so sánh phía trên để lọc theo thẻ, điểm và cảm giác đánh lái.",
    },
    {
        q: "Mô hình openpilot đến từ comma.ai hay sunnypilot?",
        a: "Phần lớn mô hình lái gốc được comma.ai cung cấp cùng openpilot. sunnypilot — nhánh cộng đồng phổ biến — tích hợp nhiều mô hình này cùng các phiên bản cộng đồng tinh chỉnh và thử nghiệm qua Sunnylink. Wiki theo dõi cả bản phát hành chính thức của comma.ai, bản tùy chỉnh sunnypilot và mô hình cộng đồng như TCPmV3 (The Cool Peoples Model).",
    },
    {
        q: "WMI trong openpilot có nghĩa là gì?",
        a: "WMI là viết tắt của World Model Iteration. Dòng WMI (V10, V11, V12) dùng kiến trúc E2E của comma.ai, nhìn thế giới giống người lái hơn: hiểu cảnh 3D, biển dừng, giao lộ và mép đường thay vì chỉ vạch sơn. WMI V12 là mô hình chủ lực hiện tại và là lựa chọn khởi đầu được khuyến nghị cho phần lớn người lái.",
    },
    {
        q: "Mô hình openpilot end-to-end (E2E) là gì?",
        a: "Mô hình end-to-end (E2E) là mạng nơ-ron được huấn luyện để ánh xạ trực tiếp hình ảnh camera thành lệnh lái, thay vì dựa vào chuỗi nhận thức → lập kế hoạch → điều khiển được tinh chỉnh thủ công. Nhờ đó, hành vi giống người hơn trong tình huống đô thị phức tạp như biển dừng, giao lộ và nhập làn, nhưng cảm giác giữ hướng trên cao tốc thẳng có thể kém cứng hơn. Dòng WMI và phần lớn bản phát hành comma.ai năm 2025/2026 đều là E2E.",
    },
    {
        q: "comma.ai phát hành mô hình openpilot mới thường xuyên đến mức nào?",
        a: `Comma.ai pushes new openpilot driving models on a roughly weekly cadence through their Firehose / SOTA training pipeline. Sunnypilot then ships stabilized cuts to Sunnylink users along with community-tuned variants. This database is updated as new models land — last refreshed ${LAST_UPDATED}.`,
    },
    {
        q: "Mô hình lái sunnypilot có khác mô hình openpilot của comma.ai không?",
        a: "Các mô hình dùng chung kiến trúc nền tảng, nhưng sunnypilot cung cấp nhiều lựa chọn hơn qua Sunnylink — gồm mô hình thử nghiệm, cộng đồng tinh chỉnh và đời cũ mà comma.ai không còn tích hợp mặc định, như Blue Diamond hoặc Recertified Herbalist. Trên sunnypilot, bạn có thể chuyển giữa hàng chục mô hình ngay khi dùng; openpilot gốc thường chỉ có mô hình đi kèm bản phát hành.",
    },
    {
        q: "Vì sao một số mô hình openpilot bám lệch trái hoặc phải trong làn?",
        a: "Xu hướng bám lệch làn thường do dữ liệu huấn luyện của mô hình không khớp vị trí lắp camera của bạn. Cách khắc phục thông thường là điều chỉnh Camera Offset trong cài đặt Sunnylink — thường +0.05 đến +0.10 cho mô hình bám trái. Phần chi tiết trên từng thẻ mô hình nêu rõ các vấn đề bám trái/phải đã biết để bạn tham khảo trước khi cài.",
    },
];

const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'openpilot Models', item: PAGE_URL },
    ],
};

const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
};

// ItemList of every openpilot driving model as a SoftwareApplication,
// with community AggregateRating where we have score + vote data.
// Lets AI search surfaces (Google AI Overviews, Perplexity, ChatGPT
// search) cite individual models with their community rating.
type ModelEntry = {
    name: string;
    date?: string;
    consensus?: string;
    vibe?: string;
    bestFor?: string;
    badge?: string;
    communityScore?: number;
    totalVotes?: number;
    forumUrl?: string;
};

const MODEL_LIST_LD = (() => {
    const seen = new Map<string, ModelEntry>();
    for (const category of modelsData.categories as { models: ModelEntry[] }[]) {
        for (const m of category.models) {
            if (!seen.has(m.name)) seen.set(m.name, m);
        }
    }
    const items = Array.from(seen.values()).map((m, idx) => {
        const description =
            [m.consensus, m.vibe].filter(Boolean).join(' ').trim() ||
            `${m.name} — openpilot driving model documented on Sunnylink Wiki.`;

        const sw: Record<string, unknown> = {
            '@type': 'SoftwareApplication',
            name: m.name,
            applicationCategory: 'DriverAssistanceApplication',
            applicationSubCategory: 'openpilot driving model',
            operatingSystem: 'sunnypilot, openpilot',
            url: `${PAGE_URL}#${encodeURIComponent(m.name)}`,
            description,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        };
        if (m.date) sw.datePublished = m.date;
        if (m.forumUrl) sw.sameAs = m.forumUrl;
        if (m.badge) sw.award = m.badge;
        if (typeof m.communityScore === 'number' && typeof m.totalVotes === 'number' && m.totalVotes > 0) {
            sw.aggregateRating = {
                '@type': 'AggregateRating',
                ratingValue: m.communityScore,
                bestRating: 100,
                worstRating: 0,
                ratingCount: m.totalVotes,
            };
        }
        return {
            '@type': 'ListItem',
            position: idx + 1,
            item: sw,
        };
    });

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${PAGE_URL}#models-list`,
        name: 'openpilot Driving Models',
        description:
            "Danh sách đầy đủ mô hình lái openpilot, comma.ai và sunnypilot, kèm đánh giá cộng đồng và thông tin chi tiết.",
        numberOfItems: items.length,
        itemListElement: items,
    };
})();

const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': PAGE_URL,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: 'vi',
    dateModified: LAST_UPDATED,
    isPartOf: { '@type': 'WebSite', name: 'Sunnylink Wiki', url: SITE_URL },
    about: [
        { '@type': 'Thing', name: 'openpilot', sameAs: 'https://github.com/commaai/openpilot' },
        { '@type': 'Thing', name: 'comma.ai', sameAs: 'https://comma.ai' },
        { '@type': 'Thing', name: 'sunnypilot', sameAs: 'https://sunnypilot.ai' },
        { '@type': 'Thing', name: 'Self-driving car neural networks' },
    ],
    mainContentOfPage: {
        '@type': 'WebPageElement',
        cssSelector: '#openpilot-models-library',
    },
};

function collectForumUrls(): string[] {
    const urls: string[] = [];
    for (const category of modelsData.categories as { models: { forumUrl?: string }[] }[]) {
        for (const m of category.models) {
            if (m.forumUrl) urls.push(m.forumUrl);
        }
    }
    return urls;
}

export default async function ModelsPage() {
    let forumActivity: ForumActivityMap = {};
    try {
        forumActivity = await fetchModelForumActivity(collectForumUrls());
    } catch (err) {
        console.error('[models page] forum activity fetch failed:', err);
    }

    return (
        <PageShell pageHasOwnHeading>
            <div>
                {/* SEO hero — server-rendered, so the H1 and intro paragraph
                    land in the initial HTML for crawlers. */}
                <header className="mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 mb-2 leading-tight">
                         Mô hình lái openpilot — Cơ sở dữ liệu và so sánh đầy đủ </h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                         Tra cứu danh sách đầy đủ nhất do cộng đồng duy trì về <strong className="text-slate-200">mô hình lái openpilot</strong>  từ <strong className="text-slate-200">comma.ai</strong>  và <strong className="text-slate-200">sunnypilot</strong>. Compare {MODEL_COUNT}+ mô hình — WMI V12, OP Model 10, Dark Souls, Tomb Raider, Off-Policy, Down to Ride và nhiều mô hình khác — kèm đánh giá cộng đồng, ngày phát hành, cảm giác đánh lái và hành vi giữ làn. Xem trực quan phong cách lái của từng mô hình theo thời gian thực. Cập nhật thường xuyên các bản phát hành E2E mới nhất. </p>

                    <div className="flex items-start gap-3.5 p-4 bg-slate-950/40 backdrop-blur-md border border-amber-500/10 border-l-4 border-l-amber-500/50 rounded-xl shadow-lg shadow-amber-950/5">
                        <svg className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                                 Lưu ý và thông báo tham khảo </h4>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                 Trải nghiệm thực tế tùy thiết bị comma, vị trí lắp, phần cứng xe, nhánh openpilot và phiên bản phần mềm. Trang này chỉ để tham khảo và không khẳng định mô tả hoàn toàn chính xác hành vi mô hình khi lái thực tế. Luôn chú ý và sẵn sàng điều khiển thủ công ngay lập tức. </p>
                        </div>
                    </div>
                </header>

                <section id="openpilot-models-library" aria-label="Cơ sở dữ liệu mô hình openpilot">
                    <ModelLibrary forumActivity={forumActivity} />
                </section>

                {/* Long-form FAQ — visible content, matched 1:1 by the FAQPage
                    JSON-LD below so Google can render rich answer snippets. */}
                <section className="mt-16 border-t border-slate-800 pt-10 max-w-4xl">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">
                         Giới thiệu mô hình lái openpilot </h2>
                    <p className="text-slate-400 text-xs mb-8">
                         Câu hỏi thường gặp về openpilot của comma.ai, sunnypilot và bộ chọn mô hình. </p>
                    <div className="space-y-6">
                        {FAQ.map((item) => (
                            <article key={item.q}>
                                <h3 className="text-sm md:text-base font-semibold text-slate-100 mb-1.5">
                                    {item.q}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {item.a}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(MODEL_LIST_LD) }}
                />
            </div>
        </PageShell>
    );
}
