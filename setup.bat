@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     🚀 SILICON CURATOR - AUTOMATIC SETUP 🚀                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ==============================================================================
REM INPUT 1: Project Root Path
REM ==============================================================================

echo 📁 Nhập đường dẫn project (vd: C:\Users\YourName\Downloads\KLTN(CODE))
set /p PROJECT_PATH="Đường dẫn project: "

if not exist "%PROJECT_PATH%" (
    echo ❌ Thư mục không tồn tại: %PROJECT_PATH%
    pause
    exit /b 1
)

cd /d "%PROJECT_PATH%" >nul 2>&1
echo ✅ Thư mục project: %PROJECT_PATH%
echo.

REM ==============================================================================
REM INPUT 2: MySQL Username
REM ==============================================================================

echo 🔐 Nhập MySQL Username (mặc định: root)
set /p MYSQL_USER="MySQL Username [root]: "

if "!MYSQL_USER!"=="" (
    set MYSQL_USER=root
)
echo ✅ MySQL Username: !MYSQL_USER!
echo.

REM ==============================================================================
REM INPUT 3: MySQL Password
REM ==============================================================================

echo 🔐 Nhập MySQL Password
set /p MYSQL_PASS="MySQL Password: "

echo ✅ Password đã nhập
echo.

REM ==============================================================================
REM Tạo encoded password cho URL (thay @ thành %%40)
REM ==============================================================================

setlocal enabledelayedexpansion
set "MYSQL_PASS_ENCODED=!MYSQL_PASS:@=%%40!"

REM ==============================================================================
REM STEP 1: Kiểm tra Node.js
REM ==============================================================================

echo [STEP 1/7] Kiểm tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js chưa cài. Vui lòng tải tại: https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js !NODE_VERSION! đã cài
echo.

REM ==============================================================================
REM STEP 2: Kiểm tra MySQL
REM ==============================================================================

echo [STEP 2/7] Kiểm tra MySQL...
mysql -u !MYSQL_USER! -p!MYSQL_PASS! -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL kết nối thất bại
    echo    Username: !MYSQL_USER!
    echo    Hãy kiểm tra lại mật khẩu hoặc MySQL Server có chạy không
    pause
    exit /b 1
)
echo ✅ MySQL kết nối thành công
echo.

REM ==============================================================================
REM STEP 3: Tạo Database KLTN
REM ==============================================================================

echo [STEP 3/7] Tạo Database KLTN...
mysql -u !MYSQL_USER! -p!MYSQL_PASS! -e "CREATE DATABASE IF NOT EXISTS KLTN CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" >nul 2>&1
if errorlevel 1 (
    echo ❌ Lỗi tạo database
    pause
    exit /b 1
)
echo ✅ Database KLTN khởi tạo thành công
echo.

REM ==============================================================================
REM STEP 4: Backend - npm install
REM ==============================================================================

echo [STEP 4/7] Backend Setup - npm install...
if not exist "project\server" (
    echo ❌ Thư mục project\server không tồn tại
    pause
    exit /b 1
)

cd /d "%PROJECT_PATH%\project\server"
npm install --silent >nul 2>&1
if errorlevel 1 (
    echo ❌ Lỗi cài backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies cài xong
echo.

REM ==============================================================================
REM STEP 5: Tạo .env cho Backend
REM ==============================================================================

echo [STEP 5/7] Tạo .env cho Backend...
(
    echo DATABASE_URL="mysql://!MYSQL_USER!:!MYSQL_PASS_ENCODED!@localhost:3306/KLTN"
    echo JWT_SECRET="KLTN_KEY_"
    echo EMAIL="Vovanhuanhjhj@gmail.com"
    echo APP_PASSWORD="hatf ujpk ffax skka"
    echo OTP_EXPIRY_MINUTES=5
) > .env
echo ✅ .env tạo thành công
echo.

REM ==============================================================================
REM STEP 6: Prisma - Tạo Database Schema
REM ==============================================================================

echo [STEP 6/7] Prisma - Tạo Database Schema...
npx prisma db push --accept-data-loss --skip-generate >nul 2>&1
if errorlevel 1 (
    echo ❌ Lỗi tạo database schema
    pause
    exit /b 1
)
echo ✅ Database schema tạo thành công
echo.

cd /d "%PROJECT_PATH%"

REM ==============================================================================
REM STEP 7: Frontend - npm install
REM ==============================================================================

echo [STEP 7/7] Frontend Setup - npm install...
if not exist "project\client" (
    echo ❌ Thư mục project\client không tồn tại
    pause
    exit /b 1
)

cd /d "%PROJECT_PATH%\project\client"
npm install --silent >nul 2>&1
if errorlevel 1 (
    echo ❌ Lỗi cài frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies cài xong
echo.

cd /d "%PROJECT_PATH%"

REM ==============================================================================
REM HOÀN TẤT
REM ==============================================================================

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                🎉 SETUP HOÀN TẤT! 🎉                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📌 BƯỚC TIẾP THEO - Mở 2 terminal riêng:
echo.
echo 🔵 TERMINAL 1 - BACKEND:
echo    cd %PROJECT_PATH%\project\server
echo    npm run dev
echo    ^(Chạy tại http://localhost:3000^)
echo.
echo 🟢 TERMINAL 2 - FRONTEND:
echo    cd %PROJECT_PATH%\project\client
echo    npm run dev
echo    ^(Chạy tại http://localhost:5173^)
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📝 Cấu hình sử dụng:
echo    Project: %PROJECT_PATH%
echo    Database: KLTN
echo    DB User: !MYSQL_USER!
echo    Email: Vovanhuanhjhj@gmail.com
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✨ Mở http://localhost:5173 để test!
echo.
pause

