const fs = require('fs');
const path = require('path');

// SmartBiz SVG Icon Template
function createSmartBizSVG(size) {
  const padding = Math.round(size * 0.1);
  const innerSize = size - (padding * 2);
  const cornerRadius = Math.round(size * 0.15);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#grad)"/>
  <g transform="translate(${padding}, ${padding})">
    <rect x="${innerSize * 0.15}" y="${innerSize * 0.2}" width="${innerSize * 0.7}" height="${innerSize * 0.08}" rx="${innerSize * 0.02}" fill="url(#accent)"/>
    <rect x="${innerSize * 0.15}" y="${innerSize * 0.35}" width="${innerSize * 0.5}" height="${innerSize * 0.08}" rx="${innerSize * 0.02}" fill="url(#accent)" opacity="0.8"/>
    <rect x="${innerSize * 0.15}" y="${innerSize * 0.5}" width="${innerSize * 0.35}" height="${innerSize * 0.08}" rx="${innerSize * 0.02}" fill="url(#accent)" opacity="0.6"/>
    <circle cx="${innerSize * 0.75}" cy="${innerSize * 0.7}" r="${innerSize * 0.15}" fill="url(#accent)"/>
    <path d="M ${innerSize * 0.7} ${innerSize * 0.7} L ${innerSize * 0.75} ${innerSize * 0.6} L ${innerSize * 0.8} ${innerSize * 0.7} Z" fill="white" opacity="0.9"/>
  </g>
</svg>`;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname);
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
const sizes = [192, 512];
sizes.forEach(size => {
  const svg = createSmartBizSVG(size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svg);
  console.log(`Created: ${filename}`);
});

// Create apple-touch-icon SVG (180x180)
const appleSvg = createSmartBizSVG(180);
const appleFilename = path.join(iconsDir, 'apple-touch-icon.svg');
fs.writeFileSync(appleFilename, appleSvg);
console.log(`Created: ${appleFilename}`);

console.log('\nSVG icons created successfully!');
console.log('\nTo convert to PNG, install sharp:');
console.log('  npm install sharp --save-dev');
console.log('\nThen run:');
console.log('  node scripts/generate-png-icons.js');
