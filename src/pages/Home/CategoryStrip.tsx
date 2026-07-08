import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { placeholderImage } from '@/utils';
import { Container, SectionHeading } from '@/components/ui';

const CATEGORY_CARDS = [
  { label: 'Graphic Tees', category: 'Graphic', bg: '0a0a0a' },
  { label: 'Solid Tees', category: 'Solid', bg: '2b2b2b' },
  { label: 'Oversized Tees', category: 'Oversized', bg: '1a1a1a' },
  { label: 'Henley Tees', category: 'Henley', bg: '7a0f0f' },
];

export function CategoryStrip() {
  return (
    <section className="section-y bg-brand-white">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow="Shop by Style" title="Find Your Fit" align="center" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORY_CARDS.map((card) => (
            <Link
              key={card.category}
              to={`${ROUTES.TSHIRTS}?category=${card.category}`}
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              <img
                src={placeholderImage({ label: card.label.toUpperCase(), background: card.bg })}
                alt={card.label}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 font-display text-lg uppercase tracking-wide text-brand-white">
                {card.label}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
