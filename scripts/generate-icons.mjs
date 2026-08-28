import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const outputDir = path.resolve('public', 'icons');

// Create standard SVG icon
function createSvg(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.2 : size * 0.1;
  const contentSize = size - padding * 2;
  const rx = isMaskable ? 0 : size * 0.22;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#09090b"/>
        <stop offset="100%" stop-color="#18181b"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10b981"/>
        <stop offset="50%" stop-color="#06b6d4"/>
        <stop offset="100%" stop-color="#3b82f6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="${size * 0.03}" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${rx}" fill="url(#bgGrad)" />
    
    <!-- Outer Accent Ring for standard icons -->
    ${!isMaskable ? `<rect x="${size * 0.04}" y="${size * 0.04}" width="${size * 0.92}" height="${size * 0.92}" rx="${rx * 0.85}" fill="none" stroke="url(#accentGrad)" stroke-width="${size * 0.015}" stroke-opacity="0.3"/>` : ''}

    <!-- Modern 'N' Logo Mark -->
    <g transform="translate(${padding}, ${padding})" filter="url(#glow)">
      <!-- Left Vertical Bar -->
      <rect x="${contentSize * 0.18}" y="${contentSize * 0.18}" width="${contentSize * 0.16}" height="${contentSize * 0.64}" rx="${contentSize * 0.08}" fill="url(#accentGrad)" />
      
      <!-- Right Vertical Bar -->
      <rect x="${contentSize * 0.66}" y="${contentSize * 0.18}" width="${contentSize * 0.16}" height="${contentSize * 0.64}" rx="${contentSize * 0.08}" fill="url(#accentGrad)" />
      
      <!-- Diagonal Connector with stylized angle -->
      <path d="
        M ${contentSize * 0.18} ${contentSize * 0.22}
        L ${contentSize * 0.66} ${contentSize * 0.78}
        L ${contentSize * 0.82} ${contentSize * 0.78}
        L ${contentSize * 0.34} ${contentSize * 0.22}
        Z
      " fill="url(#accentGrad)" opacity="0.9" />
    </g>
  </svg>
  `;
}

async function generate() {
  await fs.mkdir(outputDir, { recursive: true });

  const icons = [
    { name: 'icon-192x192.png', size: 192, maskable: false },
    { name: 'icon-512x512.png', size: 512, maskable: false },
    { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
  ];

  for (const icon of icons) {
    const svgString = createSvg(icon.size, icon.maskable);
    const destPath = path.join(outputDir, icon.name);

    await sharp(Buffer.from(svgString))
      .resize(icon.size, icon.size)
      .png({ quality: 100 })
      .toFile(destPath);

    console.log(`✓ Generated ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log('✨ All PWA icon assets generated successfully in public/icons/');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
