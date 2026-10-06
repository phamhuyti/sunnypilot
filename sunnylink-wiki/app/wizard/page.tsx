import PageShell from '@/components/PageShell';
import ConfigWizard from '@/components/ConfigWizard';
import ExitWizardButton from '@/components/ExitWizardButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Trình tạo cấu hình | Sunnylink",
    description: "Tạo tệp cấu hình sunnypilot hoàn chỉnh với các cài đặt đã được cộng đồng thử nghiệm cho xe của bạn. Hướng dẫn từng bước và xuất JSON.",
    keywords: ['sunnylink', 'sunnypilot config builder', 'sunnypilot configuration', 'sunnypilot setup wizard', 'sunnypilot json config', 'sunnypilot settings generator', 'sunnylink wizard'],
    openGraph: {
        title: "Trình tạo cấu hình Sunnylink",
        description: "Tạo tệp cấu hình sunnypilot dùng được ngay trong vài phút với các gợi ý đã được cộng đồng thử nghiệm.",
    }
};

export default function WizardPage() {
    return (
        <PageShell showHeader={false}>
            <div className="max-w-4xl mx-auto">
                <ConfigWizard />
            </div>
        </PageShell>
    );
}
