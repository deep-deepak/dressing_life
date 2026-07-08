import { HomeHero } from './HomeHero';
import { CategoryStrip } from './CategoryStrip';
import { FeaturedProducts } from './FeaturedProducts';
import { ValueProps } from './ValueProps';
import { Testimonials } from './Testimonials';
import { NewsletterBanner } from './NewsletterBanner';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ValueProps />
      <CategoryStrip />
      <FeaturedProducts />
      <Testimonials />
      <NewsletterBanner />
    </>
  );
}
