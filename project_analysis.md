# Phân tích Yêu cầu Dự án: Trò chơi Cơ chế Tiến hóa (Camouflage)

Chào bạn, tôi đã tiếp nhận yêu cầu. Dưới đây là những gì tôi hiểu về dự án này trước khi tiến hành viết mã:

## 1. Mục tiêu Giáo dục
Trò chơi mô phỏng **chọn lọc tự nhiên (Natural Selection)**, cụ thể là cơ chế **ngụy trang (Camouflage)**. Mục đích là chứng minh rằng sinh vật có màu sắc hòa lẫn với môi trường (sâu xanh trên lá xanh) sẽ có tỷ lệ sống sót cao hơn so với sinh vật có màu sắc sặc sỡ (sâu đỏ/vàng).

## 2. Thiết lập Môi trường (Scene)
- **Bối cảnh:** Một chiếc lá cây màu xanh lá cây rất lớn (Làm nền cho trò chơi).
- **Quần thể (Population):** Tổng cộng 50 con sâu.
  - **25 con màu xanh lá:** Cùng tông màu hoặc gần giống màu lá (Khó nhìn thấy).
  - **25 con màu khác:** (Ví dụ: Đỏ hoặc Vàng) Màu tương phản (Dễ nhìn thấy).
- **Phân bố:** Vị trí của sâu được tạo ngẫu nhiên trên bề mặt lá mỗi lần chơi.

## 3. Cơ chế Trò chơi (Gameplay)
- **Người chơi:** Đóng vai trò là kẻ săn mồi (chim, thú ăn sâu).
- **Hành động:** Người chơi cố gắng click chuột (bắt) càng nhiều sâu càng tốt trong một khoảng thời gian giới hạn (Time limit).
- **Quy mô:** Yêu cầu nhắc đến "50 người". Trong bối cảnh ứng dụng web đơn (Frontend), tôi sẽ thiết kế theo hướng:
  - Cho phép một người chơi thực hiện lượt chơi của mình.
  - Tính năng **"Mô phỏng lớp học"**: Hệ thống có thể tự động giả lập kết quả của 50 người chơi để đưa ra số liệu thống kê lớn (Law of Large Numbers) nhằm thấy rõ xu hướng tiến hóa.

## 4. Kết quả & Thống kê
- Sau khi hết giờ, hiển thị bảng tổng kết.
- So sánh số lượng sâu xanh bị bắt vs. sâu màu khác bị bắt.
- Tính toán tỷ lệ phần trăm (%) để học sinh thấy rõ sự chênh lệch (Sâu màu nổi bật sẽ bị bắt nhiều hơn).
- Tích hợp **Gemini AI** để phân tích số liệu và giải thích bài học sinh học dựa trên kết quả thực tế vừa chơi.

Tôi sẽ tiến hành xây dựng ứng dụng dựa trên sự hiểu biết này.