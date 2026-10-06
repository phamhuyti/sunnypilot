# Sunnylink Wiki — Tiếng Việt

Bản sao mã nguồn của [sunnylink.wiki](https://sunnylink.wiki), tích hợp trong repo sunnypilot tại `sunnylink-wiki/`. Website dùng Next.js 16, React 19 và Tailwind CSS 4; tiếng Việt là ngôn ngữ mặc định.

## Chạy trên máy

Dùng **Node.js 20.20.x** và npm. Dependency `better-sqlite3` 9 của bản gốc không tương thích Node.js 24.

```bash
cd sunnylink-wiki
npm ci
npm run dev
```

Mở http://localhost:3000. Để chạy bản production:

```bash
npm run build
npm start
```

Không cần tài khoản hay cơ sở dữ liệu ngoài để tra cứu. Website có sẵn dữ liệu cài đặt, mô hình, xe và tính năng; thống kê và hoạt động diễn đàn trực tiếp cần kết nối Internet. Trang thống kê tiếng Việt dùng biểu đồ trong ứng dụng, tự chuyển sang dữ liệu đã lưu khi nguồn trực tiếp không truy cập được; ngày dữ liệu được ghi rõ. Các liên kết tài liệu, báo lỗi, ủng hộ và bảng điều khiển sunnylink vẫn dẫn đến dịch vụ gốc.

## Bản dịch

- `locales/vi.json`: giao diện, trình hướng dẫn và khảo sát.
- `data/{toggles,models,cars,features}.vi.json`: nội dung tiếng Việt.
- `lib/vi-display.json`: nhãn hiển thị cho giá trị cấu hình gốc.
- `scripts/localization/overrides.json`: thuật ngữ đã hiệu chỉnh.

Bản dịch ban đầu được tạo bằng Google Translate, sau đó hiệu chỉnh thuật ngữ giao diện và điều khiển xe. Giữ nguyên tên mô hình, tên xe, mã tham số, URL, dữ liệu số và giá trị cấu hình để bảo toàn tìm kiếm, liên kết và xuất JSON. Cần tiếp tục rà soát chuyên môn các mô tả kỹ thuật trước khi dùng làm tài liệu hướng dẫn vận hành.

Ngôn ngữ được lưu riêng trên trình duyệt. Lần truy cập đầu hiển thị tiếng Việt ngay từ HTML server; có thể chuyển ngôn ngữ bằng nút cờ.

Kiểm tra:

```bash
npm run i18n:check
npm run vi:check
npm run typecheck
npm run build
```

## Nguồn và giấy phép

Nguồn: https://github.com/vinnie291/sunnylink-wiki

Commit đã sao chép: `7468293884d03468f371e1a39bb39eb2f6b73a9a` (ngày 06/10/2026).

Giữ nguyên giấy phép MIT và thông tin tác giả trong [LICENSE](LICENSE). Sao chép mã ứng dụng, dữ liệu phục vụ website và tài nguyên hình ảnh; bỏ lịch sử Git lồng nhau, bản xuất hội thoại Discord thô, công cụ Discord nhị phân, cấu hình trợ lý và các tệp bản sao `(1)` không dùng khi chạy website. Bỏ mã theo dõi Analytics/Clarity của chủ website gốc.

Các tính năng bình chọn lưu dữ liệu trong `data/model_votes.json` của bản sao này. Đặt biến môi trường `VOTE_SALT` riêng nếu triển khai công khai và cấp quyền ghi cho thư mục `data`.
