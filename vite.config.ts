import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';

const excludedInputDirs = new Set([
  '.git',
  '.pnpm-store',
  'api',
  'assets',
  'dist',
  'images',
  'node_modules',
  'public',
  'scripts',
  'src',
  'quiz',
]);

function toInputName(route: string) {
  if (!route) return 'main';
  return route
    .split(/[\\/]+/)
    .filter(Boolean)
    .map((part, index) => {
      const clean = part.replace(/[^a-zA-Z0-9]+(.)?/g, (_, char = '') => char.toUpperCase());
      return index === 0 ? clean : clean.charAt(0).toUpperCase() + clean.slice(1);
    })
    .join('');
}

function collectHtmlInputs(dir = __dirname, route = ''): Record<string, string> {
  const entries = readdirSync(dir, { withFileTypes: true });
  const inputs: Record<string, string> = {};

  if (entries.some((entry) => entry.isFile() && entry.name === 'index.html')) {
    inputs[toInputName(route)] = resolve(dir, 'index.html');
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || excludedInputDirs.has(entry.name) || entry.name.startsWith('.')) continue;
    Object.assign(inputs, collectHtmlInputs(resolve(dir, entry.name), route ? `${route}/${entry.name}` : entry.name));
  }

  return inputs;
}

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: collectHtmlInputs(),
    },
  },
});
