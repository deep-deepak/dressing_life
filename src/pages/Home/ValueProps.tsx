import { Leaf, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { Container } from '@/components/ui';

const VALUE_PROPS = [
  { icon: ShieldCheck, title: 'Premium Fabric', description: '200+ GSM combed cotton, every batch.' },
  { icon: Truck, title: 'Fast Shipping', description: 'Dispatched within 24 hours, pan-India.' },
  { icon: RotateCcw, title: 'Easy Returns', description: '7-day hassle-free size exchange.' },
  { icon: Leaf, title: 'Responsibly Made', description: 'Low-impact dyes, ethical manufacturing.' },
];

export function ValueProps() {
  return (
    <section className="border-y border-brand-gray-200 bg-brand-white">
      <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-3 text-center">
            <Icon size={28} className="text-brand-red-700" />
            <h3 className="font-display text-sm uppercase tracking-wide">{title}</h3>
            <p className="text-xs text-brand-gray-500">{description}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
