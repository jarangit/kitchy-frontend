import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-radius-md flex items-center justify-center">
            <span className="text-[var(--color-text-inverse)] text-label font-[var(--weight-bold)]">K</span>
          </div>
          <span className="text-title font-[var(--weight-semibold)] text-[var(--color-text-primary)] tracking-tight">
            Kitchy
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            Contact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98] px-4 py-2 h-11"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] text-label font-[var(--weight-medium)] px-5 py-2.5 h-11 rounded-radius-full hover:opacity-90 transition-all duration-[var(--motion-fast)] hover:scale-105 active:scale-[0.98]"
          >
            เริ่มต้นใช้งาน
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
