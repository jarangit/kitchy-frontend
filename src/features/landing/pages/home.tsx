import { Header, Hero, Features, Pricing, Footer } from "@/features/landing/components";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-bg antialiased">
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
