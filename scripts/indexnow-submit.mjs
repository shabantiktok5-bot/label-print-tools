const KEY = '94993b13ded74ff4ad46b8ff1f1dc913';
const SITE = 'https://www.labelprinttools.com';

const changedFiles = process.env.CHANGED_FILES
  ? process.env.CHANGED_FILES.split('\n').filter(Boolean)
  : [];

function pagePath(file) {
  if (!file.startsWith('src/pages/') || !file.endsWith('.astro')) {
    return null;
  }

  let path = file
    .replace('src/pages/', '')
    .replace(/\.astro$/, '');

  if (path === '404') return null;
  if (path === 'index') return '/';

  path = path.replace(/\/index$/, '');

  return `/${path}/`;
}

let urls = changedFiles
  .map(pagePath)
  .filter(Boolean)
  .map((path) => new URL(path, SITE).toString());

const sharedCodeChanged = changedFiles.some(
  (file) =>
    file.startsWith('src/components/') ||
    file.startsWith('src/layouts/') ||
    file.startsWith('src/lib/') ||
    file.startsWith('src/styles/')
);

if (sharedCodeChanged || urls.length === 0) {
  const sitemapResponse = await fetch(`${SITE}/sitemap-0.xml`);

  if (!sitemapResponse.ok) {
    throw new Error(`Could not fetch sitemap: ${sitemapResponse.status}`);
  }

  const xml = await sitemapResponse.text();

  urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1]
  );
}

urls = [...new Set(urls)];

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify({
    host: 'www.labelprinttools.com',
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls
  })
});

console.log(`Submitting ${urls.length} URL(s) to IndexNow.`);
console.log(`IndexNow response: ${response.status}`);

if (!response.ok && response.status !== 202) {
  const body = await response.text();
  throw new Error(`IndexNow failed: ${response.status} ${body}`);
}

console.log('IndexNow notification completed.');
