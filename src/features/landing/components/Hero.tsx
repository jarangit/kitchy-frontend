const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[var(--color-success-bg)] text-[var(--color-primary)] px-4 py-2 rounded-radius-full text-label font-[var(--weight-medium)] mb-8">
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-radius-full animate-pulse"></span>
          ใหม่! รองรับการเชื่อมต่อ POS
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[var(--weight-bold)] text-[var(--color-text-primary)] tracking-tight leading-tight mb-6">
          จัดการครัวของคุณ
          <br />
          <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] bg-clip-text text-transparent">
            อย่างมืออาชีพ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-title text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          ระบบจัดการครัวอัจฉริยะที่ช่วยให้ร้านอาหารของคุณ
          ทำงานได้อย่างลื่นไหลและมีประสิทธิภาพมากขึ้น
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="w-full sm:w-auto bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] px-8 py-4 rounded-radius-full font-[var(--weight-medium)] text-subtitle hover:opacity-90 transition-all duration-[var(--motion-fast)] hover:scale-105 active:scale-[0.98] shadow-lg h-14">
            เริ่มต้นใช้งานฟรี
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-[var(--color-text-secondary)] px-8 py-4 rounded-radius-full font-[var(--weight-medium)] text-subtitle hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98] h-14">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            ดูวิดีโอสาธิต
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-hover)] rounded-radius-xl p-2 shadow-2xl">
            <div className="bg-[var(--color-bg)] rounded-radius-lg overflow-hidden">
              <div className="bg-[var(--color-surface)] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-radius-full bg-[var(--color-danger)]"></div>
                  <div className="w-3 h-3 rounded-radius-full bg-[var(--color-warning)]"></div>
                  <div className="w-3 h-3 rounded-radius-full bg-[var(--color-success)]"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="bg-[var(--color-bg)] rounded-radius-sm px-4 py-1 inline-block text-label text-[var(--color-text-secondary)]">
                    app.kitchy.co
                  </div>
                </div>
              </div>
              <img
                src="/kds-dashboard.png"
                alt="KDS Dashboard"
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/1200x700/f9fafb/d1d5db?text=Kitchen+Display+System";
                }}
              />
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16">
          <p className="text-label text-[var(--color-text-tertiary)] mb-6">
            ได้รับความไว้วางใจจากร้านอาหารชั้นนำ
          </p>
          <div className="flex items-center justify-center gap-8 opacity-50 grayscale">
            <div className="text-heading font-[var(--weight-bold)] text-[var(--color-text-tertiary)]">Brand 1</div>
            <div className="text-heading font-[var(--weight-bold)] text-[var(--color-text-tertiary)]">Brand 2</div>
            <div className="text-heading font-[var(--weight-bold)] text-[var(--color-text-tertiary)]">Brand 3</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
