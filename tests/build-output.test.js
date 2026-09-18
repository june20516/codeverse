// 검색엔진이 실제로 받아가는 빌드 결과물(out/)을 검사한다. `yarn build` 뒤에 실행한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const matter = require('gray-matter');

const OUT_DIRECTORY = path.join(__dirname, '..', 'out');
const POSTS_DIRECTORY = path.join(__dirname, '..', 'manuscripts', 'posts');

const readSitemapEntries = () => {
  const xml = fs.readFileSync(path.join(OUT_DIRECTORY, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>(.*?)<\/loc>/)[1],
    lastmod: block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
  }));
};

const SITE_ORIGIN = new URL(readSitemapEntries()[0].loc).origin;

// 확장자 없는 주소(/posts/slug)는 out/posts/slug.html 파일로 서빙된다
const toHtmlFilePath = pathname => {
  const decodedPath = decodeURIComponent(pathname).replace(/\/$/, '');
  return path.join(OUT_DIRECTORY, decodedPath === '' ? 'index.html' : `${decodedPath}.html`);
};

const existsInOut = pathname => {
  const decodedPath = decodeURIComponent(pathname);
  const candidates = [
    path.join(OUT_DIRECTORY, decodedPath),
    toHtmlFilePath(pathname),
    path.join(OUT_DIRECTORY, decodedPath, 'index.html'),
  ];
  return candidates.some(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
};

const listHtmlFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return entry.name === '_next' ? [] : listHtmlFiles(entryPath);
    return entry.name.endsWith('.html') ? [entryPath] : [];
  });

// out/tags/git.html 은 브라우저에서 /tags/git 주소로 열린다
const toPageUrl = htmlFilePath => {
  const relativePath = path.relative(OUT_DIRECTORY, htmlFilePath).replace(/\.html$/, '');
  const pagePath = relativePath === 'index' ? '' : relativePath;
  return new URL(`/${pagePath.split(path.sep).map(encodeURIComponent).join('/')}`, SITE_ORIGIN);
};

const readPosts = () =>
  fs
    .readdirSync(POSTS_DIRECTORY)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const { data } = matter.read(path.join(POSTS_DIRECTORY, fileName));
      return {
        slug: fileName.replace(/\.md$/, ''),
        date: new Date(data.date).toISOString(),
        tags: (data.tags || []).map(tag => tag.toLowerCase()),
      };
    });

const newestDate = posts =>
  posts
    .map(post => post.date)
    .sort()
    .at(-1);

test('모든 내부 링크는 그 링크가 있는 페이지에서 눌러도 실제 있는 페이지로 이어진다', () => {
  const brokenLinks = listHtmlFiles(OUT_DIRECTORY).flatMap(htmlFilePath => {
    const pageUrl = toPageUrl(htmlFilePath);
    const html = fs.readFileSync(htmlFilePath, 'utf8');

    return [...html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)]
      .map(([, href]) => href.replace(/&amp;/g, '&'))
      .filter(href => !/^(mailto|tel|javascript):/.test(href))
      .filter(href => {
        const target = new URL(href, pageUrl);
        return target.origin === SITE_ORIGIN && !existsInOut(target.pathname);
      })
      .map(href => `${decodeURIComponent(pageUrl.pathname)} → ${href}`);
  });

  assert.deepEqual(brokenLinks, []);
});

test('sitemap의 모든 페이지는 자기 주소를 canonical로 가진다', () => {
  const mismatches = readSitemapEntries().flatMap(({ loc }) => {
    const html = fs.readFileSync(toHtmlFilePath(new URL(loc).pathname), 'utf8');
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const isSelfCanonical =
      canonical !== undefined && new URL(canonical).href === new URL(loc).href;
    return isSelfCanonical ? [] : [`${loc} (canonical: ${canonical})`];
  });

  assert.deepEqual(mismatches, []);
});

test('sitemap의 모든 페이지는 제목을 가진다', () => {
  const untitledPages = readSitemapEntries()
    .map(({ loc }) => loc)
    .filter(loc => {
      const html = fs.readFileSync(toHtmlFilePath(new URL(loc).pathname), 'utf8');
      return !/<title>[^<]+<\/title>/.test(html);
    });

  assert.deepEqual(untitledPages, []);
});

test('sitemap의 lastmod는 빌드 시각이 아니라 글 발행일에서 나온다', () => {
  const posts = readPosts();

  const expectedLastmod = pathname => {
    const [section, name] = decodeURIComponent(pathname).split('/').filter(Boolean);
    if (section === 'posts' && name) return posts.find(post => post.slug === name)?.date;
    if ((section === 'posts' || section === 'tags') && !name) return newestDate(posts);
    if (section === 'tags') return newestDate(posts.filter(post => post.tags.includes(name)));
    return undefined;
  };

  const mismatches = readSitemapEntries().flatMap(({ loc, lastmod }) => {
    const expected = expectedLastmod(new URL(loc).pathname);
    return lastmod === expected ? [] : [`${loc} (expected: ${expected}, actual: ${lastmod})`];
  });

  assert.deepEqual(mismatches, []);
});
