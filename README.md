# FOODCARE - HỆ THỐNG ĐẶT MÓN ĂN DINH DƯỠNG & TRỢ LÝ ẢO AI TƯ VẤN SỨC KHỎE

---

## 1. GIỚI THIỆU SƠ LƯỢC VỀ DỰ ÁN

**FoodCare** là nền tảng thương mại điện tử chuyên sâu về ẩm thực khoa học và bữa ăn lành mạnh tại khu vực Đà Nẵng, tiên phong tích hợp **Trợ lý ảo Trí tuệ Nhân tạo (AI)** để cá nhân hóa khẩu phần ăn theo thể trạng và mục tiêu sức khỏe của từng cá nhân.

### 1.1. Bối cảnh & Vấn đề giải quyết
* **Xu hướng sống lành mạnh:** Nhu cầu ăn uống có kiểm soát (Eat Clean, Giảm cân, Tăng cơ, Ăn chay, Tiểu đường, Cao huyết áp) ngày càng tăng cao nhưng người dùng thường gặp khó khăn trong việc tính toán calo và lựa chọn món phù hợp.
* **Giải pháp của FoodCare:**
  * Minh bạch toàn bộ chỉ số dinh dưỡng vi lượng (Calories, Protein, Carbs, Fat, Fiber) cho từng món ăn.
  * Tự động tính chỉ số khối cơ thể (BMI) và lưu trữ hồ sơ bệnh lý nền, dị ứng thực phẩm.
  * Ứng dụng mô hình ngôn ngữ lớn (LLMs) hỗ trợ hỏi đáp sức khỏe và gợi ý thực đơn tức thì.
  * Hệ thống cảnh báo dị ứng tự động bảo vệ an toàn cho người dùng khi chọn món.

### 1.2. Các phân hệ chức năng chính
* **Dành cho Khách hàng (User):**
  * Tra cứu, tìm kiếm và lọc món ăn đa chiều (theo mức calo, bệnh lý, chế độ ăn).
  * Thiết lập hồ sơ thể trạng cá nhân (chiều cao, cân nặng, BMI, mục tiêu dinh dưỡng, bệnh lý, dị ứng).
  * Tương tác thời gian thực với Chatbot AI tư vấn dinh dưỡng khoa học.
  * Quản lý giỏ hàng, đặt hàng giao tận nơi và theo dõi tiến trình đơn hàng 5 bước.
  * Thanh toán đa kênh (Tiền mặt COD, Cổng VNPAY, Ví điện tử MoMo, Quét mã VietQR tự động).
  * Tích lũy chi tiêu nâng hạng thành viên thân thiết (Đồng $\rightarrow$ Bạc $\rightarrow$ Vàng $\rightarrow$ Kim Cương).
  * Đánh giá, chấm sao và tải ảnh/video thực tế của món ăn.
* **Dành cho Quản trị viên (Admin):**
  * Bảng điều khiển (Dashboard) theo dõi KPI doanh thu, đơn hàng, khách hàng mới và top món bán chạy.
  * Quản lý thực đơn, giá bán, kho nguyên liệu và cài đặt các chỉ số vi chất dinh dưỡng.
  * Xử lý quy trình giao nhận đơn hàng thời gian thực qua WebSockets.
  * Quản lý hồ sơ người dùng, phân quyền và khóa/mở khóa tài khoản.
  * Báo cáo phân tích doanh thu minh bạch không phụ thuộc biểu đồ phức tạp.
  * Nhật ký AI (AI Logs): Theo dõi xu hướng chủ đề khách hàng quan tâm để tối ưu nguồn cung món ăn.

---

## 2. NGÔN NGỮ LẬP TRÌNH & CÔNG NGHỆ SỬ DỤNG

Dự án FoodCare được nhóm xây dựng theo mô hình Fullstack JavaScript (MERN Stack). Nhóm quyết định sử dụng JavaScript trên toàn bộ dự án để đồng bộ ngôn ngữ từ giao diện đến máy chủ, giúp việc trao đổi dữ liệu qua lại dưới dạng JSON trở nên thuận tiện và hạn chế việc phải chuyển đổi cấu trúc dữ liệu.

Các công nghệ chính trong hệ thống bao gồm:
* **Ngôn ngữ lập trình:** JavaScript (chuẩn ES6+), viết theo dạng ES Modules (`import/export`).
* **Phía Frontend:** 
  * Sử dụng thư viện **React 19** để chia nhỏ giao diện thành các component tái sử dụng (Header, Footer, Thẻ món ăn, Giỏ hàng, Modal thanh toán...).
  * Dùng **Vite** làm công cụ build và chạy dev server thay vì Create React App cũ, giúp thời gian khởi động server và cập nhật code (Hot Reload) nhanh hơn rất nhiều.
  * Phần CSS sử dụng **Tailwind CSS** để viết giao diện nhanh thông qua các utility class, dễ tùy biến giao diện responsive cho cả màn hình điện thoại và máy tính.
* **Phía Backend:**
  * Chạy trên nền tảng **Node.js** kết hợp framework **Express.js** để viết các API RESTful phục vụ cho client gọi dữ liệu (quản lý món ăn, xác thực người dùng, xử lý đơn hàng).
* **Cơ sở dữ liệu:** 
  * Nhóm chọn **MongoDB** (NoSQL Document Store) thay vì MySQL. Lý do là vì thông tin món ăn và hồ sơ sức khỏe có cấu trúc động (mỗi món có thể có nhiều thẻ dinh dưỡng, người dùng có nhiều bệnh lý hoặc dị ứng khác nhau). MongoDB cho phép nhúng trực tiếp chi tiết đơn hàng (`OrderItem`) và bảng dinh dưỡng (`Nutrition`) vào trong cùng một document, giúp truy vấn nhanh hơn mà không phải JOIN nhiều bảng phức tạp.
  * Sử dụng thư viện **Mongoose** để tạo schema, quản lý kiểu dữ liệu và ràng buộc (validation) khi làm việc với MongoDB từ Node.js.
* **Tích hợp Trí tuệ Nhân tạo (AI):**
  * Nhóm tích hợp API của **Google Gemini** (`gemini-2.5-flash`) và **Groq Cloud** (`llama-3.3-70b-versatile`) để xây dựng chatbot tư vấn thực đơn khoa học theo thể trạng cá nhân.
* **Giao tiếp Real-time:**
  * Sử dụng **Socket.io** để kết nối trực tiếp giữa client và server, hỗ trợ thông báo và cập nhật trạng thái đơn hàng ngay lập tức khi Admin duyệt đơn mà khách không cần load lại trang.

---

## 3. CÁC THƯ VIỆN ĐƯỢC CÀI ĐẶT VÀ SỬ DỤNG

Để phục vụ cho các chức năng trong hệ thống, nhóm có cài đặt thêm các thư viện bổ trợ sau trong `package.json`:

### 3.1. Phía Backend
* `express`: Framework cốt lõi để tạo server HTTP và viết các router API.
* `mongoose`: Hỗ trợ kết nối cơ sở dữ liệu MongoDB và định nghĩa các Schema/Model.
* `jsonwebtoken` (JWT): Cấp mã token cho người dùng sau khi đăng nhập thành công, dùng để xác thực và phân quyền cho các route cần đăng nhập hoặc chỉ dành cho Admin.
* `bcryptjs`: Dùng để băm mật khẩu người dùng trước khi lưu vào MongoDB để đảm bảo an toàn.
* `multer`: Nhận và xử lý file khi người dùng upload ảnh đại diện, ảnh món ăn hoặc ảnh đánh giá.
* `sharp`: Kết hợp với multer để nén dung lượng ảnh và tự động chuyển đổi ảnh sang định dạng WebP, giúp website load ảnh nhanh hơn và tiết kiệm dung lượng ổ cứng.
* `openai`: Nhóm dùng package này để gọi sang API của Groq và Gemini thông qua chuẩn tương thích của OpenAI SDK, giúp code gọi AI gọn hơn và dễ chuyển đổi giữa các model.
* `socket.io`: Thư viện tạo kết nối WebSocket cho các tính năng thời gian thực.
* `nodemailer`: Dùng gửi email tự động xác nhận đơn hàng về hòm thư của khách hàng.
* `cors`: Cho phép frontend chạy ở port khác (`http://localhost:5173`) có thể gọi được API backend (`http://localhost:5000`).
* `dotenv`: Đọc các cấu hình bí mật (chuỗi kết nối MongoDB, Secret Key, API Key) từ file `.env` vào `process.env`.
* `compression` & `morgan`: Nén dữ liệu trả về cho client và ghi log các request gọi vào server để tiện debug khi có lỗi.

### 3.2. Phía Frontend
* `react-router-dom`: Quản lý các tuyến đường dẫn (routes) của website, giúp chuyển đổi mượt mà giữa các trang (Trang chủ, Thực đơn, Đăng nhập, Hồ sơ, Admin...) mà không làm tải lại trang web.
* `axios`: Thư viện gửi request HTTP về backend; nhóm có cấu hình interceptor để tự động đính kèm token đăng nhập vào header mỗi khi gọi API.
* `lucide-react`: Bộ icon nhẹ, nhiều biểu tượng phù hợp với giao diện hiện đại (giỏ hàng, trái tim yêu thích, tìm kiếm, vương miện...).
* `framer-motion`: Dùng để tạo các hiệu ứng chuyển động nhẹ nhàng khi cuộn trang hoặc mở modal.
* `react-toastify`: Hiển thị thông báo popup nhỏ ở góc màn hình (như: *Thêm vào giỏ thành công*, *Đăng nhập thất bại*...).
* `socket.io-client`: Thư viện phía client để lắng nghe sự kiện cập nhật đơn hàng từ backend.

---

## 4. KỸ NĂNG & KỸ THUẬT ĐƯỢC ÁP DỤNG TRONG ĐỒ ÁN

1. **Thiết kế Cơ sở dữ liệu NoSQL Hướng Tài liệu (Document Modeling):**
   * Vận dụng kỹ thuật **Nhúng dữ liệu (Embedding)** cho các đối tượng phụ thuộc (`OrderItem` trong `Orders`, `HealthProfile` trong `Users`, `Nutrition` trong `Foods`) giúp truy vấn đọc chỉ với 1 lượt truy xuất duy nhất.
   * Sử dụng kỹ thuật **Tham chiếu (Referencing - Ref)** cho các thực thể độc lập (`Category`, `Reviews`, `AIChats`).
2. **Kỹ nghệ phát triển RESTful API & Bảo mật:**
   * Chuẩn hóa mã phản hồi HTTP (200, 201, 400, 401, 403, 404, 500).
   * Phân quyền dựa trên vai trò (RBAC - Role-Based Access Control) qua Middleware xác thực JWT.
   * Xử lý ngoại lệ tập trung (Global Error Handling Middleware).
3. **Cơ chế AI Failover & Bảo đảm tính toàn vẹn (Dual-Engine Resilient AI):**
   * Cơ chế chuyển vùng dự phòng tự động (Failover): Khi Gemini API gặp sự cố hoặc quá tải hạn mức, hệ thống tự động kích hoạt Groq Llama 3.3.
   * **Context Sanitizer:** Bộ lọc làm sạch dữ liệu hội thoại, loại bỏ các câu trả lời lỗi ngắn để chống ngộ độc ngữ cảnh học (Context Poisoning).
   * **Smart Menu Fallback:** Khi cả 2 API AI đều mất kết nối, hệ thống tự động phân tích dữ liệu cục bộ từ MongoDB để tạo thực đơn gợi ý chuẩn theo bệnh lý của người dùng.
4. **Tối ưu hóa hình ảnh & Trải nghiệm người dùng:**
   * Chuyển đổi mọi định dạng ảnh tải lên sang **WebP** bằng `sharp`, giảm tới 70% dung lượng mà vẫn giữ nguyên chất lượng hiển thị.
   * Thiết kế giao diện Glassmorphism kết hợp bố cục thẻ (Card layout) hiện đại.
5. **Đóng gói và Triển khai với Docker:**
   * Triển khai Container hóa toàn bộ hệ sinh thái: Database (MongoDB), Backend (Node.js) và Frontend (Nginx/Vite) thông qua `docker-compose.yml`.

---

## 5. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY DỰ ÁN

### 5.1. Yêu cầu môi trường
* **Node.js:** Phiên bản 18.x trở lên.
* **NPM:** Phiên bản 9.x trở lên.
* **Cơ sở dữ liệu:** MongoDB Community Server (đang chạy cổng `27017`) hoặc đường dẫn kết nối MongoDB Atlas.

---

### 5.2. Cách 1: Khởi chạy môi trường Phát triển (Development Mode)

#### Bước 1: Khởi động và cài đặt Backend
```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Tạo file cấu hình môi trường (.env) trong thư mục backend với nội dung:
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodcare
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# 4. Nạp dữ liệu mẫu ban đầu (58 món ăn, danh mục, tài khoản admin)
npm run seed

# 5. Khởi chạy máy chủ Backend (có chế độ tự động reload khi sửa code)
npm run dev
```
> *Backend sẽ hoạt động tại địa chỉ: `http://localhost:5000`*

---

#### Bước 2: Khởi động và cài đặt Frontend
Mở một cửa sổ Terminal (PowerShell/CMD) mới:
```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các thư viện phụ thuộc
npm install

# 3. Khởi chạy máy chủ giao diện người dùng
npm run dev
```
> *Giao diện ứng dụng sẽ mở tại địa chỉ: `http://localhost:5173`*

---

### 5.3. Cách 2: Khởi chạy nhanh bằng Docker Compose

Nếu máy tính đã cài đặt **Docker Desktop**, bạn có thể khởi chạy toàn bộ hệ thống (gồm MongoDB, Backend và Frontend) chỉ bằng 1 câu lệnh duy nhất từ thư mục gốc của dự án:

```bash
# Khởi động toàn bộ container ở chế độ chạy ngầm
docker-compose up -d --build
```

Để dừng hệ thống:
```bash
docker-compose down
```

---

## 6. TÀI KHOẢN MẪU ĐỂ TRẢI NGHIỆM & KIỂM THỬ

Sau khi chạy lệnh `npm run seed`, hệ thống đã sẵn sàng với các tài khoản thử nghiệm sau:

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn & Chức năng |
| :--- | :--- | :---: | :--- |
| **Quản trị viên (Admin)** | `admin@foodcare.ai` | `123456` | Truy cập toàn quyền vào trang Dashboard Quản trị, quản lý đơn hàng, thực đơn, khách hàng, doanh thu và nhật ký AI. |
| **Khách hàng thân thiết** | `nhu@gmail.com` | `123456` | Tài khoản Hạng Vàng, đã có hồ sơ bệnh lý, đơn hàng mẫu, giỏ hàng và danh sách món yêu thích. |
| **Khách hàng thường** | `user@foodcare.ai` | `123456` | Tài khoản mới, dùng để thử nghiệm luồng đặt hàng và cập nhật hồ sơ thể trạng BMI. |

