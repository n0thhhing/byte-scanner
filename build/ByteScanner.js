// src/ByteScanner.ts
import fs from "fs";
var hexStrToBuf = function (hexString) {
  return Buffer.from(hexString.replace(/\s+/g, ""), "hex");
};

class ByteScanner {
  bufferSpec;
  pattern = [];
  fileBuffer;
  constructor(bufferSpec) {
    this.bufferSpec = bufferSpec;
    this.fileBuffer = this.isBuffer(this.bufferSpec)
      ? this.bufferSpec
      : fs.readFileSync(this.bufferSpec);
  }
  isBuffer(input) {
    return Buffer.isBuffer(input);
  }
  parsePattern(pattern) {
    return pattern.split(" ").map((byte) => {
      if (byte === "??") {
        return -1;
      } else {
        return parseInt(byte, 16);
      }
    });
  }
  boyerMooreSearch(buffer) {
    const pattern = this.pattern;
    const patternLength = pattern.length;
    const bufferLength = buffer.length;
    const lastOccurrence = {};
    pattern.forEach((byte, index) => {
      lastOccurrence[byte] = index;
    });
    const indexes = [];
    let i = 0;
    while (i <= bufferLength - patternLength) {
      let j = patternLength - 1;
      while (j >= 0 && (pattern[j] === buffer[i + j] || pattern[j] === -1)) {
        j--;
      }
      if (j < 0) {
        indexes.push(i);
        i += patternLength;
      } else {
        const lastOcc = lastOccurrence[buffer[i + j]];
        const shift = Math.max(1, j - (lastOcc !== undefined ? lastOcc : -1));
        i += shift;
      }
    }
    return indexes;
  }
  setPattern(pattern) {
    this.pattern = this.parsePattern(pattern);
  }
  scan() {
    const indexes = this.boyerMooreSearch(this.fileBuffer);
    return indexes;
  }
}
export { hexStrToBuf, ByteScanner };

//# debugId=C1314AA24272224164756e2164756e21
