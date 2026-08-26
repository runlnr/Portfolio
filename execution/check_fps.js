const fs = require('fs');

function parseMp4Fps(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 0;

  function readBox(offset, end) {
    let p = offset;
    while (p < end && p + 8 <= buf.length) {
      const size = buf.readUInt32BE(p);
      const type = buf.toString('ascii', p + 4, p + 8);
      const boxEnd = size === 1 ? p + Number(buf.readBigUInt64BE(p + 8)) : (size === 0 ? end : p + size);

      if (['moov', 'trak', 'mdia', 'minf', 'stbl'].includes(type)) {
        readBox(p + 8, boxEnd);
      } else if (type === 'mdhd') {
        const version = buf.readUInt8(p + 8);
        const timescale = version === 1 ? buf.readUInt32BE(p + 28) : buf.readUInt32BE(p + 20);
        const duration = version === 1 ? Number(buf.readBigUInt64BE(p + 32)) : buf.readUInt32BE(p + 24);
        console.log(`mdhd: timescale=${timescale}, duration=${duration}, seconds=${duration / timescale}`);
      } else if (type === 'stts') {
        const entryCount = buf.readUInt32BE(p + 12);
        console.log(`stts: entryCount=${entryCount}`);
        let sttsPos = p + 16;
        let totalSamples = 0;
        let totalDuration = 0;
        for (let i = 0; i < Math.min(entryCount, 5); i++) {
          const sampleCount = buf.readUInt32BE(sttsPos);
          const sampleDelta = buf.readUInt32BE(sttsPos + 4);
          console.log(`  entry ${i}: sampleCount=${sampleCount}, sampleDelta=${sampleDelta}`);
          totalSamples += sampleCount;
          totalDuration += sampleCount * sampleDelta;
          sttsPos += 8;
        }
      }
      p = boxEnd;
    }
  }

  readBox(0, buf.length);
}

console.log('--- Parsing MP4 container atoms ---');
parseMp4Fps('assets/videos/Rose Ascii 60fps.mp4');
