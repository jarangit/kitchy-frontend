import { Button } from "@/shared/components/ui/button";

const Hero = () => {
  return (
    <section className="px-6 pb-20 pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-radius-full border border-border bg-surface px-4 py-2 text-label text-text-secondary">
          <span className="h-2 w-2 rounded-radius-full bg-primary"></span>
          ใหม่! รองรับการเชื่อมต่อ POS
        </div>

        <h1 className="mb-6 text-display text-text-primary sm:text-[56px] sm:leading-[1.05] lg:text-[72px]">
          จัดการครัวของคุณ
          <br />
          <span className="text-text-secondary">
            อย่างมืออาชีพ
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-title text-text-secondary">
          ระบบจัดการครัวอัจฉริยะที่ช่วยให้ร้านอาหารของคุณ
          ทำงานได้อย่างลื่นไหลและมีประสิทธิภาพมากขึ้น
        </p>

        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto">
            เริ่มต้นใช้งานฟรี
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
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
          </Button>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-radius-2xl border border-border bg-surface">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-radius-full bg-danger"></div>
                  <div className="h-3 w-3 rounded-radius-full bg-warning"></div>
                  <div className="h-3 w-3 rounded-radius-full bg-success"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block rounded-radius-sm bg-bg px-4 py-1 text-label text-text-secondary">
                    app.kitchy.co
                  </div>
                </div>
            </div>
            <img
              src="/kds-dashboard.png"
              alt="KDS Dashboard"
              className="h-auto w-full bg-bg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/1200x700/f5f5f7/86868b?text=Kitchen+Display+System";
              }}
            />
          </div>
        </div>

        <div className="mt-16">
          <p className="mb-6 text-label text-text-tertiary">
            ได้รับความไว้วางใจจากร้านอาหารชั้นนำ
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60 grayscale">
            <div className="text-heading text-text-tertiary">Brand 1</div>
            <div className="text-heading text-text-tertiary">Brand 2</div>
            <div className="text-heading text-text-tertiary">Brand 3</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
