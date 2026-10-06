import PageShell from '@/components/PageShell';
import ModelQuiz from '@/components/ModelQuiz';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Câu hỏi tìm mô hình phù hợp | Sunnylink",
    description: "Trả lời nhanh 3 câu hỏi để tìm mô hình lái Sunnypilot phù hợp với xe và phong cách lái của bạn. Dựa trên dữ liệu cộng đồng từ hơn 80 mô hình.",
    keywords: ['sunnylink', 'sunnypilot model finder', 'sunnypilot quiz', 'sunnypilot best model', 'sunnypilot driving model recommendation', 'which sunnypilot model', 'sunnypilot model quiz'],
    openGraph: {
        title: "Tìm mô hình lái phù hợp nhất",
        description: "Trả lời 3 câu hỏi để nhận 3 gợi ý mô hình phù hợp nhất dựa trên dữ liệu cộng đồng.",
    }
};

export default function QuizPage() {
    return (
        <PageShell>
            <div className="max-w-4xl mx-auto">
                <ModelQuiz />
            </div>
        </PageShell>
    );
}
