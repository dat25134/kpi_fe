export const metadata = {
  title: "Đăng nhập | KPI",
  description: "Đăng nhập vào hệ thống quản lý KPI.",
  keywords: ["đăng nhập", "login", "KPI"],
  openGraph: {
    title: "Đăng nhập | KPI",
    description: "Đăng nhập vào hệ thống quản lý KPI.",
    type: "website"
  }
};

import LoginForm from "@/components/login/login-form";

export default function LoginPage() {
  return <LoginForm />;
}
