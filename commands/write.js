const fs = require('fs');
const path = require('path');

const DRAFTS_DIRECTORY = path.join(__dirname, '..', 'manuscripts', 'drafts');
const DEFAULT_TITLE = 'post template';
const DEFAULT_DESCRIPTION = "post's description";

const ARGUMENT_PATTERN = /^--(\w+)=(.*)$/s;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?: (\d{2})(?::(\d{2})(?::(\d{2}))?)?)?$/;
const DATE_FORMAT_MESSAGE = 'date format must be `yyyy/MM/DD( HH(:mm(:ss)))`';
// 따옴표 없이 쓰면 YAML이 다르게 해석하는 문자들
const YAML_SPECIAL_CHARACTERS = /^[-?\s]|[:#[\]{},&*!|>'"%@`]|\s$/;

const parseArgs = args =>
  Object.fromEntries(
    args.map(arg => {
      const match = arg.match(ARGUMENT_PATTERN);
      if (!match) throw new Error(`argument must be \`--key=value\`: ${arg}`);
      return [match[1], match[2]];
    }),
  );

const padTwoDigits = value => String(value).padStart(2, '0');

const isExistingDate = (year, month, day) => {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const formatDate = (dateString, now = new Date()) => {
  if (!dateString) {
    return `${now.getFullYear()}/${padTwoDigits(now.getMonth() + 1)}/${padTwoDigits(now.getDate())}`;
  }

  const match = dateString.match(DATE_PATTERN);
  if (!match) throw new Error(DATE_FORMAT_MESSAGE);

  const [, year, month, day, ...timeParts] = match;
  if (!isExistingDate(Number(year), Number(month), Number(day))) {
    throw new Error(DATE_FORMAT_MESSAGE);
  }

  const givenTimeParts = timeParts.filter(part => part !== undefined);
  const [hour = 0, minute = 0, second = 0] = givenTimeParts.map(Number);
  if (hour > 23 || minute > 59 || second > 59) throw new Error(DATE_FORMAT_MESSAGE);

  const datePart = `${year}/${padTwoDigits(month)}/${padTwoDigits(day)}`;
  return givenTimeParts.length > 0 ? `${datePart} ${givenTimeParts.join(':')}` : datePart;
};

const toYamlScalar = value => (YAML_SPECIAL_CHARACTERS.test(value) ? JSON.stringify(value) : value);

const splitCommaSeparated = value =>
  (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

const toYamlList = (key, items) =>
  items.length === 0
    ? `${key}: []`
    : [`${key}:`, ...items.map(item => `  - ${toYamlScalar(item)}`)].join('\n');

// `--title=`처럼 값이 빈 인자도 생략한 것으로 보고 기본값을 쓴다
const buildPostTemplate = args => {
  const title = args.title || DEFAULT_TITLE;
  const description = args.description || DEFAULT_DESCRIPTION;
  const thumbnail = args.thumbnail || `assets/images/posts/thumbnails/${args.slug}.png`;

  return [
    '---',
    `title: ${toYamlScalar(title)}`,
    `description: ${toYamlScalar(description)}`,
    `date: ${formatDate(args.date)}`,
    toYamlList('tags', splitCommaSeparated(args.tags)),
    toYamlList('categories', splitCommaSeparated(args.categories)),
    `thumbnail: ${toYamlScalar(thumbnail)}`,
    '---',
    '',
    `# ${title}`,
    '',
  ].join('\n');
};

const createDraft = (args, directory = DRAFTS_DIRECTORY) => {
  if (!args.slug || !SLUG_PATTERN.test(args.slug)) {
    throw new Error('`--slug` required. use lowercase letters, numbers and hyphens.');
  }

  const filePath = path.join(directory, `${args.slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`${filePath} already exists.`);

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filePath, buildPostTemplate(args), { flag: 'wx' });
  return filePath;
};

if (require.main === module) {
  try {
    const filePath = createDraft(parseArgs(process.argv.slice(2)));
    console.log('✨✨✨post created✨✨✨ : ', filePath);
  } catch (error) {
    console.error('Failed : ', error.message);
    process.exitCode = 1;
  }
}

module.exports = { DRAFTS_DIRECTORY, buildPostTemplate, createDraft, formatDate, parseArgs };
