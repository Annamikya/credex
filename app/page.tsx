import { Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
import { AuditFormPreview } from '../components/site/audit-form-preview';
import { FeatureCard } from '../components/site/feature-card';
import { FaqSection } from '../components/site/faq';
import { Footer } from '../components/site/footer';
import { HeroSection } from '../components/site/hero';
import { HowItWorks } from '../components/site/how-it-works';
import { SavingsSamples } from '../components/site/savings-samples';
import { Testimonials } from '../components/site/testimonials';
import { siteConfig } from '../lib/site-config';

const features = [
  {
    title: 'Spend health in seconds',
    description: 'Quickly see where AI licenses and API spend is high, redundant, or misaligned with your team.',
    icon: Sparkles
  },
  {
    title: 'Smart downgrade advice',
    description: 'Rule-based recommendations help early-stage teams move away from enterprise plans without losing capability.',
    icon: TrendingUp
  },
  {
    title: 'Ready for founders',
    description: 'Designed for startup operators who need a polished audit report and executive savings narrative.',
    icon: ShieldCheck
  }
];

const stats = [
  { label: 'AI platforms supported', value: '6+' },
  { label: 'Minutes to audit', value: '2' },
  { label: 'Modern spend score', value: 'Premium' }
];

export default function HomePage() {
  return (
    <main className="bg-slate-950 text-slate-100">
      <HeroSection />
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-soft sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-slate-950/80 p-5 text-center">
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon} />
          ))}
        </div>
      </section>
      <HowItWorks />
      <SavingsSamples />
      <Testimonials />
      <FaqSection />
      <AuditFormPreview />
      <Footer />
      <div className="sr-only">{siteConfig.title} landing page</div>
    </main>
  );
}
