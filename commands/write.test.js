const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const {
  DRAFTS_DIRECTORY,
  buildPostTemplate,
  createDraft,
  formatDate,
  parseArgs,
} = require('./write');

const withTempDirectory = callback => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'write-test-'));
  try {
    callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
};

test('parseArgs: --key=value 인자를 객체로 바꾼다', () => {
  assert.deepEqual(parseArgs(['--slug=my-post', '--title=제목: 부제']), {
    slug: 'my-post',
    title: '제목: 부제',
  });
});

test('parseArgs: 형식이 틀린 인자는 무엇이 틀렸는지 알려준다', () => {
  assert.throws(() => parseArgs(['--slug']), /--key=value/);
});

test('formatDate: 날짜를 생략하면 오늘 날짜만 0으로 채워 쓴다', () => {
  const now = new Date(2026, 8, 7, 14, 5, 9);
  assert.equal(formatDate(undefined, now), '2026/09/07');
});

test('formatDate: 일(day)을 잃지 않는다', () => {
  assert.equal(formatDate('2026/09/17'), '2026/09/17');
});

test('formatDate: - 구분과 한 자리 월·일을 정규화한다', () => {
  assert.equal(formatDate('2026-9-7'), '2026/09/07');
});

test('formatDate: 받은 시각은 그대로 붙인다', () => {
  assert.equal(formatDate('2026/09/17 14'), '2026/09/17 14');
  assert.equal(formatDate('2026/09/17 14:05'), '2026/09/17 14:05');
  assert.equal(formatDate('2026/09/17 14:05:09'), '2026/09/17 14:05:09');
});

test('formatDate: 형식이 틀리거나 존재하지 않는 날짜·시각이면 에러', () => {
  assert.throws(() => formatDate('2026/9'), /date format/);
  assert.throws(() => formatDate('2026/13/01'), /date format/);
  assert.throws(() => formatDate('2026/02/30'), /date format/);
  assert.throws(() => formatDate('2026/09/17 24'), /date format/);
  assert.throws(() => formatDate('2026/09/17 14:60'), /date format/);
});

test('buildPostTemplate: 기존 글과 같은 frontmatter와 H1 본문을 만든다', () => {
  const template = buildPostTemplate({
    slug: 'git-publish-alias',
    title: 'git publish',
    description: '첫 push를 한 단어로',
    date: '2026/09/17',
    tags: 'git, alias',
    categories: 'dev,enhancement',
  });

  assert.equal(
    template,
    [
      '---',
      'title: git publish',
      'description: 첫 push를 한 단어로',
      'date: 2026/09/17',
      'tags:',
      '  - git',
      '  - alias',
      'categories:',
      '  - dev',
      '  - enhancement',
      'thumbnail: assets/images/posts/thumbnails/git-publish-alias.png',
      '---',
      '',
      '# git publish',
      '',
    ].join('\n'),
  );
});

test('buildPostTemplate: 공백이 든 태그를 하나로 유지한다', () => {
  const template = buildPostTemplate({ slug: 'a', date: '2026/09/17', tags: 'React Native, VS Code' });
  assert.match(template, /\ntags:\n {2}- React Native\n {2}- VS Code\n/);
});

test('buildPostTemplate: 태그와 카테고리를 생략하면 빈 리스트로 쓴다', () => {
  const template = buildPostTemplate({ slug: 'a', date: '2026/09/17' });
  assert.match(template, /\ntags: \[\]\ncategories: \[\]\n/);
});

test('buildPostTemplate: YAML에서 의미가 있는 문자가 든 값은 따옴표로 감싼다', () => {
  const template = buildPostTemplate({
    slug: 'a',
    title: 'fzf로 히스토리 다시 쓰기: ag',
    date: '2026/09/17',
  });
  assert.match(template, /\ntitle: "fzf로 히스토리 다시 쓰기: ag"\n/);
  assert.match(template, /\n# fzf로 히스토리 다시 쓰기: ag\n/);
});

test('buildPostTemplate: 값이 빈 인자는 생략한 것과 같게 기본값을 쓴다', () => {
  const template = buildPostTemplate({ slug: 'a', title: '', description: '', date: '2026/09/17' });
  assert.match(template, /\ntitle: post template\n/);
  assert.match(template, /\ndescription: "post's description"\n/);
  assert.match(template, /\n# post template\n/);
});

test('buildPostTemplate: --thumbnail을 넘기면 기본 경로 대신 쓴다', () => {
  const template = buildPostTemplate({ slug: 'a', date: '2026/09/17', thumbnail: 'assets/x.png' });
  assert.match(template, /\nthumbnail: assets\/x\.png\n/);
});

test('DRAFTS_DIRECTORY: 사이트가 읽는 manuscripts/drafts를 가리킨다', () => {
  assert.equal(DRAFTS_DIRECTORY, path.join(__dirname, '..', 'manuscripts', 'drafts'));
});

test('createDraft: 디렉토리에 <slug>.md를 만들고 경로를 돌려준다', () => {
  withTempDirectory(directory => {
    const filePath = createDraft({ slug: 'my-post', date: '2026/09/17' }, directory);

    assert.equal(filePath, path.join(directory, 'my-post.md'));
    assert.match(fs.readFileSync(filePath, 'utf8'), /^---\ntitle: post template\n/);
  });
});

test('createDraft: 같은 slug 파일이 있으면 덮어쓰지 않고 에러', () => {
  withTempDirectory(directory => {
    const filePath = path.join(directory, 'my-post.md');
    fs.writeFileSync(filePath, 'original');

    assert.throws(() => createDraft({ slug: 'my-post' }, directory), /already exists/);
    assert.equal(fs.readFileSync(filePath, 'utf8'), 'original');
  });
});

test('createDraft: slug가 없거나 경로를 벗어나는 형태면 에러', () => {
  withTempDirectory(directory => {
    assert.throws(() => createDraft({}, directory), /--slug/);
    assert.throws(() => createDraft({ slug: '../evil' }, directory), /--slug/);
  });
});
