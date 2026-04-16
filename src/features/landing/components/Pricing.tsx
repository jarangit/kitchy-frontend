import { useState } from "react";
import { SegmentedControl } from "@/shared/components/ui/segmented-control";
import { cn } from "@/shared/utils/cn";

type PlanType = "free" | "pro" | "enterprise";

interface PlanDetails {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

const plans: Record<PlanType, PlanDetails> = {
  free: {
    name: "ฟรี",
    price: "0",
    period: "ตลอดไป",
    description: "เหมาะสำหรับร้านขนาดเล็กที่เพิ่งเริ่มต้น",
    features: [
      "1 Station",
      "ออเดอร์ไม่จำกัด",
      "รายงานพื้นฐาน",
      "Support ผ่าน Email",
    ],
    cta: "เริ่มต้นใช้งานฟรี",
  },
  pro: {
    name: "Pro",
    price: "599",
    period: "บาท/เดือน",
    description: "เหมาะสำหรับร้านที่ต้องการฟีเจอร์ครบครัน",
    features: [
      "ไม่จำกัด Station",
      "ออเดอร์ไม่จำกัด",
      "รายงานขั้นสูง",
      "เชื่อมต่อ POS",
      "Priority Support",
      "Custom Branding",
    ],
    highlight: true,
    cta: "ทดลองใช้ 14 วันฟรี",
  },
  enterprise: {
    name: "Enterprise",
    price: "ติดต่อ",
    period: "ราคาพิเศษ",
    description: "สำหรับเครือร้านอาหารหรือธุรกิจขนาดใหญ่",
    features: [
      "ทุกอย่างใน Pro",
      "Multi-branch Management",
      "API Access",
      "Dedicated Support",
      "SLA Guarantee",
      "On-premise Option",
    ],
    cta: "ติดต่อทีมขาย",
  },
};

const PricingCard = ({
  plan,
  isActive,
}: {
  plan: PlanDetails;
  isActive: boolean;
}) => (
  <div
    className={cn(
      "relative p-8 rounded-3xl transition-all duration-300",
      plan.highlight
        ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] scale-105 shadow-2xl"
        : "bg-[var(--color-bg)] border border-[var(--color-border)]",
      isActive ? "opacity-100" : "opacity-100"
    )}
  >
    {plan.highlight && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-text-inverse)] text-label font-[var(--weight-medium)] px-4 py-1 rounded-full">
        แนะนำ
      </div>
    )}

    <div className="mb-6">
      <h3
        className={cn(
          "text-title font-[var(--weight-semibold)] mb-2",
          plan.highlight ? "text-[var(--color-text-inverse)]" : "text-[var(--color-text-primary)]"
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "text-label",
          plan.highlight ? "text-[var(--color-text-tertiary)]" : "text-[var(--color-text-secondary)]"
        )}
      >
        {plan.description}
      </p>
    </div>

    <div className="mb-8">
      <span
        className={cn(
          "text-5xl font-[var(--weight-bold)]",
          plan.highlight ? "text-[var(--color-text-inverse)]" : "text-[var(--color-text-primary)]"
        )}
      >
        {plan.price === "ติดต่อ" ? "" : "฿"}
        {plan.price}
      </span>
      <span
        className={cn(
          "text-label ml-2",
          plan.highlight ? "text-[var(--color-text-tertiary)]" : "text-[var(--color-text-secondary)]"
        )}
      >
        {plan.period}
      </span>
    </div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span
            className={plan.highlight ? "text-[var(--color-text-tertiary)]" : "text-[var(--color-text-secondary)]"}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <button
      className={cn(
        "w-full py-4 rounded-full font-[var(--weight-medium)] transition-all duration-[var(--motion-fast)] hover:scale-105 active:scale-[0.98] h-14",
        plan.highlight
          ? "bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
          : "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] hover:opacity-90"
      )}
    >
      {plan.cta}
    </button>
  </div>
);

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<PlanType>("pro");

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[var(--color-primary)] font-[var(--weight-medium)] text-label tracking-wide uppercase">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-[var(--weight-bold)] text-[var(--color-text-primary)] mt-4 mb-6">
            แพ็กเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-title text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            เลือกแพ็กเกจที่ตอบโจทย์ธุรกิจของคุณ ไม่มีค่าใช้จ่ายแอบแฝง
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <SegmentedControl
            items={[
              { key: "free" as PlanType, label: "ฟรี" },
              { key: "pro" as PlanType, label: "Pro" },
              { key: "enterprise" as PlanType, label: "Enterprise" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
            className="rounded-full"
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {(["free", "pro", "enterprise"] as PlanType[]).map((planKey) => (
            <PricingCard
              key={planKey}
              plan={plans[planKey]}
              isActive={activeTab === planKey}
            />
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-[var(--color-text-secondary)]">
            มีคำถาม?{" "}
            <a
              href="#faq"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-[var(--weight-medium)] transition-all duration-[var(--motion-fast)]"
            >
              ดูคำถามที่พบบ่อย
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
