import type { Metadata } from 'next';
import ModelReplayClient from './ModelReplayClient';

// Experimental comparison tool, not wiki reference content — kept out of
// search results and sitemaps.
export const metadata: Metadata = {
    title: "Thị giác mô hình tổng hợp và thực | Sunnylink",
    description: "So sánh mô phỏng lái dựa trên quy tắc với bản phát lại mô hình openpilot được ghi từ chuyến lái thực.",
    robots: { index: false, follow: false },
};

export default function ModelReplayPage() {
    return <ModelReplayClient />;
}
