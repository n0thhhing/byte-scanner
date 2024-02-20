import fs from "fs";

type Byte = number;
type BytePattern = Byte[];
type ByteIndex = number;
type FilePath = string;
type PatternString = string;

interface LastOccurrenceMap {
  [byte: Byte]: Byte;
}

interface ByteScannerOptions {
  filePath: FilePath;
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
  private pattern: BytePattern;
  private filePath: FilePath;
  private fileBuffer: Buffer;

  constructor(filePath: FilePath) {
    this.filePath = filePath;
    this.fileBuffer = fs.readFileSync(this.filePath);
    this.pattern = [];
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

    for (let i = 0; i < patternLength; i++) {
      lastOccurrence[pattern[i]] = i;
    }

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

export {
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
