import fs from "fs";

type Byte = number;
type BytePattern = Byte[];
type ByteIndex = number;
type FilePath = string;
type PatternString = string;
type BufferSpec = FilePath | Buffer;

interface LastOccurrenceMap {
  [byte: number]: number;
}

interface ByteScannerOptions {
  bufferSpec: FilePath;
}

interface ByteScannerResult {
  indexes: ByteIndex[];
  pattern: BytePattern;
}

interface Scanner {
  setPattern(pattern: PatternString): void;
  scan(): ByteScannerResult;
}

class ByteScanner implements Scanner {
  private pattern: BytePattern = [];
  private fileBuffer: Buffer;

  constructor(private bufferSpec: BufferSpec) {
    this.fileBuffer = this.isBuffer(this.bufferSpec)
      ? this.bufferSpec
      : fs.readFileSync(this.bufferSpec);
  }

  private isBuffer(input: any): input is Buffer {
    return Buffer.isBuffer(input);
  }

  private parsePattern(pattern: PatternString): BytePattern {
    return pattern.split(" ").map((byte) => {
      if (byte === "??") {
        return -1;
      } else {
        return parseInt(byte, 16);
      }
    });
  }

  private boyerMooreSearch(buffer: Buffer): ByteIndex[] {
    const pattern = this.pattern;
    const patternLength = pattern.length;
    const bufferLength = buffer.length;
    const lastOccurrence: LastOccurrenceMap = {};

    pattern.forEach((byte, index) => {
      lastOccurrence[byte] = index;
    });

    const indexes: ByteIndex[] = [];
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

  public setPattern(pattern: PatternString): void {
    this.pattern = this.parsePattern(pattern);
  }

  public scan(): ByteScannerResult {
    const indexes = this.boyerMooreSearch(this.fileBuffer);
    return indexes;
  }
}

function hexStrToBuf(hexString: string): Buffer {
  return Buffer.from(hexString.replace(/\s+/g, ""), "hex");
}

export {
  hexStrToBuf,
  ByteScanner,
  ByteScannerOptions,
  BytePattern,
  ByteIndex,
  Byte,
  ByteScannerResult,
  Scanner,
  FilePath,
  PatternString,
};
