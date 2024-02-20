# ByteScanner

ByteScanner is a module for scanning binary files(or buffers) for specific byte patterns using the Boyer-Moore algorithm.

## Installation

To install ByteScanner, use npm:

```bash
npm install byte-scanner
```

or bun

```bash
bun add byte-scanner
```

## Usage

```typescript
import { ByteScanner } from "byte-scanner";

// Create a new instance of ByteScanner
const filePath = "./path/to/your/binary/file";
/* or you can use a buffer
const Buffer = [72, 101, 108, 108, 111];

or if you want to use a hex string instead
import { hexStrToBuf } from "byte-scanner"

const Buffer = hexStrToBuf("fa e0")
*/
const scanner = new ByteScanner(filePath);

// Set pattern
scanner.setPattern("fa??"); // you can use "??" as a wildcard, this matches any byte

// Scan for occurrences
const occurrences = scanner.scan();

// Log the occurrences found
console.log(
  "Occurrences found at indexes:",
  occurrences.map((offset) => {
    return `0x${offset.toString(16).toUpperCase()}`; // convert the address to a string
  }),
);
```

## API

### `ByteScanner(bufferSpec: FilePath || Buffer)`

Creates a new instance of ByteScanner with the specified options(a filepath or buffer).

- `options`: the file path option (`filePath`) is where the scanning will be performed.

### `setPattern(pattern: string): void`

Sets the pattern to be searched for in the file.

- `pattern`: A string representing the byte pattern to search for. Use `'??'` to match any byte.

### `scan(): ByteScannerResult`

Scans the file for occurrences of the set pattern and returns the result.

### `hexStrToBuf(hex: string): Buffer`

Returns the buffer of the input hex

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
