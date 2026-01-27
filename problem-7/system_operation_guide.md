# Hướng dẫn Vận hành Hệ thống Digital Media Library (DML)

Tài liệu này mô tả các quy trình vận hành chính của hệ thống DML, từ lúc tải file lên cho đến khi chia sẻ ra bên ngoài. Hệ thống được thiết kế để đảm bảo dữ liệu luôn sạch, dễ tìm kiếm và bảo mật.

## 1. Tổng quan Luồng Dữ liệu (Workflow)

Hệ thống hoạt động theo nguyên tắc **"Kiểm duyệt trước, Xuất bản sau"**. Không có file nào được đi thẳng vào thư viện chung mà không qua bước kiểm tra (Curation).

1.  **Ingest (Tải lên)**: Người dùng tải file thô lên.
2.  **Curate (Kiểm duyệt)**: Người dùng (hoặc Admin) gắn thẻ, đổi tên, chọn lọc file trong vùng chờ.
3.  **Publish (Xuất bản)**: File được duyệt sẽ chuyển vào Thư viện chính (Main Library).
4.  **Distribute (Phân phối)**: Chia sẻ file qua Link bảo mật.

---

## 2. Chi tiết Các Quy trình Vận hành

### 2.1. Quy trình Tải lên & Kiểm duyệt (Upload & Curation)

Đây là bước quan trọng nhất để chống "rác" dữ liệu.

**Bước 1: Tải lên (Upload)**
*   Người dùng truy cập vào nút "Upload".
*   Chọn file (Ảnh/Video) hoặc kéo thả cả thư mục từ máy tính.
*   Hệ thống sẽ tải file lên vùng tạm (**Draft Area**) và chạy ngầm việc tạo hình thu nhỏ (Thumbnail).
*   *Lưu ý*: File lúc này **chưa** xuất hiện cho người khác thấy.

**Bước 2: Sàng lọc (Batch Curation)**
*   Người dùng vào màn hình "My Uploads" hoặc "Curation Queue".
*   Giao diện hiển thị lưới các ảnh vừa tải lên.
*   **Thao tác**:
    *   **Chọn lọc**: Đánh dấu các ảnh bị lỗi, mờ, trùng lặp để Xóa.
    *   **Gắn thẻ (Tagging)**: Chọn hàng loạt ảnh -> Gắn metadata (Ví dụ: Country = Vietnam, Project = Summer Event).
    *   **Đổi tên (Rename)**: Hệ thống tự động gợi ý tên theo chuẩn (VD: `VN_SummerEvent_001.jpg`). Người dùng xác nhận.
*   **Kết thúc**: Nhấn nút **"Publish to Library"**. Các file được chọn sẽ chính thức chuyển sang trạng thái `ACTIVE`.

### 2.2. Quy trình Tìm kiếm & Khám phá (Search & Discovery)

Sau khi file đã vào thư viện, người dùng có thể tìm kiếm dễ dàng.

*   **Tìm theo Bộ lọc (Filters)**:
    *   Bên trái màn hình có các bộ lọc: Quốc gia (Country), Loại (Image/Video), Nguồn (Render/Real).
    *   Chọn "Vietnam" + "Video" -> Hệ thống lọc ra ngay lập tức.
*   **Tìm theo Cấu trúc Thư mục**:
    *   Duyệt theo cây thư mục do Admin định nghĩa (VD: Market -> Sector -> Project).
*   **Xem trước (Preview)**:
    *   Nhấn vào ảnh để xem nét căng (High Res Preview).
    *   Nhấn vào video để phát ngay trên trình duyệt (không cần tải về).

### 2.3. Quy trình Chia sẻ (Sharing)

Hệ thống thay thế việc gửi file đính kèm hay share folder bừa bãi bằng **Secure Share Links**.

**Kịch bản: Chia sẻ ảnh cho đối tác bên ngoài**
1.  Người dùng chọn 5 tấm ảnh trong thư viện cần chia sẻ.
2.  Nhấn nút **"Share"** -> Chọn **"External Link"**.
3.  Cấu hình Link:
    *   **Hết hạn (Expiry)**: Chọn "Sau 7 ngày".
    *   **Mã truy cập (Access Code)**: Hệ thống sinh ra mã 6 số (hoặc người dùng tự đặt).
4.  Hệ thống tạo ra một đường link duy nhất (VD: `dml.company.com/share/xyz-123`).
5.  Người dùng gửi Link + Mã code cho đối tác qua Email.
6.  *Kết quả*: Đối tác chỉ xem/tải được đúng 5 tấm ảnh đó. Link tự hủy sau 7 ngày. Người dùng có thể thu hồi (Revoke) link bất cứ lúc nào.

### 2.4. Quy trình Quản trị (Admin)

Dành cho Super Admin và Admin để duy trì trật tự hệ thống.

*   **Quản lý Cấu trúc Thư mục (Root Structure)**:
    *   Admin định nghĩa cây thư mục gốc (VD: Thêm Folder "Năm 2025"). Người dùng thường không được xóa các thư mục này.
*   **Quản lý Vòng đời (Lifecycle Policies)**:
    *   Cấu hình tự động: "File không ai xem trong 2 năm -> Chuyển sang Cold Storage (Lưu trữ lạnh giá rẻ)".
    *   "Thùng rác (Recycle Bin)": File bị xóa sẽ nằm ở đây 30 ngày trước khi mất vĩnh viễn (Soft Delete).
*   **Audit Log (Nhật ký hệ thống)**:
    *   Xem lịch sử: "Ai đã xóa ảnh X?", "Ai đã tạo Link chia sẻ Y?". Giúp truy cứu trách nhiệm khi cần.

---

## 3. Câu hỏi thường gặp (FAQ Vận hành)

**Q: Tôi có thể sửa ảnh (crop/resize) trực tiếp trên DML không?**
A: Có. Hệ thống hỗ trợ crop và resize cơ bản. Khi bạn lưu, hệ thống sẽ tạo ra một **Phiên bản mới (Version)**, file gốc (Original) vẫn được giữ nguyên vẹn để đảm bảo an toàn.

**Q: Nếu tôi lỡ tay xóa nhầm file thì sao?**
A: File sẽ vào trạng thái "Soft Deleted". Bạn có thể nhờ Admin khôi phục lại trong vòng 30 ngày.

**Q: Upload file 500MB được không?**
A: Có, nhưng hệ thống khuyến nghị file ảnh dưới 150MB để tối ưu hiệu năng xem trước. Video có thể dung lượng lớn hơn. Hệ thống sử dụng công nghệ tải trực tiếp (Direct Upload) nên rất nhanh.
