import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const sourceRoot = new URL("../src/", import.meta.url);
const nextEntrypoints = new Set(["next/link", "next/image", "next/navigation"]);

function resolveSource(url) {
  const path = fileURLToPath(url);
  for (const candidate of [path, `${path}.ts`, `${path}.tsx`, `${path}/index.ts`, `${path}/index.tsx`]) {
    if (existsSync(candidate) && /\.tsx?$/.test(candidate)) return pathToFileURL(candidate).href;
  }
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (nextEntrypoints.has(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    let source;
    if (specifier.startsWith("@/")) {
      source = resolveSource(new URL(specifier.slice(2), sourceRoot));
    } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      source = resolveSource(new URL(specifier, context.parentURL));
    }
    return source
      ? { url: source, shortCircuit: true }
      : nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && /\.tsx?$/.test(url) && !url.includes("/node_modules/")) {
      const source = ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        fileName: fileURLToPath(url),
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      }).outputText;
      return { format: "module", source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

