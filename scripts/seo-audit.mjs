import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const root = dist.pathname;
const failures = [];

async function walk(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry);
    const info = await stat(path);

    if (info.isDirectory()) {
      files.push(...await walk(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = relative(root, file);

  const is404 =
    name.endsWith('404.html') ||
    name.includes('/404/');

  const checks = [
    [
      'title',
      /<title>[^<]{2,}[^<]*<\/title>/i,
      true
    ],
    [
      'meta description',
      /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}["']/i,
      true
    ],
    [
      'canonical',
      /<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\//i,
      !is404
    ],
    [
      'H1',
      /<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i,
      true
    ]
  ];

  for (const [label, pattern, required] of checks) {
    if (required && !pattern.test(html)) {
      failures.push(`${name}: missing ${label}`);
    }
  }

  if (/<meta[^>]+name=["']keywords["']/i.test(html)) {
    failures.push(`${name}: legacy meta keywords tag found`);
  }
}

for (const required of ['robots.txt', 'sitemap-index.xml']) {
  if (!files.some((file) => file.endsWith(required))) {
    failures.push(`dist: missing ${required}`);
  }
}

if (failures.length) {
  console.error(
    'SEO audit failed:\n' +
    failures.map((failure) => `- ${failure}`).join('\n')
  );

  process.exit(1);
}

console.log(
  `SEO audit passed for ${htmlFiles.length} HTML pages.`
);