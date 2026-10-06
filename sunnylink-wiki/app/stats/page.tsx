import type { Metadata } from 'next';
import StatsClient from './StatsClient';

export const metadata: Metadata = {
    title: "Thống kê trực tiếp | Sunnylink",
    description: "Thống kê đội xe trực tiếp cho cộng đồng Sunnypilot. Theo dõi người dùng, mô hình đang hoạt động và nhiều dữ liệu khác.",
    keywords: ['sunnylink', 'sunnylink stats', 'sunnypilot', 'sunnypilot stats', 'sunnypilot wiki', 'sunnypilot features', 'sunnylink app', 'sunnypilot settings', 'sunnypilot sunnylink', 'sunnylink sunnypilot latest version', 'fleet statistics', 'live stats'],
    openGraph: {
        title: "Thống kê trực tiếp Sunnylink",
        description: "Thống kê đội xe Sunnypilot theo thời gian thực.",
    }
};

export default function StatsPage() {
    return <StatsClient />;
}
