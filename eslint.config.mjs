import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
  {
    // 빌드 결과물과 정적 자원은 검사하지 않는다
    ignores: ['node_modules/', '.next/', 'out/', 'public/', 'next-env.d.ts'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      // 켜 둔 규칙은 타입 정보가 필요 없으므로 tsconfig(project)를 연결하지 않는다.
      // 연결하면 tsconfig에 포함되지 않은 commands/, tests/의 JS 파일을 파싱하지 못한다.
      parser: typescriptParser,
    },
    settings: {
      // tsconfig paths의 '@/' 별칭을 외부 패키지가 아닌 내부 모듈로 분류한다
      'import/internal-regex': '^@/',
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error', // 사용하지 않는 변수 금지
      'unused-imports/no-unused-imports': 'error', // 사용되지 않는 import 제거
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
