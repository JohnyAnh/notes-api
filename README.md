# Notes API

Một RESTful API đơn giản để quản lý ghi chú, xây dựng bằng Node.js, Express, TypeScript và SQLite.

---

## Hướng dẫn cài đặt & chạy

### Yêu cầu

- Node.js >= 18
- npm

## Cài đặt & Chạy

1. **Clone repository**

   ```bash
   git clone https://github.com/JohnyAnh/notes-api.git
   cd notes-api
   ```

2. **Cài phụ thuộc**

   ```bash
   npm install
   ```

3. **Chạy chế độ phát triển**

   ```bash
   npm run dev
   ```

   API sẽ lắng nghe trên cổng **3000**.

4. **Chạy bộ kiểm thử**

   ```bash
   npm run test
   ```

---

## Các Endpoint

### POST /notes

Tạo ghi chú mới.

- **Header**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "title": "Chuỗi (1–120 ký tự)",
    "body": "Chuỗi (tuỳ chọn)",
    "tags": ["mảng chuỗi"]
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "uuid",
    "title": "...",
    "body": "...",
    "tags": ["..."],
    "createdAt": "ISO timestamp",
    "updatedAt": "ISO timestamp"
  }
  ```

### GET /notes

Lấy danh sách ghi chú, hỗ trợ tìm kiếm, lọc, phân trang và sắp xếp.

- **Query Params**:
  - `q` (string): tìm trong `title` hoặc `body`
  - `tag` (string): lọc theo `tags`
  - `page` (number, mặc định=1)
  - `limit` (number, mặc định=10)
  - `sort` (`"createdAt"` | `"updatedAt"`, mặc định=`"createdAt"`)
- **Response**: `200 OK`
  ```json
  {
    "items": [
      /* mảng ghi chú */
    ],
    "total": 123
  }
  ```

### GET /notes/\:id

Lấy chi tiết một ghi chú theo `id`.

- **Response**: `200 OK` hoặc `404 Not Found`

### PATCH /notes/\:id

Cập nhật một hoặc nhiều trường của ghi chú.

- **Header**: `Content-Type: application/json`
- **Body**: subset của body tạo mới
- **Response**: `200 OK` với ghi chú đã cập nhật hoặc `404 Not Found`

### DELETE /notes/\:id

Xóa ghi chú theo `id`.

- **Response**: `204 No Content` hoặc `404 Not Found`

---

## Ví dụ Curl

```bash
# Tạo mới
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Hello","tags":["x"]}'

# Lấy danh sách
curl "http://localhost:3000/notes?q=Test&tag=x&page=1&limit=5&sort=createdAt"

# Lấy 1 ghi chú
curl http://localhost:3000/notes/{note_id}

# Cập nhật
curl -X PATCH http://localhost:3000/notes/{note_id} \
  -H "Content-Type: application/json" \
  -d '{"title":"Đã cập nhật"}'

# Xóa
curl -X DELETE http://localhost:3000/notes/{note_id}
```

---

## ⚙️ Giả định và đánh đổi

- **Cơ sở dữ liệu**: Sử dụng SQLite để đơn giản hóa việc cài đặt, không phù hợp cho môi trường production có tải lớn.
- **Kiểm tra dữ liệu đầu vào**: Sử dụng `express-validator`.
- **Giới hạn tốc độ**: Áp dụng rate limiting cơ bản cho tất cả endpoint.
- **Xử lý lỗi**: Tất cả lỗi được trả về dưới dạng JSON.
- **Phân trang**: Mặc định 10 bản ghi/trang, có thể thay đổi qua query params.
- **Tags**: Lưu dưới dạng mảng JSON, thuận tiện nhưng không tối ưu cho truy vấn phức tạp.

---

## ⏱️ Thời gian thực hiện & Cải tiến nếu có thêm thời gian

- **Thời gian thực hiện**: Khoảng 6-8 tiếng, bao gồm cài đặt môi trường project, nghin cứu, phát triển và kiểm thử. Tranh thủ làm lúc giờ nghỉ cũng như buổi tối nghin cứu làm bài test này.
- **Nếu có thêm thời gian**:
- Thực hành viết nhiều mã hơn với TypeScript
- Thêm mã hóa tất cả các Id đầu ra và đầu vào
- Phân lớp thêm các tầng Interface cho Repository và Service
- Tạo nơi dùng chung các service tái sử dụng
- Thêm xác thực/ủy quyền người dùng.
- Viết thêm test cho các trường hợp đặc biệt và lỗi.
- Cải thiện thông báo lỗi và kiểm tra dữ liệu đầu vào.
- Thêm tài liệu OpenAPI/Swagger.
- Sử dụng cơ sở dữ liệu mạnh hơn (ví dụ PostgreSQL) cho production.
- Thêm chức năng xóa mềm và lưu lịch sử chỉnh sửa ghi chú.
- Dùng công cụ migration (Knex, Sequelize CLI).
- Caching (Redis) cho endpoint list.
- Giới hạn request theo IP/người dùng.

---

## 🤖 Công cụ AI đã sử dụng trong dự án

- **GitHub Copilot**
  - Hỗ trợ gợi ý và tự động hoàn thành mã
  - Tối ưu hiệu quả viết code cho controllers và services
  - Đề xuất các pattern validation phù hợp
  - Giúp tăng tốc quá trình phát triển

- **ChatGPT**
  - Hỗ trợ khởi tạo cấu trúc project ban đầu
  - Sinh mã mẫu làm cơ sở phát triển
  - Tất cả code được review và chỉnh sửa kỹ lưỡng
  - Đảm bảo code theo đúng yêu cầu và tiêu chuẩn
  - Hỗ trợ viết README.md theo yêu cầu đề bài

---

## 📂 Cấu trúc dự án

```
.
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
├── data/
│   └── notes.db
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

---

Cảm ơn quý công ty đã cho tôi cơ hội được thử sức với bài test này. Tôi đã cố gắng hoàn thành một cách tốt nhất có thể và rất mong được nhận phản hồi từ quý công ty.
