# 🚀 Silicon Curator - Setup Guide

## 📋 Yêu cầu trước khi bắt đầu

- **Node.js**: v16+ (https://nodejs.org)
- **MySQL**: v8.0+ (https://dev.mysql.com/downloads/mysql/)
- **Git**: Để clone project

---

## 1️⃣ Clone Project

```bash
git clone <repository-url>
cd KLTN(CODE)
```

---

## 2️⃣ MySQL Setup

### 2.1 Tạo Database

Mở MySQL Command Line hoặc MySQL Workbench:

```sql
-- Tạo database
CREATE DATABASE KLTN CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (nếu chưa có)
CREATE USER 'root'@'localhost' IDENTIFIED BY 'Huan1512@';
GRANT ALL PRIVILEGES ON KLTN.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2.2 Kiểm tra MySQL đang chạy

```bash
# Windows
mysql -u root -p

# Nhập password: Huan1512@
mysql> SHOW DATABASES;
```

---

## 3️⃣ Backend Setup

### 3.1 Vào thư mục backend

```bash
cd project/server
```

### 3.2 Cài đặt dependencies

```bash
npm install
```

Chờ hoàn tất khoảng 1-2 phút.

### 3.3 Tạo file .env

Tạo file `.env` trong `project/server/`:

```
DATABASE_URL="mysql://root:Huan1512%40@localhost:3306/KLTN"
JWT_SECRET="KLTN_KEY_"
EMAIL="Vovanhuanhjhj@gmail.com"
APP_PASSWORD="hatf ujpk ffax skka"
OTP_EXPIRY_MINUTES=5
```

**Lưu ý**: `%40` là ký tự `@` được encode cho URL

### 3.4 Tạo schema database

```bash
npx prisma db push --accept-data-loss
```

Điều này sẽ tạo 22 bảng từ schema.prisma.

### 3.5 Khởi động backend

```bash
npm run dev
```

✅ Server chạy tại: `http://localhost:3000`

Bạn sẽ thấy:
```
Server dang chay tai http://localhost:3000
✅ Email service ready to send messages
```

---

## 4️⃣ Frontend Setup

### 4.1 Mở terminal khác, vào thư mục frontend

```bash
cd project/client
```

### 4.2 Cài đặt dependencies

```bash
npm install
```

### 4.3 Khởi động dev server

```bash
npm run dev
```

✅ Frontend chạy tại: `http://localhost:5173`

---

## 5️⃣ Kiểm tra

### ✅ Backend có sẵn?
```
GET http://localhost:3000/api/auth/me
```
Response 401 (unauthorized) là bình thường nếu chưa login

### ✅ Frontend có sẵn?
Mở: `http://localhost:5173`

Bạn sẽ thấy trang Home của Silicon Curator

---

## 📝 Cấu trúc Project

```
project/
├── server/                 # Backend (Express + Prisma + MySQL)
│   ├── .env               # Environment variables
│   ├── package.json
│   ├── server.js          # Main entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── src/
│       ├── routes/        # API routes
│       ├── controllers/   # Request handlers
│       ├── services/      # Business logic
│       ├── integrations/  # Email, AI, Payment
│       ├── middlewares/   # Auth, Validation
│       └── utils/         # Helpers
│
└── client/                # Frontend (React + Vite)
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── pages/         # React pages
    │   ├── components/    # React components
    │   ├── services/      # API clients
    │   ├── context/       # State management
    │   ├── hooks/         # Custom hooks
    │   └── App.jsx        # Main app
    └── public/            # Static files
```

---

## 🔑 API Endpoints

### 📧 OTP Authentication
```
POST   /api/otp/send-otp         → Gửi OTP đăng ký
POST   /api/otp/register         → Đăng ký với OTP + phone + address
POST   /api/otp/forgot-password  → Gửi OTP reset mật khẩu
POST   /api/otp/reset-password   → Reset mật khẩu với OTP
```

### 🔐 Login
```
POST   /api/auth/login           → Đăng nhập (email + password)
POST   /api/auth/register        → Đăng ký cũ (không OTP)
GET    /api/auth/me              → Lấy thông tin user hiện tại
```

### 👤 User Profile
```
GET    /api/users/me             → Lấy profile
PUT    /api/users/me             → Cập nhật profile (name, phone, address)
PUT    /api/users/me/password    → Đổi mật khẩu
```

---

## 🧪 Test API (Postman/Thunder Client)

### 1. Đăng ký

**Step 1: Gửi OTP**
```
POST http://localhost:3000/api/otp/send-otp
Content-Type: application/json

{
  "email": "test@gmail.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP đã được gửi tới email của bạn"
}
```

**Step 2: Vào Gmail để lấy OTP từ email**

**Step 3: Đăng ký**
```
POST http://localhost:3000/api/otp/register
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "password123",
  "otp": "123456",
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "address": "123 Đường ABC, TP HCM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "id": 1,
    "email": "test@gmail.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0912345678",
    "address": "123 Đường ABC, TP HCM",
    "status": "ACTIVE",
    "createdAt": "2024-04-03T..."
  }
}
```

### 2. Đăng nhập

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "test@gmail.com",
    "fullName": "Nguyễn Văn A",
    "...": "..."
  }
}
```

### 3. Lấy Profile (đã login)

```
GET http://localhost:3000/api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## ⚠️ Lỗi phổ biến

### ❌ "Connection refused" MySQL
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Giải pháp:**
- Kiểm tra MySQL đang chạy: `mysql -u root -p`
- Restart MySQL nếu cần
- Kiểm tra DATABASE_URL trong .env

### ❌ "Module not found" nodemailer
```
Error: Cannot find module 'nodemailer'
```
**Giải pháp:**
```bash
cd project/server
npm install nodemailer
```

### ❌ Prisma error
```
Error: Prisma Client is not ready
```
**Giải pháp:**
```bash
cd project/server
npx prisma generate
```

### ❌ Port 3000 đang bị dùng
```
Error: listen EADDRINUSE :::3000
```
**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### ❌ Port 5173 đang bị dùng
Giải pháp tương tự port 3000, hoặc:
```bash
npm run dev -- --port 5174
```

---

## 🎯 Quy trình đầu tiên

1. **Setup MySQL** ✅ Tạo database
2. **Setup Backend** ✅ npm install, .env, prisma db push, npm run dev
3. **Setup Frontend** ✅ npm install, npm run dev
4. **Test Signup** ✅ Đăng ký qua Frontend hoặc Postman
5. **Test Login** ✅ Đăng nhập và xem profile

---

## 📞 Thông tin Liên hệ

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173
- **Email Account**: Vovanhuanhjhj@gmail.com
- **App Password**: hatf ujpk ffax skka (Gmail Only)
- **Database**: KLTN
- **DB User**: root
- **DB Password**: Huan1512@

---

## ✨ Tiếp theo

Sau khi chạy được, bạn có thể:
- ✅ Thêm products vào database
- ✅ Tạo admin account
- ✅ Implement checkout & payment
- ✅ Setup AI assistant
- ✅ Optimize & deploy

**Chúc bạn thành công! 🚀**
