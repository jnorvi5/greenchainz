#!/usr/bin/env node

/**
 * Generate favicon files from SVG
 * Creates all required favicon sizes for web and mobile
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '..', 'public');

// SVG content
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#28a745"/>
  <path d="M50 20 L50 60 M35 40 Q50 25 65 40 M35 50 Q50 35 65 50" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>
`;

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
  console.log('🎨 Generating favicon files...\n');

  const svgBuffer = Buffer.from(svgContent);

  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✅ Generated ${name} (${size}x${size})`);
  }

  // Generate ICO file (32x32 for simplicity)
  const icoPath = join(publicDir, 'favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(icoPath);
  console.log(`✅ Generated favicon.ico (32x32)`);

  console.log('\n✨ All favicon files generated successfully!');
}

generateFavicons().catch((error) => {
  console.error('❌ Error generating favicons:', error);
  process.exit(1);
});
