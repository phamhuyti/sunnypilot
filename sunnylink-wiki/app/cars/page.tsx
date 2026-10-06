import { Metadata } from 'next';
import { Suspense } from 'react';
import PageShell from '../../components/PageShell';
import CarDatabase from '../../components/CarDatabase';

export const metadata: Metadata = {
    title: "Cơ sở dữ liệu xe | Sunnylink Wiki",
    description: "Tìm cài đặt Sunnypilot tốt nhất cho xe của bạn dựa trên ý kiến cộng đồng và yêu cầu phần cứng đã xác minh.",
};

export default function CarsPage() {
    return (
        <PageShell>
            <div>
                <Suspense fallback={<div className="h-screen bg-slate-950" />}>
                    <CarDatabase />
                </Suspense>
            </div>
        </PageShell>
    );
}
