import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Danh sách các route công khai không cần xác thực
const publicRoutes = ['/login', '/api/login']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl
  console.log(token);
  // Kiểm tra xem route hiện tại có phải là route công khai không
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Nếu không có token và không phải route công khai -> chuyển về trang login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu có token và đang ở trang login -> chuyển về dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Cấu hình middleware áp dụng cho tất cả các route
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 