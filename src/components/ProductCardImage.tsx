import React from 'react';

export function ProductCardImage({
  src, srcSet, alt, blur, ratio = 4 / 5, affiliateUrl, // portrait default
}: {
  src: string; srcSet?: string; alt: string; blur?: string; ratio?: number; affiliateUrl?: string;
}) {
  const imageContent = (
    <div
      className="relative w-full overflow-hidden rounded-md bg-white transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      style={{ aspectRatio: String(ratio) }} // width/height
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width:1024px) 220px, (min-width:640px) 33vw, 50vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 hover:scale-110"
        width={800}
        height={1000}
        style={blur ? { backgroundImage: `url(${blur})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } : undefined}
      />
      {/* Buy on Amazon overlay */}
      <div className="absolute top-2 right-2 bg-red-600 text-white font-bold text-xs px-2 py-1 rounded shadow-lg transition-transform duration-300 hover:scale-110">
        Buy on Amazon
      </div>
    </div>
  );

  // If affiliateUrl is provided, wrap the entire image in a link
  if (affiliateUrl) {
    return (
      <a 
        href={affiliateUrl} 
        target="_blank" 
        rel="sponsored noopener noreferrer"
        aria-label={`Buy ${alt} on Amazon (opens in a new tab)`}
        className="block"
      >
        {imageContent}
      </a>
    );
  }

  return imageContent;
}
