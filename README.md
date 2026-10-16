# Gửi Công Minh
Trang web tĩnh React + Vite, không có backend.

## Chạy
npm install
npm run dev

## Build
npm run build

Thư gốc nằm ở src/letter.md, được giữ nguyên từ file cung cấp.
Nhạc nền là giai điệu tổng hợp bằng Web Audio, mặc định thử tự phát khi vào trang; nếu trình duyệt chặn, bắt đầu ở tương tác đầu tiên. Nút nhạc vẫn bật/tắt được.
Hỗ trợ điện thoại và chế độ giảm chuyển động. Không thu thập phản hồi.
Thư nằm trong tài nguyên tĩnh, vì vậy không dùng mật khẩu giao diện để bảo vệ nội dung.

## Ảnh chibi
Hai ảnh được tạo bằng công cụ tạo ảnh tích hợp từ ảnh tham chiếu:
- public/images/cong-minh-group-chibi.png: chibi hóa cả nhóm bốn người, giữ thứ tự, trang phục, tư thế và bối cảnh tường xanh.
- public/images/cong-minh-portrait-chibi.png: chân dung chibi giữ kiểu tóc, vest đen, cà vạt và tư thế chỉnh cà vạt.
Ảnh nằm trong phần đầu lá thư, kiểu ảnh giấy kỷ niệm. Chỉ ảnh chibi được đưa vào source.

## Dùng source
Yêu cầu Node.js 20.19+ hoặc 22.12+.
Giải nén, mở terminal trong thư mục dự án, chạy:
npm ci
npm run dev

Build để đưa lên hosting tĩnh:
npm run build
Upload nội dung thư mục dist lên hosting của bạn.

## Font tiếng Việt
Font DejaVu Serif và DejaVu Sans được đóng gói WOFF trong public/fonts, không tải từ Google Fonts và không phụ thuộc font cài trên máy.
Đã kiểm tra font chứa đủ ký tự tiếng Việt của nội dung thư và giao diện. Giấy phép nằm tại public/fonts/LICENSE.txt.
