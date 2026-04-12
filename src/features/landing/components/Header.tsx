import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            Kitchy
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
          >
            เริ่มต้นใช้งาน
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
