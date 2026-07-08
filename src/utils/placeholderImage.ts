interface PlaceholderOptions {
  width?: number;
  height?: number;
  background?: string;
  foreground?: string;
  label: string;
}

/**
 * Generates a self-contained SVG data URI so the storefront renders
 * consistent product/avatar art without depending on external image hosts.
 * Swap with real CDN URLs once the product API is wired up.
 */
export function placeholderImage({
  width = 800,
  height = 1000,
  background = '0a0a0a',
  foreground = 'ffffff',
  label,
}: PlaceholderOptions) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#${background}"/>
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="#${foreground}" stroke-opacity="0.15" stroke-width="2"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#${foreground}" fill-opacity="0.85" font-family="Oswald, sans-serif" font-size="${Math.max(width * 0.06, 20)}" letter-spacing="2">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
