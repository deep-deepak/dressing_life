import { TESTIMONIALS } from '@/services';
import { Container, Rating, SectionHeading } from '@/components/ui';

export function Testimonials() {
  return (
    <section className="section-y bg-brand-black text-brand-white">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Community"
          title="What They're Saying"
          align="center"
          className="[&_h2]:text-brand-white [&_span]:text-brand-red-500"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.id} className="flex flex-col gap-4 border border-brand-charcoal p-6">
              <Rating value={testimonial.rating} />
              <blockquote className="text-sm text-brand-gray-300">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto text-xs uppercase tracking-wide text-brand-gray-500">
                {testimonial.name} — {testimonial.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
