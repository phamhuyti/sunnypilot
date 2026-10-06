'use client';

import { useState } from 'react';
import PageShell from '@/components/PageShell';
import DriveSimulation, { deriveDrivingProfile } from '@/components/DriveSimulation';
import OnroadLogSourcePanel from '@/components/OnroadLogSourcePanel';
import OpenpilotLogReplay from '@/components/OpenpilotLogReplay';
import type { ParsedLog } from '@/lib/openpilotLog/parseLogFile';

// A stand-in "stable benchmark" profile for the left/synthetic pane — this
// page is about comparing the *kind* of output (heuristic vs. real), not
// any one specific community model's rating.
const BASELINE_MODEL = {
    name: 'Synthetic Baseline',
    tags: ['Stable Benchmark'],
    communityScore: 80,
};

export default function ModelReplayClient() {
    const [log, setLog] = useState<ParsedLog | null>(null);
    const [fileName, setFileName] = useState('');
    const profile = deriveDrivingProfile(BASELINE_MODEL);

    return (
        <PageShell>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
                     Thị giác mô hình tổng hợp và thực </h1>
                <p className="text-sm text-slate-400 max-w-3xl">
                     Hai nội dung khác nhau đặt cạnh nhau — không phải cùng một tuyến đường. </p>
            </div>

            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300">Nội dung thực chất là:</strong>  Khung bên trái là mô phỏng dựa trên quy tắc của wiki — hoạt ảnh được tinh chỉnh thủ công để minh họa cảm giác mô hình từ phản hồi cộng đồng, chạy trên vòng thử tổng hợp thiết kế thủ công (Gauntlet). Đây là <em>không</em>  chạy bất kỳ mô hình thực nào. Khung bên phải phát lại chuyến lái openpilot thực đã ghi: giải mã dữ liệu thực <code className="text-amber-100">modelV2</code>  Thông điệp từ bản thực{' '}
                <code className="text-amber-100">rlog</code>/<code className="text-amber-100">qlog</code>{' '}
                 tệp và dựng hình bằng bản chuyển trực tiếp sang TypeScript của mã hiển thị onroad openpilot — vì thế quỹ đạo và vạch làn là đầu ra thực của mô hình thực trên đường thực, không phải tái tạo. Hai khung là các tuyến khác nhau; đây là so sánh mô phỏng dựa trên quy tắc với đầu ra mô hình thực, không phải thử nghiệm khớp từng khung hình. </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                             Tổng hợp — mô phỏng dựa trên quy tắc </h2>
                    </div>
                    <DriveSimulation profile={profile} seedKey="model-replay-baseline" scenarioOverride="gauntlet" />
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                             Mô hình thực — chuyến lái đã ghi </h2>
                    </div>
                    {log ? (
                        <div className="space-y-2">
                            <OpenpilotLogReplay log={log} />
                            <button
                                type="button"
                                onClick={() => setLog(null)}
                                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                 ← tải nhật ký khác ({fileName})
                            </button>
                        </div>
                    ) : (
                        <div
                            className="force-dark relative w-full rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center"
                            style={{ aspectRatio: '16 / 9' }}
                        >
                            <div className="w-full max-w-sm px-6">
                                <OnroadLogSourcePanel onLoaded={(parsed, name) => { setLog(parsed); setFileName(name); }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
}
