import { Header, Hero, Features, Pricing, Footer } from "@/components/landing";

const HomePage = () => {
  return (
    <div className="bg-white min-h-screen antialiased">
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
