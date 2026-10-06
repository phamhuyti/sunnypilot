'use client';

import { useEffect, useState } from 'react';
import { BranchDistributionChart, TopModelsChart } from './StatsCharts';
import { STATS_SNAPSHOT } from '@/lib/statsSnapshot';

export default function VietnameseStats() {
    const [stats, setStats] = useState(STATS_SNAPSHOT);
    useEffect(() => {
        const controller = new AbortController();
        const refresh = () => fetch('/api/stats', { signal: controller.signal })
            .then(response => response.ok ? response.json() : null)
            .then(data => { if (data && !controller.signal.aborted) setStats(data); })
            .catch(() => { /* The bundled snapshot stays visible if live data is unavailable. */ });
        refresh();
        const timer = setInterval(refresh, 60000);
        return () => { controller.abort(); clearInterval(timer); };
    }, []);
    return <section className="space-y-6" aria-label="Bảng thống kê tiếng Việt">
        <p className="text-sm text-slate-400">
            {stats.source === 'live' ? 'Dữ liệu trực tiếp từ Sunnylink. Tự cập nhật mỗi phút.' : `Dữ liệu đã lưu ngày ${stats.lastUpdated}. Tự chuyển sang dữ liệu trực tiếp khi kết nối được.`}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">🌿 Phân bố nhánh phần mềm</h3>
                <BranchDistributionChart data={stats.branchDistribution} />
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">🚗 Nền tảng xe phổ biến</h3>
                <TopModelsChart data={stats.topPlatforms} />
            </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">🧠 Mô hình lái phổ biến</h3>
            <p className="text-xs text-slate-400 mb-4">Số tuyến đường từ bản dữ liệu đi kèm website; phần này không phải dữ liệu trực tiếp.</p>
            <TopModelsChart data={stats.topModels} />
        </div>
    </section>;
}
