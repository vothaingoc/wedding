# Thiệp mời đám cưới Nhật – Việt

Website thiệp mời một trang, thiết kế mobile-first để gửi link qua LINE. Giao diện mặc định hiển thị song ngữ Nhật–Việt và có nút chuyển sang từng ngôn ngữ riêng.

## Chạy trên máy

Yêu cầu Node.js 22.13 trở lên.

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ được hiển thị trong cửa sổ lệnh (thường là `http://localhost:3000`).

Kiểm tra bản dựng:

```bash
npm run build
```

Kiểm tra riêng bản tĩnh dùng cho Vercel:

```bash
npm run build:vercel
```

## Thay toàn bộ thông tin đám cưới

Chỉnh duy nhất tệp `src/config/wedding.ts`. Các mục quan trọng:

- `groomName`, `brideName`: tên chú rể và cô dâu.
- `weddingDate`: ngày dạng `YYYY-MM-DD`, dùng để xử lý ngày tháng.
- `weddingDateDisplay`: ngày hiển thị trên thiệp.
- `weekday`: thứ bằng tiếng Nhật và tiếng Việt.
- `receptionTime`, `ceremonyTime`: giờ đón khách và giờ bắt đầu.
- `venueName`, `venueAddress`, `venuePhone`: thông tin địa điểm.
- `googleMapsUrl`: đường dẫn Google Maps chính xác.
- `replyDeadline`: hạn trả lời dạng `YYYY-MM-DD`.
- `replyDeadlineDisplay`: hạn trả lời hiển thị trên thiệp.
- `coverImage`, `ogImage`: đường dẫn ảnh bìa và ảnh xem trước.
- `publicUrl`: tên miền chính thức sau khi deploy.
- `lineContactUrl`: link LINE của cô dâu/chú rể nếu muốn dùng về sau.
- `showTimeline`: đặt `false` để ẩn toàn bộ lịch trình.
- `timeline`: các mốc giờ trong ngày.
- Các nhóm `heroMessage`, `greeting`, `noGiftMessage`, `footerMessage`: nội dung Nhật–Việt.

## Thay ảnh

### Ảnh bìa

1. Chép ảnh mới vào thư mục `public`.
2. Nên giảm ảnh về chiều rộng khoảng 1.600–2.000 px để tải nhanh trên điện thoại.
3. Đổi `coverImage` trong `src/config/wedding.ts`, ví dụ:

```ts
coverImage: "/anh-cuoi-moi.jpg",
```

Ảnh hiện tại là `public/wedding-cover-mobile.jpg`. Hãy giữ ảnh gốc của bạn ở một nơi riêng trước khi thay ảnh.

### Ảnh xem trước khi gửi LINE

Ảnh hiện tại là `public/og-wedding.png`, theo bố cục ngang phù hợp chia sẻ mạng xã hội. Nếu thay ảnh, nên dùng tỷ lệ gần `1.91:1`, kích thước khuyến nghị `1200 × 630 px`, sau đó cập nhật `ogImage`.

Sau khi có tên miền thật, thay `publicUrl` trong `src/config/wedding.ts` và `VITE_SITE_URL` trong môi trường deploy để LINE lấy đúng ảnh tuyệt đối.

## Thiết lập RSVP

Sao chép tệp môi trường mẫu:

```bash
copy .env.example .env
```

Sau đó điền:

```env
VITE_RSVP_ENDPOINT=https://dia-chi-nhan-du-lieu-cua-ban
```

### Phương án 1 — Google Sheets qua Google Apps Script (khuyến nghị)

1. Tạo một Google Sheet.
2. Mở **Tiện ích mở rộng → Apps Script**.
3. Tạo hàm `doPost(e)` để ghi các trường nhận được vào Sheet.
4. Triển khai dưới dạng Web App, cho phép người có link truy cập.
5. Dán URL Web App vào `VITE_RSVP_ENDPOINT`.

Form gửi các khóa: `name`, `attendance`, `guestCount`, `companions`, `allergies`, `message`, `contact`, `confirmed`, `submittedAt`.

### Phương án 2 — Chia sẻ trực tiếp qua LINE

Nút **LINEで回答を送る / Gửi câu trả lời qua LINE** tạo sẵn nội dung xác nhận. Trên điện thoại, website mở bảng chia sẻ của hệ điều hành; khách chọn LINE để gửi. Nếu thiết bị không hỗ trợ chia sẻ, nội dung được sao chép và website mở LINE.

Nếu `VITE_RSVP_ENDPOINT` còn trống, nút gửi chính không báo thành công giả. Website hiển thị rõ form đang ở chế độ thử nghiệm và cho phép sao chép câu trả lời.

## Deploy lên Vercel

1. Đưa dự án lên GitHub hoặc chọn trực tiếp thư mục này bằng Vercel CLI.
2. Trên Vercel, tạo **New Project** và import dự án.
3. Tệp `vercel.json` đã khai báo sẵn:
   - Build Command: `npm run build:vercel`
   - Output Directory: `dist-vercel`
4. Trong **Environment Variables**, thêm `VITE_RSVP_ENDPOINT` và `VITE_SITE_URL`.
5. Deploy, rồi lấy tên miền Vercel thật.
6. Cập nhật `publicUrl` trong `src/config/wedding.ts`, cập nhật `VITE_SITE_URL`, sau đó deploy lại một lần.

Không cần backend trả phí.

## Gửi link qua LINE

1. Mở URL đã deploy trên điện thoại để kiểm tra.
2. Dán URL vào một cuộc trò chuyện LINE.
3. LINE sẽ đọc `og:title`, `og:description`, `og:image`, `og:url` và hiển thị ảnh xem trước.
4. Nếu vừa thay ảnh mà LINE vẫn giữ ảnh cũ, đổi tên tệp ảnh OG hoặc chờ bộ nhớ đệm của LINE được làm mới rồi gửi lại.

## Trước khi gửi thiệp

- Thay tên cô dâu/chú rể.
- Thay ngày, thứ, giờ và hạn phản hồi.
- Thay tên, địa chỉ, số điện thoại và link Google Maps của địa điểm.
- Kiểm tra lại toàn bộ lời chào, timeline và lời nhắn không nhận quà.
- Điền endpoint RSVP hoặc quyết định chỉ nhận trả lời qua LINE.
- Thay `publicUrl`/`VITE_SITE_URL` bằng tên miền thật.
- Gửi thử một câu trả lời và mở link trên iPhone/Android trước khi gửi cho khách.
