import { Card, CardContent } from "@/shared/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="h-full bg-bg transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
    <CardContent className="space-y-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-radius-lg bg-surface text-2xl">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-title text-text-primary">{title}</h3>
        <p className="text-body leading-7 text-text-secondary">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "ลดออเดอร์ตกหล่น",
      description: "ติดตามทุกออเดอร์แบบเรียลไทม์ ไม่มีออเดอร์ไหนหลุดรอดอีกต่อไป ระบบแจ้งเตือนอัตโนมัติเมื่อออเดอร์รอนานเกินกำหนด",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "สถานะเรียลไทม์",
      description: "รู้สถานะอาหารทุกจานทันที ตั้งแต่เริ่มทำจนถึงเสิร์ฟ พนักงานเสิร์ฟและครัวทำงานประสานกันได้อย่างสมบูรณ์แบบ",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      title: "รองรับหลาย Station",
      description: "จัดการครัวได้หลายจุดพร้อมกัน ไม่ว่าจะเป็นสเตชั่นอาหารร้อน อาหารเย็น เครื่องดื่ม หรือของหวาน",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "วิเคราะห์ข้อมูล",
      description: "ดูรายงานประสิทธิภาพครัว เวลาเฉลี่ยในการทำอาหาร และสถิติที่ช่วยให้คุณปรับปรุงการทำงานได้ดีขึ้น",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "ใช้งานได้ทุกอุปกรณ์",
      description: "รองรับทั้ง Tablet, Desktop และ Smart TV ติดตั้งง่าย ใช้งานได้ทันทีผ่าน Web Browser",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "เชื่อมต่อ POS",
      description: "รองรับการเชื่อมต่อกับระบบ POS ชั้นนำ ออเดอร์เข้าครัวอัตโนมัติ ไม่ต้องกรอกซ้ำ",
    },
  ];

  return (
    <section id="features" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-label uppercase tracking-wide text-text-secondary">
            Features
          </span>
          <h2 className="mt-4 mb-6 text-display text-text-primary  ">
            ทำไมร้านอาหารต้องเลือก Kitchy
          </h2>
          <p className="mx-auto max-w-2xl text-title text-text-secondary">
            ฟีเจอร์ครบครันที่ออกแบบมาเพื่อร้านอาหารโดยเฉพาะ
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
