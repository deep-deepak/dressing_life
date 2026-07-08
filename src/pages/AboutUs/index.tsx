import { Award, Recycle, Users } from 'lucide-react';
import { placeholderImage } from '@/utils';
import { Container, SectionHeading } from '@/components/ui';

const STORY_STATS = [
  { icon: Users, label: 'Happy Customers', value: '25,000+' },
  { icon: Award, label: 'Years of Craft', value: '6+' },
  { icon: Recycle, label: 'Sustainable Batches', value: '100%' },
];

export default function AboutUsPage() {
  return (
    <>
      <section className="bg-brand-black text-brand-white">
        <Container className="section-y flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red-500">
            Our Story
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold sm:text-5xl">
            Built on Fabric, Fit, and a Refusal to Compromise
          </h1>
          <p className="max-w-xl text-sm text-brand-gray-300 sm:text-base">
            Dressing Life started with one obsession — the perfect T-shirt. No shortcuts on cotton, no
            compromise on cut.
          </p>
        </Container>
      </section>

      <section className="section-y">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <img
            src={placeholderImage({ label: 'OUR WORKSHOP', width: 900, height: 700 })}
            alt="Dressing Life workshop"
            className="aspect-[6/5] w-full object-cover"
          />
          <div className="flex flex-col gap-4">
            <SectionHeading
              eyebrow="Since 2020"
              title="From a Small Studio to a Movement"
              description="What began as a two-person operation cutting fabric in a Wardha studio has grown into a brand trusted by thousands who believe a T-shirt should feel as good as it looks."
            />
            <p className="text-sm text-brand-gray-500">
              Every piece is designed in-house, cut from heavyweight cotton, and quality-checked by hand
              before it ships. We don't chase trends — we build wardrobe staples that last seasons, not weeks.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-brand-gray-200 bg-brand-gray-50">
        <Container className="grid grid-cols-1 gap-8 py-14 sm:grid-cols-3">
          {STORY_STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon size={28} className="text-brand-red-700" />
              <span className="text-3xl font-semibold">{value}</span>
              <span className="text-xs uppercase tracking-wide text-brand-gray-500">{label}</span>
            </div>
          ))}
        </Container>
      </section>

      <section className="section-y">
        <Container className="flex flex-col gap-10">
          <SectionHeading eyebrow="What We Stand For" title="Our Values" align="center" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Quality First',
                copy: 'Every fabric batch is tested for weight, weave, and wash durability before approval.',
              },
              {
                title: 'Honest Pricing',
                copy: 'Premium cotton shouldn’t come with a premium markup — we cut the middleman, not the quality.',
              },
              {
                title: 'Responsible Production',
                copy: 'Low-impact dyes and fair-wage manufacturing partners, audited every season.',
              },
            ].map((value) => (
              <div key={value.title} className="flex flex-col gap-2 border border-brand-gray-200 p-6">
                <h3 className="font-display text-lg uppercase tracking-wide">{value.title}</h3>
                <p className="text-sm text-brand-gray-500">{value.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
