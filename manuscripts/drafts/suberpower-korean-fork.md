---
title: "Claude Code 워크플로우 스킬을 한국어로 옮긴 포크, suberpower"
description: 번역이 지시의 힘을 빼지 않도록
date: 2026/08/14
tags:
  - Claude Code
  - suberpower
  - superpowers
  - skills
  - 번역
categories:
  - dev
  - tool
thumbnail: assets/images/posts/thumbnails/suberpower-korean-fork.png
---

# Claude Code 워크플로우 스킬을 한국어로 옮긴 포크, suberpower

Claude Code를 쓰면서 [superpowers](https://github.com/obra/superpowers)라는 플러그인을 알게 됐다. 브레인스토밍, 계획 작성, TDD, 디버깅, 코드 리뷰처럼 개발할 때 거치는 과정을 스킬로 묶어두고, Claude가 작업 성격에 맞는 스킬을 스스로 찾아 따르게 만드는 플러그인이다. [claude-sync를 만들 때](/posts/claude-sync-how-i-tested) 썼던 Spec → Plan → TDD 흐름도 이 스킬들로 굴렸다.

스킬은 결국 Claude에게 건네는 긴 지시문이다. 오래 쓰다 보면 내 작업 방식에 맞게 손보고 싶은 곳이 생기는데, 영어로 된 긴 지시문을 읽고 고치기엔 한국어가 편했다. 게다가 git worktree를 다루는 방식은 내 방식과 잘 맞지 않았다. 그래서 포크해서 한국어로 옮기고, 필요한 곳은 고쳐 쓰기로 했다.

## 이름은 suberpower

원본과 이름을 살짝 다르게 지었다. 두 플러그인을 동시에 켜면 세션이 시작될 때 스킬 안내가 두 번 주입되는데, 이름까지 같으면 어느 쪽이 로드됐는지 구분할 수가 없기 때문이다. 스킬을 부르는 이름도 `suberpower:brainstorming`처럼 원본과 갈린다.

## 번역에서 지킨 것

### 산문만 옮긴다

본문 설명은 한국어로 옮기되, 제목(`## Overview`), 기술 용어(skill, subagent, commit), 상태값(`DONE`, `BLOCKED`)은 영문 그대로 둔다. 영문 뒤에는 조사를 바로 붙인다. `dispatch하고`, `commit하세요` 같은 식이다.

### 강조의 세기를 지킨다

번역하면서 가장 신경 쓴 부분이다. 영어 지시문은 **대문자로 강도를 표현한다.** 한국어에는 대소문자가 없으니 그대로 옮기면 최상위 경고가 평범한 문장으로 내려앉고, 지시의 구속력이 실제로 약해진다.

처음에는 `CRITICAL:`을 `중요:`로 옮겼는데, subagent가 그 지시를 덜 지키는 게 느껴져 되돌렸다. 그 뒤로는 원문의 강조 등급을 서식으로 살린다.

| 원문의 강도 | 옮기는 방식 | 예 |
| --- | --- | --- |
| 최상위 | 영문 대문자 토큰 유지 | `IMPORTANT:`, `CRITICAL:` |
| 상위 | 영문 라벨 + 대시 | `STOP - 다음 경우 escalate하세요` |
| 중간 | 굵게 | `**반드시**`, `**절대**` |
| 하위 | 평문 | |

예를 들어 스킬 사용 규칙의 핵심 문장은 이렇게 옮겼다. 강조 태그는 그대로 두고, `ABSOLUTELY MUST`는 힘이 빠지지 않는 "반드시"로 옮겼다.

```markdown
<!-- 원문 -->
<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.
</EXTREMELY-IMPORTANT>

<!-- suberpower -->
<EXTREMELY-IMPORTANT>
지금 하고 있는 일에 어떤 skill이 적용될 가능성이 1%라도 있다고 생각된다면, 반드시 그 skill을 호출해야 합니다.
</EXTREMELY-IMPORTANT>
```

## 내 방식대로 고친 곳: worktree

원본의 worktree 스킬은 작업 공간을 프로젝트 안에 만들고, 브랜치 이름과 기준 브랜치도 알아서 정했다. 프로젝트 안에 worktree가 생기면 원래 저장소의 `git status`가 지저분해지고, 브랜치를 어디서 딸지는 내가 정하고 싶었다.

그래서 이 스킬은 통째로 다시 썼다. worktree는 프로젝트 밖의 전역 경로(`~/.claude/suberpowers/worktrees/`)에 만들고, 기준 브랜치와 이름은 만들기 전에 나에게 묻는다.

## 원본과 멀어지지 않기

포크를 유지하는 데서 가장 걱정되는 건 **원본의 변경을 가져올 때**다. 원본은 계속 업데이트되는데, 그 변경을 번역본 위에 덮다 보면 포크가 일부러 다르게 만든 부분이 조용히 사라지기 쉽다. worktree 스킬을 다시 원본 방식으로 덮어버리는 식이다.

그래서 "일부러 원본과 다르게 둔 곳"을 목록으로 만들어 두었다. 이름 변경, worktree 재작성, 번역 규칙, 강조 계층 같은 항목이 지금 일곱 개 있고, 항목마다 원본이 바뀌었을 때 어떻게 할지 정해두었다.

- **절대 덮어쓰지 않는다**: 이름 변경처럼 포크의 정체성인 것
- **사람이 읽고 골라서 반영한다**: worktree 스킬처럼 통째로 다시 쓴 것
- **가져오되 포크 규칙으로 바꿔서 반영한다**: 스킬 설명(description) 규칙처럼 형식만 맞추면 되는 것

그리고 이 목록이 지켜지는지 스크립트로 검사한다. 문자열이나 경로처럼 기계로 셀 수 있는 건 스크립트가 바로 판정한다. 번역의 톤처럼 읽어봐야 아는 건 스크립트가 확인할 질문을 내놓고, **사람이 확인했다고 표시하기 전에는 통과시키지 않는다.**

```bash
./scripts/check-divergence.sh          # 평소
./scripts/check-divergence.sh --sync   # 원본을 가져온 뒤, 사람의 확인까지 요구
```

기계로 못 재는 항목일수록 조용히 사라지기 쉬운데, 이렇게 해두면 적어도 확인을 건너뛸 수는 없다.

## 임시 조치에는 걷어낼 날을 같이 적는다

포크라서 할 수 있었던 것도 있다. 한동안 Claude Code에서 리뷰를 맡긴 subagent가 **응답 없이 끝나버리는** 버그를 만났다. Claude Code가 고쳐지길 기다리는 대신 suberpower에 우회책을 넣었다.

- 리뷰 subagent가 보고서를 파일에 조금씩 써두고, 마지막 메시지는 짧게 남긴다
- subagent가 결과 없이 끝나면 감지해서 다시 맡긴다
- 리뷰할 변경이 너무 크면 나눠서 맡긴다

다만 이런 우회책은 버그가 고쳐지면 걷어내야 한다. 그래서 우회책마다 원인이 된 Claude Code 이슈 번호를 적어두고, GitHub Actions가 매주 그 이슈 상태를 확인하게 했다. 이슈가 닫히면 "이제 이 우회책을 걷어낼지 검토하라"는 이슈가 저장소에 자동으로 올라온다. 임시로 넣은 코드가 영원히 남는 걸 막기 위해서다.

## 설치

```bash
claude plugin marketplace add june20516/suberpower
claude plugin install suberpower@suberpower
```

원본 superpowers와 동시에 켜면 세션 시작 안내가 중복되니, 둘 중 하나만 쓰는 게 좋다.

## 마무리

번역은 단어를 옮기는 일이라고 생각했는데, 지시문을 옮기는 건 **강도를 옮기는 일**에 가까웠다. 한국어로 읽히니 스킬을 내 작업 방식에 맞게 고치기도 훨씬 수월해졌다.

설치 명령과 저장소 링크는 [Lab의 Claude Tools](/lab/claude-tools)에도 모아뒀고, 코드는 [GitHub](https://github.com/june20516/suberpower)에서 볼 수 있다.
