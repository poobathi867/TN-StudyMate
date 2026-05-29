const fs = require('fs');
const img = fs.readFileSync('TN-StudyMate Logo.png');
const b64 = img.toString('base64');
const svg = `<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <clipPath id='circleClip'>
      <circle cx='128' cy='128' r='124' />
    </clipPath>
  </defs>
  <image width='256' height='256' href='data:image/png;base64,${b64}' clip-path='url(#circleClip)' />
</svg>`;
fs.writeFileSync('public/favicon.svg', svg);
console.log('Done');
