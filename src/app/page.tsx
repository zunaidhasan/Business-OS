import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Modules, Platform, Workflow } from "@/components/landing/modules";
import { Faq, FinalCta, Footer, Pricing, Testimonials } from "@/components/landing/pricing";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  void ensureSeeded();

  return (
    <div className="bg-white">
      <LandingNav />
      <main>
        <Hero />
        <Modules />
        <Workflow />
        <Platform />
        <Pricing />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
