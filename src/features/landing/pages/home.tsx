import { Header, Hero, Features, Pricing, Footer } from "@/features/landing/components";

const HomePage = () => {
  return (
    <div className="bg-[var(--color-bg)] min-h-screen antialiased">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
