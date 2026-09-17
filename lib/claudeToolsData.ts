export interface ClaudeTool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  version: string;
  installCommands: string[];
  repoUrl: string;
  relatedPostSlugs: string[];
}

export interface RelatedPost {
  slug: string;
  title: string;
}

export interface ClaudeToolWithPosts extends ClaudeTool {
  relatedPosts: RelatedPost[];
}

export const claudeTools: ClaudeTool[] = [
  {
    id: 'claude-sync',
    name: 'claude-sync',
    tagline: 'Claude Code 설정을 Git 레포로 기기 간 동기화',
    description:
      'agents, skills, CLAUDE.md, 플러그인, MCP 서버 설정을 Git 레포에 백업하고 다른 기기에서 복원한다. 무엇이 바뀌었는지는 스크립트가 판정하고, 어떻게 합칠지는 대화로 정한다.',
    highlights: [
      '/sync-backup · /sync-restore · /sync-status 세 가지 스킬',
      '비밀값은 값만 가리고 키 이름은 남기는 마스킹',
      '다른 기기의 변경을 항목마다 제거 · 유지 · 나중에 중에서 선택',
      'Claude Code 없이도 복원할 수 있는 bootstrap.sh',
    ],
    version: '3.1.2',
    installCommands: [
      'claude plugin marketplace add claude-sync --source github --repo june20516/claude-sync',
      'claude plugin install claude-sync@claude-sync',
    ],
    repoUrl: 'https://github.com/june20516/claude-sync',
    relatedPostSlugs: ['claude-sync-introduce', 'claude-sync-how-i-tested'],
  },
  {
    id: 'suberpower',
    name: 'suberpower',
    tagline: 'superpowers 워크플로우 스킬의 한국어 포크',
    description:
      'obra/superpowers의 TDD · 디버깅 · 계획 · 코드 리뷰 · worktree 스킬을 한국어로 옮기고, worktree 방식을 내 작업 방식에 맞게 고쳤다. 원본과 일부러 다르게 둔 지점은 문서로 남기고 스크립트로 검사한다.',
    highlights: [
      '워크플로우 스킬 14종 한국어 번역',
      '원문의 강조 계층을 그대로 옮기는 번역 용어집',
      '원본과의 의도적 차이를 기계로 검증하는 divergence 관리',
    ],
    version: '1.3.0',
    installCommands: [
      'claude plugin marketplace add june20516/suberpower',
      'claude plugin install suberpower@suberpower',
    ],
    repoUrl: 'https://github.com/june20516/suberpower',
    relatedPostSlugs: ['suberpower-korean-fork'],
  },
];
