# Automatic Setup Script for Silicon Curator
# Run this script to setup everything: MySQL, Backend, Frontend

# Color output functions
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n🔹 $Message" -ForegroundColor Yellow
}

# ==============================================================================
# STEP 1: Kiểm tra Node.js
# ==============================================================================

Write-Step "STEP 1: Kiểm tra Node.js"

try {
    $nodeVersion = node --version
    Write-Success "Node.js đã cài: $nodeVersion"
} catch {
    Write-Error-Custom "Node.js chưa cài. Vui lòng tải tại: https://nodejs.org"
    Write-Error-Custom "Sau khi cài Node.js, vui lòng chạy lại script này."
    exit 1
}

# ==============================================================================
# STEP 2: Kiểm tra MySQL
# ==============================================================================

Write-Step "STEP 2: Kiểm tra MySQL"

try {
    mysql -u root -pHuan1512@ -e "SELECT 1;" 2>$null | Out-Null
    Write-Success "MySQL đã chạy"
} catch {
    Write-Error-Custom "MySQL chưa chạy hoặc mật khẩu sai"
    Write-Info "Hãy chắc chắn:"
    Write-Info "  1. MySQL Server đang chạy"
    Write-Info "  2. User: root, Password: Huan1512@"
    exit 1
}

# ==============================================================================
# STEP 3: Tạo Database KLTN
# ==============================================================================

Write-Step "STEP 3: Tạo Database KLTN"

$mysqlCommand = @"
CREATE DATABASE IF NOT EXISTS KLTN CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'Huan1512@';
GRANT ALL PRIVILEGES ON KLTN.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
"@

try {
    $mysqlCommand | mysql -u root -pHuan1512@ 2>$null
    Write-Success "Database KLTN khởi tạo thành công"
} catch {
    Write-Error-Custom "Lỗi tạo database"
    exit 1
}

# ==============================================================================
# STEP 4: Backend Setup
# ==============================================================================

Write-Step "STEP 4: Backend Setup - Cài Dependencies"

$serverPath = ".\project\server"

if (-not (Test-Path $serverPath)) {
    Write-Error-Custom "Thư mục $serverPath không tồn tại"
    exit 1
}

Push-Location $serverPath

try {
    Write-Info "Cài npm packages..."
    npm install --silent 2>&1 | Out-Null
    Write-Success "Backend dependencies cài xong"
} catch {
    Write-Error-Custom "Lỗi cài backend dependencies"
    exit 1
}

# ==============================================================================
# STEP 5: Tạo .env cho Backend
# ==============================================================================

Write-Step "STEP 5: Tạo .env cho Backend"

$envFile = ".env"
$envContent = @"
DATABASE_URL="mysql://root:Huan1512%40@localhost:3306/KLTN"
JWT_SECRET="KLTN_KEY_"
EMAIL="Vovanhuanhjhj@gmail.com"
APP_PASSWORD="hatf ujpk ffax skka"
OTP_EXPIRY_MINUTES=5
"@

try {
    if (Test-Path $envFile) {
        Write-Info ".env đã tồn tại, bỏ qua"
    } else {
        Set-Content -Path $envFile -Value $envContent -Encoding UTF8
        Write-Success ".env tạo thành công"
    }
} catch {
    Write-Error-Custom "Lỗi tạo .env"
    exit 1
}

# ==============================================================================
# STEP 6: Prisma Setup
# ==============================================================================

Write-Step "STEP 6: Prisma - Tạo Database Schema"

try {
    Write-Info "Tạo tables trong database..."
    npx prisma db push --accept-data-loss --skip-generate 2>&1 | Out-Null
    Write-Success "Database schema tạo thành công"
} catch {
    Write-Error-Custom "Lỗi tạo database schema"
    exit 1
}

Pop-Location

# ==============================================================================
# STEP 7: Frontend Setup
# ==============================================================================

Write-Step "STEP 7: Frontend Setup - Cài Dependencies"

$clientPath = ".\project\client"

if (-not (Test-Path $clientPath)) {
    Write-Error-Custom "Thư mục $clientPath không tồn tại"
    exit 1
}

Push-Location $clientPath

try {
    Write-Info "Cài npm packages..."
    npm install --silent 2>&1 | Out-Null
    Write-Success "Frontend dependencies cài xong"
} catch {
    Write-Error-Custom "Lỗi cài frontend dependencies"
    exit 1
}

Pop-Location

# ==============================================================================
# STEP 8: Hoàn tất
# ==============================================================================

Write-Step "🎉 SETUP HOÀN TẤT!"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Giờ bạn cần mở 2 terminal riêng để chạy backend và frontend:" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📌 Terminal 1 - BACKEND:" -ForegroundColor Yellow
Write-Host "   cd project\server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   (Sẽ chạy tại http://localhost:3000)" -ForegroundColor Gray
Write-Host ""

Write-Host "📌 Terminal 2 - FRONTEND:" -ForegroundColor Yellow
Write-Host "   cd project\client" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "   (Sẽ chạy tại http://localhost:5173)" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Hệ thống đã sẵn sàng!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 Cấu hình:" -ForegroundColor Cyan
Write-Host "   Database: KLTN" -ForegroundColor White
Write-Host "   DB User: root" -ForegroundColor White
Write-Host "   DB Pass: Huan1512@" -ForegroundColor White
Write-Host "   Email: Vovanhuanhjhj@gmail.com" -ForegroundColor White
Write-Host ""

Write-Host "🧪 Test Đăng Ký:" -ForegroundColor Cyan
Write-Host "   1. Mở http://localhost:5173" -ForegroundColor White
Write-Host "   2. Click 'Sign Up'" -ForegroundColor White
Write-Host "   3. Nhập email → Nhận OTP" -ForegroundColor White
Write-Host "   4. Nhập OTP + thông tin → Đăng ký thành công" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to close..." -ForegroundColor Gray
[void][System.Console]::ReadKey($true)
