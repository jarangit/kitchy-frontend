import { Button } from "@/shared/components/ui/button";

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
    <footer id="contact" className="border-t border-border bg-surface text-text-primary">
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-radius-2xl border border-border bg-bg p-12 text-center">
            <h2 className="mb-4 text-heading sm:text-display">
              พร้อมที่จะยกระดับครัวของคุณ?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-subtitle text-text-secondary">
              เริ่มต้นใช้งาน Kitchy ได้ฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต
            </p>
            <Button size="lg">
              เริ่มต้นใช้งานฟรี
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-radius-md border border-border bg-bg">
                <span className="font-[var(--weight-semibold)] text-text-primary">K</span>
              </div>
              <span className="text-title">Kitchy</span>
            </div>
            <p className="mb-6 leading-relaxed text-text-secondary">
              ระบบจัดการครัวอัจฉริยะ ที่ช่วยให้ร้านอาหารของคุณทำงานได้อย่างมีประสิทธิภาพ
            </p>
            <div className="flex gap-4">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-radius-full border border-border bg-bg transition-colors duration-[var(--motion-fast)] hover:bg-surface"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="h-5 w-5 text-text-tertiary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-[var(--weight-semibold)]">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-label text-text-secondary transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
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

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="text-label text-text-secondary">
            © {currentYear} Kitchy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-label text-text-secondary">Made in Thailand</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
