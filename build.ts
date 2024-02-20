const result = await Bun.build({
  entrypoints: ["src/ByteScanner.ts"],
  outdir: "build",
  naming: "[name].[ext]",
  sourcemap: "external",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    console.error(message);
  }
}
