const fs = require('fs');

// Argument parser
const parseArgs = args => {
  const parsedArgs = {};
  args.forEach(arg => {
    const key = arg.match(/--(\w+)=/)[1];
    const value = arg.match(/--\w+=(.+)/)[1];
    parsedArgs[key] = value;
  });
  return parsedArgs;
};
const args = parseArgs(process.argv.slice(2));

if (!args.slug) throw new Error('`--slug` required.');

let frontMatter = '';
frontMatter = frontMatter.concat('---\n');
frontMatter = frontMatter.concat(`title: ${args.title ?? 'post template'}\n`);
frontMatter = frontMatter.concat(`description: ${args.description ?? "post's description"}\n`);
frontMatter = frontMatter.concat(`date: ${getFormattedDate(args.date)}\n`);
frontMatter = frontMatter.concat(`tags: ${args.tags ?? 'some tags separated by space'}\n`);
frontMatter = frontMatter.concat(
  `categories: ${args.categories ?? 'some categories separated by space'}\n`,
);
frontMatter = frontMatter.concat(
  `thumbnail: ${args.thumbnail ?? 'assets/images/posts/{img file name same as post slog}'}\n`,
);

frontMatter = frontMatter.concat('---\n\n# Head1\n\n## Head2\n\n### Head3');

const filePath = `./manuscripts/posts/draft/${args.slug}.md`;

fs.writeFile(filePath, frontMatter, error => {
  if (error) console.error('Failed : ', error);
  else console.log('✨✨✨post created✨✨✨ : ', filePath);
});

function getFormattedDate(dateString) {
  let time = new Date();
  if (dateString) {
    validateDateFormat(dateString);
    const dismentledDate = dateString
      .split(' ')
      .map(s => s.split('/').map(t => t.split('-').map(r => r.split(':'))))
      .flat(5);
    time = new Date(
      `${dismentledDate.slice(0, 2).join('/')} ${dismentledDate[3] ?? '00'}:${
        dismentledDate[4] ?? '00'
      }:${dismentledDate[5] ?? '00'}`,
    );
  }

  let expression = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`;
  if (time.getHours())
    expression = expression.concat(` ${time.getHours().toString().padStart(2, '0')}`);
  if (time.getMinutes())
    expression = expression.concat(`:${time.getMinutes().toString().padStart(2, '0')}`);
  if (time.getSeconds())
    expression = expression.concat(`:${time.getSeconds().toString().padStart(2, '0')}`);
  return expression;
}

function validateDateFormat(dateString) {
  const regExpFull = new RegExp(
    /\d{4}[-\/](0[1-9]|1[012])[-\/](0[1-9]|[12][0-9]|3[01])\s(0[1-9]|1[0-9]|2[0-4]):(0[1-9]|[1-5][0-9]):(0[1-9]|[1-5][0-9])/,
  );
  const regExpHasMinute = new RegExp(
    /\d{4}[-\/](0[1-9]|1[012])[-\/](0[1-9]|[12][0-9]|3[01])\s(0[1-9]|1[0-9]|2[0-4]):(0[1-9]|[1-5][0-9])/,
  );
  const regExpHasHour = new RegExp(
    /\d{4}[-\/](0[1-9]|1[012])[-\/](0[1-9]|[12][0-9]|3[01])\s(0[1-9]|1[0-9]|2[0-4])/,
  );
  const regExpHasDate = new RegExp(/\d{4}[-\/](0[1-9]|1[012])[-\/](0[1-9]|[12][0-9]|3[01])/);
  if (
    !regExpFull.test(dateString) &&
    !regExpHasMinute.test(dateString) &&
    !regExpHasHour.test(dateString) &&
    !regExpHasDate.test(dateString)
  )
    throw new Error('date format must be `yyyy/MM/DD( HH(:mm(:ss)))`');
}
