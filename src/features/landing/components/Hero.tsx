const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          ใหม่! รองรับการเชื่อมต่อ POS
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
          จัดการครัวของคุณ
          <br />
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            อย่างมืออาชีพ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          ระบบจัดการครัวอัจฉริยะที่ช่วยให้ร้านอาหารของคุณ
          ทำงานได้อย่างลื่นไหลและมีประสิทธิภาพมากขึ้น
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20">
            เริ่มต้นใช้งานฟรี
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-600 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-all">
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
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-2 shadow-2xl shadow-gray-300/50">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="bg-white rounded-lg px-4 py-1 inline-block text-sm text-gray-500">
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
          <p className="text-sm text-gray-400 mb-6">
            ได้รับความไว้วางใจจากร้านอาหารชั้นนำ
          </p>
          <div className="flex items-center justify-center gap-8 opacity-50 grayscale">
            <div className="text-2xl font-bold text-gray-400">Brand 1</div>
            <div className="text-2xl font-bold text-gray-400">Brand 2</div>
            <div className="text-2xl font-bold text-gray-400">Brand 3</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
