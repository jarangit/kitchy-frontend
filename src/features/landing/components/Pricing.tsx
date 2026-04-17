import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
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
  <Card
    className={cn(
      "relative h-full transition-colors duration-[var(--motion-fast)]",
      plan.highlight ? "bg-text-primary text-text-inverse" : "bg-bg",
      isActive ? "opacity-100" : "opacity-100",
    )}
  >
    <CardContent className="flex h-full flex-col">
    {plan.highlight && (
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-radius-full border border-border bg-surface px-4 py-1 text-label text-text-primary">
        แนะนำ
      </div>
    )}

    <div className="mb-6">
      <h3
        className={cn(
          "text-title mb-2",
          plan.highlight ? "text-text-inverse" : "text-text-primary"
        )}
      >
        {plan.name}
      </h3>
      <p
        className={cn(
          "text-label",
          plan.highlight ? "text-text-tertiary" : "text-text-secondary"
        )}
      >
        {plan.description}
      </p>
    </div>

    <div className="mb-8">
      <span
        className={cn(
          "text-display",
          plan.highlight ? "text-text-inverse" : "text-text-primary"
        )}
      >
        {plan.price === "ติดต่อ" ? "" : "฿"}
        {plan.price}
      </span>
      <span
        className={cn(
          "text-label ml-2",
          plan.highlight ? "text-text-tertiary" : "text-text-secondary"
        )}
      >
        {plan.period}
      </span>
    </div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <svg
            className={cn(
              "h-5 w-5 flex-shrink-0",
              plan.highlight ? "text-text-inverse" : "text-primary",
            )}
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
            className={plan.highlight ? "text-text-tertiary" : "text-text-secondary"}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <div className="mt-auto">
      <Button
        variant={plan.highlight ? "secondary" : "primary"}
        size="lg"
        className="w-full"
      >
        {plan.cta}
      </Button>
    </div>
    </CardContent>
  </Card>
);

const Pricing = () => {
  const [activeTab, setActiveTab] = useState<PlanType>("pro");

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="text-label uppercase tracking-wide text-text-secondary">
            Pricing
          </span>
          <h2 className="mt-4 mb-6 text-display text-text-primary  ">
            แพ็กเกจที่เหมาะกับคุณ
          </h2>
          <p className="mx-auto max-w-2xl text-title text-text-secondary">
            เลือกแพ็กเกจที่ตอบโจทย์ธุรกิจของคุณ ไม่มีค่าใช้จ่ายแอบแฝง
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <SegmentedControl
            items={[
              { key: "free" as PlanType, label: "ฟรี" },
              { key: "pro" as PlanType, label: "Pro" },
              { key: "enterprise" as PlanType, label: "Enterprise" },
            ]}
            value={activeTab}
            onChange={setActiveTab}
            className="rounded-radius-full"
          />
        </div>

        <div className="grid items-start gap-8 md:grid-cols-3">
          {(["free", "pro", "enterprise"] as PlanType[]).map((planKey) => (
            <PricingCard
              key={planKey}
              plan={plans[planKey]}
              isActive={activeTab === planKey}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-text-secondary">
            มีคำถาม?{" "}
            <a
              href="#faq"
              className="font-[var(--weight-medium)] text-primary transition-colors duration-[var(--motion-fast)] hover:text-primary-hover"
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
