#!/usr/bin/env node

/**
 * SmartBiz PWA Icon Generator
 * 
 * Generates PNG icons from SVG sources for PWA manifest.
 * 
 * Prerequisites:
 *   npm install sharp --save-dev
 * 
 * Usage:
 *   node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (err) {
    console.error('Error: sharp is not installed.');
    console.error('Install it with: npm install sharp --save-dev');
    process.exit(1);
  }

  const iconsDir = path.join(__dirname, '..', 'frontend', 'public', 'icons');
  const publicDir = path.join(__dirname, '..', 'frontend', 'public');

  const icons = [
    { svg: 'icon-192x192.svg', png: 'pwa-192x192.png', size: 192 },
    { svg: 'icon-512x512.svg', png: 'pwa-512x512.png', size: 512 },
    { svg: 'apple-touch-icon.svg', png: 'apple-touch-icon.png', size: 180 },
  ];

  console.log('Generating PWA icons...\n');

  for (const icon of icons) {
    const svgPath = path.join(iconsDir, icon.svg);
    const pngPath = path.join(publicDir, icon.png);

    if (!fs.existsSync(svgPath)) {
      console.error(`  SVG not found: ${svgPath}`);
      continue;
    }

    try {
      await sharp(svgPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(pngPath);

      console.log(`  ✓ Created ${icon.png} (${icon.size}x${icon.size})`);
    } catch (err) {
      console.error(`  ✗ Failed to create ${icon.png}:`, err.message);
    }
  }

  // Generate maskable icons (with extra padding for safe zone)
  const maskableIcons = [
    { svg: 'icon-192x192.svg', png: 'pwa-maskable-192x192.png', size: 192 },
    { svg: 'icon-512x512.svg', png: 'pwa-maskable-512x512.png', size: 512 },
  ];

  console.log('\nGenerating maskable icons...\n');

  for (const icon of maskableIcons) {
    const svgPath = path.join(iconsDir, icon.svg);
    const pngPath = path.join(publicDir, icon.png);

    if (!fs.existsSync(svgPath)) {
      console.error(`  SVG not found: ${svgPath}`);
      continue;
    }

    try {
      // Maskable icons need 10% padding on each side for safe zone
      const padding = Math.round(icon.size * 0.1);
      const innerSize = icon.size - (padding * 2);

      // Create a padded version
      const paddedSvg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${icon.size}" height="${icon.size}" viewBox="0 0 ${icon.size} ${icon.size}">
          <rect width="${icon.size}" height="${icon.size}" fill="#0f172a"/>
        </svg>`
      );

      // Composite the icon centered with padding
      await sharp(paddedSvg)
        .composite([{
          input: svgPath,
          top: padding,
          left: padding,
          width: innerSize,
          height: innerSize,
        }])
        .png()
        .toFile(pngPath);

      console.log(`  ✓ Created ${icon.png} (${icon.size}x${icon.size})`);
    } catch (err) {
      console.error(`  ✗ Failed to create ${icon.png}:`, err.message);
    }
  }

  // Generate favicon.ico (multi-size)
  const faviconSvgPath = path.join(publicDir, 'favicon.svg');
  const faviconIcoPath = path.join(publicDir, 'favicon.ico');

  if (fs.existsSync(faviconSvgPath)) {
    try {
      await sharp(faviconSvgPath)
        .resize(32, 32)
        .png()
        .toFile(faviconIcoPath.replace('.ico', '.png'));
      
      // Rename to .ico (browsers accept PNG-format .ico files)
      fs.renameSync(faviconIcoPath.replace('.ico', '.png'), faviconIcoPath);
      console.log('\n  ✓ Created favicon.ico (32x32)');
    } catch (err) {
      console.error('  ✗ Failed to create favicon.ico:', err.message);
    }
  }

  console.log('\nDone! PWA icons generated successfully.');
}

generateIcons().catch(console.error);
