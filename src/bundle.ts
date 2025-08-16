import type { InputOptions, OutputOptions } from "@rolldown/browser";
import { resolve } from "pathe";

export interface BundleResult {
  output: Record<string, string>;
  warnings?: string[];
}

export interface SourceFile {
  filename: string;
  code: string;
  isEntry?: boolean;
}

export type FileMap = Record<string, string>;

export async function bundle(
  files: FileMap,
  entries: string[],
  config: any = {},
): Promise<BundleResult> {
  console.log("Trying rolldown...");

  const rolldown = await import("@rolldown/browser");

  const warnings: string[] = [];

  const inputOptions: InputOptions = {
    input: entries,
    cwd: "/",
    onLog(level, log, logger) {
      if (level === "warn") {
        warnings.push(String(log));
      } else {
        logger(level, log);
      }
    },
    ...config,
    plugins: [
      // Virtual file system plugin
      {
        name: "virtual-fs",
        resolveId(source, importer) {
          if (source[0] === "/" || source[0] === ".") {
            return resolve(importer || "/", "..", source);
          }
        },
        load(id) {
          if (id[0] !== "/") return;
          const filename = id.slice(1);
          return files[filename];
        },
      },
      ...(Array.isArray(config?.plugins)
        ? config.plugins
        : [config?.plugins].filter(Boolean)),
    ],
  };

  const outputOptions: OutputOptions = {
    format: "esm",
    ...config?.output,
  };

  console.info("Rolldown input options", inputOptions);
  console.info("Rolldown output options", outputOptions);

  const bundle = await rolldown.rolldown(inputOptions);
  const result = await bundle.generate(outputOptions);

  const output = Object.fromEntries(
    result.output.map((chunk) =>
      chunk.type === "chunk"
        ? [chunk.fileName, chunk.code]
        : [
            chunk.fileName,
            typeof chunk.source === "string" ? chunk.source : "[BINARY]",
          ],
    ),
  );

  return {
    output,
    warnings,
  };
}
