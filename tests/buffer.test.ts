import { hexStrToBuf } from "../build/ByteScanner.js";

console.log(
  hexStrToBuf(
    "7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 03 00 b7 00 01 00 00 00",
  ).toString("hex"),
);
