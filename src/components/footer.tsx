export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 mt-8">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
        <div>
          © {new Date().getFullYear()} Công ty cổ phần Thăng Long. All rights reserved.
        </div>
        <div>
          Liên hệ: <a href="mailto:info@thanglong.com" className="underline hover:text-blue-600">info@thanglong.com</a>
        </div>
      </div>
    </footer>
  );
} 