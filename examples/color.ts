import { hexToRgb, mixRgbColors, rgbToHex, rgbToHsl } from '../src/index.js';

const brandPrimary = '#1abc9c';
const brandAccent = '#f1c40f';

const primaryRgb = hexToRgb(brandPrimary);
const accentRgb = hexToRgb(brandAccent);

console.log('Primary RGB:', primaryRgb);
console.log('Primary HSL:', rgbToHsl(primaryRgb));

const highlight = mixRgbColors(primaryRgb, accentRgb, { ratio: 0.35 });
console.log('Highlight RGB:', highlight);
console.log('Highlight hex:', rgbToHex(highlight));
