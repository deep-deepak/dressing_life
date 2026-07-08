import { useState } from 'react';
import { cn } from '@/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse">
      <div className="aspect-[4/5] w-full overflow-hidden bg-brand-gray-100">
        <img src={images[activeIndex]} alt={alt} className="size-full object-cover" />
      </div>
      <div className="flex gap-3 sm:flex-col">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              'size-16 shrink-0 overflow-hidden border-2 sm:size-20',
              activeIndex === index ? 'border-brand-black' : 'border-transparent',
            )}
          >
            <img src={image} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
