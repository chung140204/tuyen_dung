# Hướng dẫn kết nối Google Sheets & Email

Để hoàn tất việc gửi dữ liệu về Google Sheets và Email, bạn cần thực hiện các bước sau:

### Bước 1: Tạo Google Sheet và Script
1. Truy cập [Google Sheets](https://sheets.new) và tạo một bảng tính mới.
2. Đặt tên bảng tính (ví dụ: "Danh sách ứng tuyển").
3. Trên thanh menu, chọn **Extensions** (Tiện ích mở rộng) > **Apps Script**.
4. Xóa hết code cũ và dán đoạn mã sau vào:

```javascript
/**
 * Xử lý dữ liệu từ Form gửi đến
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // 1. Ghi dữ liệu vào Sheet
    // Các cột: Thời gian, Họ tên, Số điện thoại, Địa chỉ, Khu vực
    sheet.appendRow([
      new Date(),
      data.full_name,
      "'" + data.phone, // Dấu nháy đơn để giữ số 0 ở đầu
      data.address,
      (data.locations || []).join(", ")
    ]);
    
    // 2. Gửi Email thông báo (THAY THẾ EMAIL DƯỚI ĐÂY)
    const emailRecipient = "chungly140204@gmail.com"; 
    const subject = "🔔 [Thiên Khôi] Ứng viên mới: " + data.full_name;
    const body = "Thông tin ứng viên mới:\n\n" +
                 "Họ tên: " + data.full_name + "\n" +
                 "Số điện thoại: " + data.phone + "\n" +
                 "Địa chỉ: " + data.address + "\n" +
                 "Khu vực làm việc: " + (data.locations || []).join(", ") + "\n\n" +
                 "--- Hệ thống tự động Thien Khoi Group ---";
    
    MailApp.sendEmail(emailRecipient, subject, body);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Bước 2: Triển khai Web App
1. Nhấn nút **Deploy** (Triển khai) ở góc trên bên phải > **New deployment** (Triển khai mới).
2. Chọn loại (type) là **Web app**.
3. Phần **Description**: "Thien Khoi Form Handler".
4. Phần **Execute as**: Chọn **Me** (Email của bạn).
5. Phần **Who has access**: Chọn **Anyone** (Bất kỳ ai) - *Quan trọng để form gửi được dữ liệu*.
6. Nhấn **Deploy**. Google sẽ yêu cầu cấp quyền (**Authorize access**), hãy chọn tài khoản của bạn và nhấn **Allow**.
7. Copy đoạn **Web App URL** hiện ra.

### Bước 3: Cấu hình URL vào Dự án
1. Mở file `.env` trong VS Code.
2. Dán URL vừa copy vào sau dấu `=` của biến `VITE_GOOGLE_SCRIPT_URL`.
3. Lưu file và khởi động lại dự án (nếu đang chạy `npx vite`).

### 🔄 Thay đổi Email nhận thông báo:
1. Mở **Apps Script** trong Google Sheets.
2. Sửa dòng **31** (thay bằng `chungly140204@gmail.com`).
3. Nhấn **Deploy > New deployment** (Bắt buộc phải tạo bản mới).
4. Thực hiện lại các bước **Triển khai Web App** (Bước 2) để nhận **URL mới**.
5. Cập nhật URL mới vào file `.env`.
6. Lưu file và khởi động lại dự án.

---
⚠️ **Lưu ý:** Nếu bạn không tạo "New Deployment", code cũ vẫn sẽ chạy và gửi đến email cũ.
