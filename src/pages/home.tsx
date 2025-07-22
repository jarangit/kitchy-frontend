import { AlertDialogDemo } from "@/components/ui-system/components/ORG/modals/test-modal";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("free");
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <AlertDialogDemo />
      {/* Hero Section */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="Kitchy Logo" className="h-10 mr-4" />
            <h1 className="text-2xl font-bold text-gray-800">Kitchy</h1>
          </div>
          <nav>
            <a
              href="#features"
              className="mx-2 text-gray-600 hover:text-blue-600"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="mx-2 text-gray-600 hover:text-blue-600"
            >
              Pricing
            </a>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          จัดการครัวเร็วเหมือนเสกอาหารด้วยเวทมนตร์ 🍽️✨
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          ระบบจัดการครัวอัจฉริยะที่ช่วยให้ร้านอาหารของคุณทำงานได้อย่างลื่นไหล
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
            เริ่มต้นใช้งานฟรี
          </button>
          <button className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50">
            ดูวิดีโอสาธิต
          </button>
        </div>
        <img
          src="/kds-dashboard.png"
          alt="KDS Dashboard"
          className="mx-auto mt-8 shadow-lg rounded-lg"
        />
      </section>

      {/* Value Proposition */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            ทำไมร้านอาหารต้องเลือก Kitchy
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚫",
                title: "ลดออเดอร์ตกหล่น",
                desc: "ติดตามออเดอร์ได้อย่างแม่นยำ",
              },
              {
                icon: "⏱️",
                title: "เห็นสถานะเรียลไทม์",
                desc: "รู้สถานะอาหารทันที",
              },
              {
                icon: "🔀",
                title: "รองรับหลาย Station",
                desc: "จัดการครัวได้หลายจุด",
              },
            ].map((prop, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-100 rounded-lg"
              >
                <div className="text-4xl mb-4">{prop.icon}</div>
                <h4 className="font-bold mb-2">{prop.title}</h4>
                <p className="text-gray-600">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-12">
          แพ็กเกจที่เหมาะกับคุณ
        </h3>
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 rounded-full p-1 flex">
            {["free", "pro", "enterprise"].map((plan) => (
              <button
                key={plan}
                onClick={() => setActiveTab(plan)}
                className={`px-4 py-2 rounded-full ${
                  activeTab === plan
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
              >
                {plan === "free" ? "ฟรี" : plan === "pro" ? "โปร" : "องค์กร"}
              </button>
            ))}
          </div>
        </div>
        {/* Pricing Details */}
        <div className="grid md:grid-cols-3 gap-8">{/* Pricing Cards */}</div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Kitchy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
