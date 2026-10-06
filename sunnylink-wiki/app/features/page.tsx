import PageShell from '@/components/PageShell';
import FeatureGuide from '@/components/FeatureGuide';
import { fetchAllDiscourseContent } from '@/lib/discourse-sync';
import { mapDiscourseContent } from '@/lib/discourse-mapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Hướng dẫn tính năng | Sunnylink",
    description: "Hướng dẫn chi tiết các tính năng Sunnypilot. Tìm hiểu MADS luôn bật, hồ sơ làn đường động và nhiều tính năng khác.",
    keywords: ['sunnylink', 'sunnylink features', 'sunnypilot', 'sunnypilot features', 'sunnypilot wiki', 'sunnylink app', 'sunnypilot settings', 'sunnypilot sunnylink', 'sunnylink sunnypilot latest version', 'MADS', 'Dynamic Lane Profile'],
    openGraph: {
        title: "Hướng dẫn tính năng Sunnylink",
        description: "Master your Sunnypilot experience with our detailed feature guide.",
    }
};

export default async function FeaturesPage() {
    let discourseFeatures: Record<string, string> = {};

    try {
        const contentMap = await fetchAllDiscourseContent();
        const mapped = mapDiscourseContent(contentMap);
        discourseFeatures = Object.fromEntries(mapped.features);
    } catch (err) {
        console.error('[features] Failed to fetch Discourse content:', err);
    }

    return (
        <PageShell>
            <div className="max-w-4xl mx-auto">
                <FeatureGuide discourseFeatures={discourseFeatures} />
            </div>
        </PageShell>
    );
}
