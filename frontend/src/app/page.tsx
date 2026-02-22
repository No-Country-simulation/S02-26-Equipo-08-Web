import { Navbar } from "@/src/components/landing/Navbar";
import { Hero } from "@/src/components/landing/Hero";
import { Services } from "@/src/components/landing/Services";
import { WhyUs } from "@/src/components/landing/WhyUs";
import { HowItWorks } from "@/src/components/landing/HowItWorks";
import { Stats } from "@/src/components/landing/Stats";
import { Testimonials } from "@/src/components/landing/Testimonials";
import { CTA } from "@/src/components/landing/CTA";
import { Footer } from "@/src/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
