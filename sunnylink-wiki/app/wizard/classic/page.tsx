import PageShell from '@/components/PageShell';
import SetupWizard from '@/components/SetupWizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Trình hướng dẫn thiết lập cổ điển | Sunnylink",
    description: "Trình hướng dẫn tương tác tạo cấu hình Sunnypilot phù hợp với xe, phong cách lái và kinh nghiệm của bạn.",
    keywords: ['sunnylink', 'sunnylink wizard', 'sunnypilot', 'sunnypilot setup wizard'],
    openGraph: {
        title: "Trình hướng dẫn thiết lập cổ điển Sunnylink",
        description: "Tạo cấu hình Sunnypilot cá nhân hóa trong vài phút.",
    }
};

export default function ClassicWizardPage() {
    return (
        <PageShell>
            <div className="max-w-4xl mx-auto">
                <SetupWizard />
            </div>
        </PageShell>
    );
}
