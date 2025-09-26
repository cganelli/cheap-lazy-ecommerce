import React from 'react';

export function ProductCardImage({
  src, srcSet, alt, blur, ratio = 4 / 5, // portrait default
}: {
  src: string; srcSet?: string; alt: string; blur?: string; ratio?: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md bg-white"
      style={{ aspectRatio: String(ratio) }} // width/height
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width:1024px) 220px, (min-width:640px) 33vw, 50vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
        width={800}
        height={1000}
        style={blur ? { backgroundImage: `url(${blur})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } : undefined}
      />
    </div>
  );
}
