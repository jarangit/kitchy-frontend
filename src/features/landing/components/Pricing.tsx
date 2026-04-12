import { useState } from "react";

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
    className={`relative p-8 rounded-3xl transition-all duration-300 ${
      plan.highlight
        ? "bg-gray-900 text-white scale-105 shadow-2xl shadow-gray-900/30"
        : "bg-white border border-gray-200"
    } ${isActive ? "opacity-100" : "opacity-100"}`}
  >
    {plan.highlight && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium px-4 py-1 rounded-full">
        แนะนำ
      </div>
    )}

    <div className="mb-6">
      <h3
        className={`text-xl font-semibold mb-2 ${
          plan.highlight ? "text-white" : "text-gray-900"
        }`}
      >
        {plan.name}
      </h3>
      <p
        className={`text-sm ${
          plan.highlight ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {plan.description}
      </p>
    </div>

    <div className="mb-8">
      <span
        className={`text-5xl font-bold ${
          plan.highlight ? "text-white" : "text-gray-900"
        }`}
      >
        {plan.price === "ติดต่อ" ? "" : "฿"}
        {plan.price}
      </span>
      <span
        className={`text-sm ml-2 ${
          plan.highlight ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {plan.period}
      </span>
    </div>

    <ul className="space-y-4 mb-8">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 flex-shrink-0 ${
              plan.highlight ? "text-orange-400" : "text-orange-500"
            }`}
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
            className={plan.highlight ? "text-gray-300" : "text-gray-600"}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <button
      className={`w-full py-4 rounded-full font-medium transition-all hover:scale-105 active:scale-95 ${
        plan.highlight
          ? "bg-white text-gray-900 hover:bg-gray-100"
          : "bg-gray-900 text-white hover:bg-gray-800"
      }`}
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
          <span className="text-orange-500 font-medium text-sm tracking-wide uppercase">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            แพ็กเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            เลือกแพ็กเกจที่ตอบโจทย์ธุรกิจของคุณ ไม่มีค่าใช้จ่ายแอบแฝง
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1.5 rounded-full inline-flex">
            {(["free", "pro", "enterprise"] as PlanType[]).map((plan) => (
              <button
                key={plan}
                onClick={() => setActiveTab(plan)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === plan
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {plan === "free" ? "ฟรี" : plan === "pro" ? "Pro" : "Enterprise"}
              </button>
            ))}
          </div>
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
          <p className="text-gray-500">
            มีคำถาม?{" "}
            <a
              href="#faq"
              className="text-orange-500 hover:text-orange-600 font-medium"
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
