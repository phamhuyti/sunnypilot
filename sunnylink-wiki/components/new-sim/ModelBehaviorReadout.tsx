'use client';

import type { Telemetry } from '@/lib/new-sim/simulation';
import type { ModelSimProfile } from '@/lib/new-sim/modelProfiles';
import { localizeValue } from '@/lib/localizeValue';
import styles from './ModelBehaviorReadout.module.css';

export default function ModelBehaviorReadout({ telemetry: t, model, onRestart }: { telemetry: Telemetry; model: ModelSimProfile; onRestart: () => void }) {
  return <section className={styles.panel} aria-label="Hành vi mô hình và phản hồi liên quan">
    <div className={styles.heading}><div><span>HÀNH VI KHI DI CHUYỂN</span><h2>{model.name}</h2></div><button onClick={onRestart}>Khởi động lại chuyến lái của mô hình này</button></div>
    <div className={styles.metrics}>
      <div><span>Vị trí trong làn</span><strong>{Math.abs(t.lanePosition * 100).toFixed(0)} <small>cm {Math.abs(t.lanePosition) < 0.02 ? 'ở giữa' : t.lanePosition > 0 ? 'trái' : 'phải'}</small></strong><p>{(t.laneErrorRms * 100).toFixed(0)}  cm độ lệch RMS</p></div>
      <div><span>Góc bánh trước</span><strong>{Math.abs(t.steering).toFixed(1)}<small>° {Math.abs(t.steering) < 0.1 ? '' : t.steering > 0 ? 'trái' : 'phải'}</small></strong><p>{(Math.abs(t.lateralAcceleration) / 9.81).toFixed(2)}  g gia tốc ngang</p></div>
      <div><span>Gia tốc</span><strong>{t.acceleration >= 0 ? '+' : ''}{t.acceleration.toFixed(1)} <small>m/s²</small></strong><p>{t.brake ? "Đang phanh" : "Đã nhả phanh"} · {t.peakJerk.toFixed(1)}  m/s³ độ giật cực đại</p></div>
      <div><span>Khoảng cách bám xe</span><strong>{t.gap === null ? '—' : Math.round(t.gap)} <small>m</small></strong><p>{model.headway.toFixed(1)}s mục tiêu cơ bản · {model.departureLag.toFixed(1)}s độ trễ khởi hành</p></div>
    </div>
    <div className={styles.status} role="status"><span>{localizeValue(t.modelReaction) }</span><span>{t.stops}  Lần dừng hẳn · {t.interventions}  Lần hiệu chỉnh làn của trình mô phỏng</span></div>
    <details className={styles.evidence}>
      <summary>Vì sao mô hình lái như vậy <span>{localizeValue(model.evidenceCoverage)}  Mức độ bao phủ phản hồi</span></summary>
      <p>Chọn mô hình sẽ khởi động lại cùng đường và giao thông để so sánh. Nhịp độ lái điều chỉnh các cài đặt cơ bản. Tham số ước lượng các phản hồi trong danh mục mô hình. Đánh giá tổng thể chỉ điều chỉnh mức độ của lỗi đã được nêu rõ. Đặc tính chưa có thông tin dùng giá trị trung lập; phản hồi riêng cho một xe có thể không áp dụng cho mọi xe.</p>
      {model.sentiment && <div className={styles.sentiment}><span>{Math.round(model.sentiment.positive)}% tích cực</span><span>{Math.round(model.sentiment.neutral)}% trung lập</span><span>{Math.round(model.sentiment.negative)}% tiêu cực</span><span>{model.sentiment.votes === null ? "Chưa có số lượt bình chọn" : `${model.sentiment.votes} votes`}</span></div>}
      <div className={styles.evidenceRows}>{model.evidence.length ? model.evidence.map((e, i) => <div key={`${model.id}-${i}`}><span>{localizeValue(e.dimension) }</span><b>{localizeValue(e.effect) }</b><blockquote>“{localizeValue(e.quote) }”</blockquote><small>{localizeValue(e.source) }</small></div>) : <p>Phản hồi đã lưu chưa mô tả đặc tính lái cụ thể nào.</p>}</div>
      <p>Trình mô phỏng áp dụng giới hạn giữ xe trong làn và tránh va chạm dùng chung. Các lần hiệu chỉnh làn được đếm ở trên; chúng không chứng minh mô hình tự phục hồi. Việc không dừng hẳn chỉ được minh họa khi phản hồi nêu rõ.</p>
      {model.forumUrl && <a href={model.forumUrl} target="_blank" rel="noopener noreferrer">Đọc thảo luận cộng đồng ↗</a>}
    </details>
  </section>;
}
