const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Integrations", href: "#" },
        { name: "Changelog", href: "#" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#contact" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Status", href: "#" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ],
    },
  };

  return (
    <footer id="contact" className="bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]">
      {/* CTA Section */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-radius-xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-[var(--weight-bold)] mb-4">
              พร้อมที่จะยกระดับครัวของคุณ?
            </h2>
            <p className="text-subtitle text-[var(--color-text-inverse)]/80 mb-8 max-w-2xl mx-auto">
              เริ่มต้นใช้งาน Kitchy ได้ฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต
            </p>
            <button className="bg-[var(--color-bg)] text-[var(--color-text-primary)] px-8 py-4 rounded-radius-full font-[var(--weight-medium)] text-subtitle hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] hover:scale-105 active:scale-[0.98] h-14">
              เริ่มต้นใช้งานฟรี
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-radius-md flex items-center justify-center">
                <span className="text-[var(--color-text-inverse)] font-[var(--weight-bold)]">K</span>
              </div>
              <span className="text-title">Kitchy</span>
            </div>
            <p className="text-[var(--color-text-tertiary)] mb-6 leading-relaxed">
              ระบบจัดการครัวอัจฉริยะ ที่ช่วยให้ร้านอาหารของคุณทำงานได้อย่างมีประสิทธิภาพ
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-[var(--color-surface)] rounded-radius-full flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="w-5 h-5 text-[var(--color-text-tertiary)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-[var(--weight-semibold)] mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-inverse)] transition-all duration-[var(--motion-fast)] text-label"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--color-text-secondary)] text-label">
            © {currentYear} Kitchy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[var(--color-text-secondary)] text-label">Made with ❤️ in Thailand</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
