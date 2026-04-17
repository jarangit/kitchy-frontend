import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-radius-md border border-border bg-surface">
            <span className="text-label font-[var(--weight-semibold)] text-text-primary">K</span>
          </div>
          <span className="text-title tracking-tight text-text-primary">
            Kitchy
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-label text-text-secondary transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-label text-text-secondary transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-label text-text-secondary transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="h-11 px-4 text-label text-text-secondary transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => navigate("/login")}
            className="h-11 rounded-radius-full bg-primary px-5 py-2.5 text-label text-text-inverse transition-colors duration-[var(--motion-fast)] hover:bg-primary-hover"
          >
            เริ่มต้นใช้งาน
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
