import { Navbar } from "@/components/nav/Navbar";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LogosStrip } from "@/components/sections/LogosStrip";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LogosStrip />
        <Services />
        <Stats />
        <Products />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
