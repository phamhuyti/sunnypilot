import type { Metadata } from 'next';
import SimulatorLab from '@/components/new-sim/SimulatorLab';

export const metadata: Metadata = {
  title: "Phòng mô phỏng lái | Sunnylink Wiki",
  description: "Trình mô phỏng đường 3D thử nghiệm với xe tương tác, đường cong, tín hiệu và biển dừng.",
  robots: { index: false, follow: false },
};

export default function NewSimPage() {
  return <SimulatorLab />;
}
