const fs = require('fs');

const content = fs.readFileSync('assets/DISC ASCII.svg', 'utf8');
const regex = /<text\s+x="([^"]+)"\s+y="([^"]+)"\s+fill="([^"]+)">([^<]+)<\/text>/g;
let match;
let count = 0;
const particles = [];
while ((match = regex.exec(content)) !== null) {
  particles.push({
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    fill: match[3],
    char: match[4]
  });
  count++;
}
console.log('Parsed particles count:', count);
console.log('Sample particle:', particles[0]);
fs.writeFileSync('assets/disc-ascii-particles.json', JSON.stringify(particles));
console.log('Saved assets/disc-ascii-particles.json, size:', fs.statSync('assets/disc-ascii-particles.json').size);
