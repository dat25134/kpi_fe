# KPI Frontend - Hệ thống Đánh giá KPI

Hệ thống quản lý và đánh giá KPI (Key Performance Indicators) được xây dựng bằng Next.js 15 với TypeScript, cung cấp giao diện hiện đại và trải nghiệm người dùng tối ưu.

## 🚀 Tính năng chính

### Quản lý Đánh giá
- **Tự đánh giá:** Nhân viên tự đánh giá theo tiêu chí KPI
- **Đánh giá cấp 1:** Trưởng phòng đánh giá nhân viên
- **Đánh giá cấp 2:** Ban giám đốc phê duyệt cuối cùng
- **Autofill thông minh:** Tự động điền dữ liệu tham khảo giữa các cấp
- **Workflow linh hoạt:** Hỗ trợ cập nhật và hoàn thành đánh giá

### Quản lý Hệ thống
- **Quản lý nhân viên:** Thêm, sửa, xóa, import nhân viên
- **Quản lý phòng ban:** Tổ chức cơ cấu phòng ban
- **Quản lý vai trò:** Phân quyền chi tiết theo vai trò
- **Quản lý tiêu chí:** Tùy chỉnh tiêu chí đánh giá theo vai trò

### Báo cáo & Thống kê
- **Dashboard tổng quan:** Thống kê KPI theo thời gian
- **Báo cáo chi tiết:** Phân tích hiệu suất từng nhân viên/phòng ban
- **Biểu đồ trực quan:** Hiển thị xu hướng và phân bố KPI
- **Xuất báo cáo:** Export dữ liệu ra Excel

### Giao diện người dùng
- **Responsive design:** Tương thích mọi thiết bị
- **Dark/Light mode:** Tùy chỉnh giao diện
- **Real-time notifications:** Thông báo thời gian thực
- **Loading states:** Trải nghiệm mượt mà

## 🛠 Công nghệ sử dụng

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + Custom Components
- **State Management:** SWR + React Context
- **HTTP Client:** Axios
- **Real-time:** Socket.io
- **Charts:** Recharts
- **Notifications:** Sonner
- **Date handling:** date-fns
- **Icons:** Lucide React

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- npm/yarn/pnpm
- Backend API (Laravel/PHP)

## 🚀 Cài đặt và Chạy

### 1. Clone dự án
```bash
git clone <repository-url>
cd kpi_fe
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Cấu hình Environment Variables
Tạo file `.env.local` trong thư mục gốc:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:90/api

# Optional: Bundle Analyzer
ANALYZE=false
```

### 4. Chạy development server
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Ứng dụng sẽ chạy tại [http://localhost:8198](http://localhost:8198)

## 🏗 Build và Deploy

### Build cho Production
```bash
npm run build
# hoặc
yarn build
# hoặc
pnpm build
```

### Chạy Production Server
```bash
npm run start
# hoặc
yarn start
# hoặc
pnpm start
```

### Deploy lên Vercel (Khuyến nghị)

1. **Connect repository** với Vercel
2. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-production-api.com/api
   ```
3. **Deploy tự động** khi push code

### Deploy lên Server khác

1. **Build project:**
   ```bash
   npm run build
   ```

2. **Copy files** cần thiết:
   - `.next/` folder
   - `public/` folder
   - `package.json`
   - `next.config.ts`

3. **Install production dependencies:**
   ```bash
   npm install --production
   ```

4. **Start server:**
   ```bash
   npm run start
   ```

## 📁 Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard pages
│   ├── evaluation/        # Evaluation management
│   ├── employees/         # Employee management
│   ├── departments/       # Department management
│   ├── roles/            # Role management
│   └── reports/          # Reports & analytics
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── evaluation/       # Evaluation components
│   ├── employee/         # Employee components
│   └── shared/           # Shared components
├── hooks/                # Custom React hooks
├── services/             # API services
├── types/                # TypeScript type definitions
├── lib/                  # Utility functions
├── config/               # Configuration files
└── context/              # React Context providers
```

## 🔧 Scripts có sẵn

- `npm run dev` - Chạy development server (port 8198)
- `npm run build` - Build cho production
- `npm run start` - Chạy production server (port 8198)
- `npm run lint` - Kiểm tra code quality
- `ANALYZE=true npm run build` - Phân tích bundle size

## 🌐 API Endpoints

Dự án sử dụng RESTful API với các endpoints chính:

- **Authentication:** `/auth/*`
- **Evaluations:** `/evaluations/*`
- **Employees:** `/employees/*`
- **Departments:** `/departments/*`
- **Roles:** `/roles/*`
- **Reports:** `/reports/*`

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control (RBAC)**
- **Route protection** với middleware
- **Session management** tự động

## 📊 Performance

- **Code splitting** tự động
- **Image optimization** với Next.js
- **Bundle analysis** với @next/bundle-analyzer
- **SWR caching** cho API calls
- **Lazy loading** components

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Port 8198 đã được sử dụng:**
   ```bash
   # Tìm và kill process
   lsof -ti:8198 | xargs kill -9
   ```

2. **API không kết nối được:**
   - Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
   - Đảm bảo backend server đang chạy

3. **Build lỗi:**
   ```bash
   # Xóa cache và rebuild
   rm -rf .next
   npm run build
   ```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích nội bộ.

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trong repository hoặc liên hệ team phát triển.
