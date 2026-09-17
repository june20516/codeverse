---
title: "Claude Code 설정을 기기 간에 동기화하는 플러그인, claude-sync"
description: 어느 기기에서 열어도 같은 Claude로
date: 2026/09/17
tags:
  - Claude Code
  - plugin
  - claude-sync
  - MCP
  - dotfiles
categories:
  - dev
  - tool
thumbnail: assets/images/posts/thumbnails/claude-sync-introduce.png
---

# Claude Code 설정을 기기 간에 동기화하는 플러그인, claude-sync

Claude Code를 쓰다 보면 설정이 쌓인다. 직접 만든 에이전트와 스킬, 모든 프로젝트에 공통으로 적용할 `CLAUDE.md`, 설치해 둔 플러그인과 MCP 서버까지. 문제는 이게 전부 **기기 안에만** 있다는 것이다. 나는 Claude Code를 여러 기기에서 쓰는데, 한쪽에서 다듬은 설정을 다른 쪽에 손으로 다시 옮기는 일이 퍽 번거로웠다.

dotfiles처럼 Git 레포에 올려두면 될 것 같지만 그대로 올리기엔 걸리는 게 있다. MCP 서버 설정에는 API 키가 들어 있고, 두 기기에서 각자 고친 설정을 합치는 방법도 필요하다. 그래서 이걸 대신 해주는 Claude Code 플러그인, [claude-sync](https://github.com/june20516/claude-sync)를 만들었다.

## 무엇을 동기화하나

| 로컬 | 레포에 저장되는 형태 |
| --- | --- |
| `~/.claude/agents/` | 커스텀 에이전트 파일 그대로 |
| `~/.claude/skills/` | 스킬 파일 그대로 |
| `~/.claude/CLAUDE.md` | 그대로 |
| `~/.claude/settings.json` | `plugins.json` — 플러그인 목록, 마켓플레이스, 플러그인 설정의 키 이름 |
| `~/.claude.json`의 user 스코프 MCP 서버 | `mcp-servers.json` |

`settings.json`은 원본을 올리지 않고 필요한 필드만 뽑아서 올린다. MCP 서버도 `~/.claude.json` 최상위 `mcpServers`에 있는 user 스코프 서버만 다룬다. claude.ai 계정 커넥터, 플러그인이 제공하는 서버, 프로젝트·로컬 스코프 서버는 그 객체에 들어 있지 않으니 자연히 빠진다.

스킬은 세 개다.

| 명령어 | 하는 일 |
| --- | --- |
| `/sync-backup` | 로컬 설정을 레포에 백업하고 push |
| `/sync-restore` | 레포에서 설정을 복원 |
| `/sync-status` | 로컬과 레포의 차이만 확인 (dry-run) |

## 설치와 사용

```bash
claude plugin marketplace add claude-sync --source github --repo june20516/claude-sync
claude plugin install claude-sync@claude-sync
```

설정이 있는 기기에서 `/sync-backup`을 실행한다. 처음 실행하면 백업용 Git 레포 URL을 묻고, 그다음부터는 그 레포를 쓴다. 새 기기에서는 같은 플러그인을 설치하고 `/sync-restore`를 실행하면 된다.

Claude Code를 아직 설치하지 않은 기기라면 백업 레포를 클론해서 `bootstrap.sh`로 복원할 수도 있다.

```bash
git clone <백업-레포-url> /tmp/claude-sync-repo
bash /tmp/claude-sync-repo/bootstrap.sh
```

`CLAUDE.md`나 에이전트 파일에는 사내 URL 같은 정보가 섞이기 쉽다. **백업 레포는 private으로 만드는 것을 권한다.** 특정 파일을 올리고 싶지 않다면 `~/.claude/.syncignore`에 glob 패턴으로 적어두면 된다.

## 비밀값은 가리고, 이름은 남긴다

MCP 서버 설정에는 인증 토큰 같은 값이 들어간다. 예를 들어 `~/.claude.json`에 이런 서버 두 개가 있다고 하자.

```json
{
  "mcpServers": {
    "docs-search": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer sk-live-1234" }
    },
    "local-db": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "some-db-mcp"],
      "env": { "DB_PASSWORD": "hunter2" }
    }
  }
}
```

백업하면 레포의 `mcp-servers.json`에는 이렇게 올라간다.

```json
{
  "scope": "user",
  "servers": {
    "docs-search": {
      "headers": { "Authorization": "<REDACTED>" },
      "type": "http",
      "url": "https://mcp.example.com/mcp"
    },
    "local-db": {
      "args": ["-y", "some-db-mcp"],
      "command": "npx",
      "env": { "DB_PASSWORD": "<REDACTED>" },
      "type": "stdio"
    }
  },
  "version": 2
}
```

`headers`와 `env`는 **값만** `<REDACTED>`로 바꾸고 키 이름은 남긴다. 키까지 지워버리면 새 기기에서 복원할 때 이 서버에 무엇이 필요한지 알 길이 없다. 이름이 남아 있으니 `/sync-restore`가 "`docs-search`에는 `Authorization` 값이 필요하다"고 물어볼 수 있고, 입력을 건너뛴 서버는 등록하지 않는다. 플러그인 설정 값도 같은 방식으로 가린다.

다만 가리는 곳은 `headers`와 `env`뿐이다. `args`나 URL 쿼리스트링에 키를 넣어둔 서버라면 그 값은 그대로 올라간다.

## 판정은 스크립트가, 선택은 대화로

동기화에서 까다로운 건 **누가 무엇을 바꿨는지** 판단하는 일이다. claude-sync는 파일 수정 시각을 쓰지 않고 내용 해시로 3-way 비교를 한다. 기기마다 마지막으로 레포와 맞춰둔 상태(base)를 기억해 두고, 지금의 로컬·레포와 견주는 방식이다.

- 한쪽만 바뀌었으면 바뀐 쪽을 따른다.
- 양쪽이 모두 바뀌었으면 `git merge-file`로 합쳐 보고, 같은 줄이 부딪칠 때만 충돌로 남긴다. 이때 로컬 파일은 건드리지 않는다.
- MCP 서버와 플러그인은 파일 통째가 아니라 서버 이름, 항목 단위로 따로 판정한다. 한 기기의 백업이 다른 기기에만 있는 서버를 지우지 않게 하기 위해서다.

이 판정은 전부 스크립트가 맡고, 스킬 문서(`SKILL.md`)는 결과를 사용자에게 전하고 묻는 역할만 한다. 세 스킬이 각자 판단을 들고 있으면 서로 어긋나기 쉽다. 실제로 예전 버전에서는 `/sync-status`와 `/sync-backup`이 MCP 목록을 서로 다른 정규식으로 읽어서, 백업 직후에도 status가 차이가 있다고 보고하는 문제가 있었다.

스크립트가 정할 수 없는 것만 사람에게 묻는다. 다른 기기에서 서버를 지웠다면 이 기기에서도 지울지(제거 / 유지 / 나중에), 같은 설정을 양쪽에서 다르게 바꿨다면 어느 쪽을 쓸지(레포 값 채택 / 로컬 유지 / 나중에). `/sync-restore`는 이런 항목을 하나씩 대화로 묻는다. 그리고 복원은 받아오기만 한다. 로컬에서 바뀐 것을 레포에 알아서 올리지 않는다.

## 만들면서 겪은 일

### 판정표를 다 덮은 테스트가 통과했는데, 서버가 사라졌다

MCP 서버를 이름 단위로 병합하도록 다시 설계하던 중이었다. 처음 설계에는 **"백업이 성공하면 base를 레포 파일 전체로 갱신한다"** 는 규칙이 있었다. 얼핏 자연스럽지만 여기에 함정이 있었다.

1. 새 기기에서 백업을 한다. 레포에는 다른 기기가 올린 서버 `X`가 있고, 이 기기에는 없다. 이번 백업은 `X`를 레포에 그대로 둔다. 여기까지는 맞다.
2. 백업이 성공했으니 base를 레포 파일 전체로 갱신한다. 이 기기가 받아온 적도 없는 `X`가 base에 들어간다.
3. 복원 없이 한 번 더 백업한다. 이번엔 base에 `X`가 있고 로컬에는 없으니 **"이 기기가 `X`를 지웠다"** 로 읽힌다. `X`가 레포에서 삭제된다.

새 기기에서 복원 없이 백업을 두 번 하면 다른 기기의 서버가 경고 없이 사라지는 것이다. 이 결함은 판정표의 모든 경우를 덮은 테스트를 전부 통과했다. 테스트가 모두 백업을 **한 번만** 호출했기 때문이다. 한 번의 판정은 맞았고, 틀린 건 그 판정이 남긴 base가 다음 판정을 망가뜨리는 흐름이었다. 다행히 실제로 쓰기 전, 코드 리뷰에서 시뮬레이션으로 드러났다.

고친 규칙은 **"base는 로컬이 그 값에 동의할 때만 전진한다"** 이다. 그리고 같은 입력으로 백업을 여러 번 반복해도 결과가 흔들리지 않고 한곳에 머무는지 확인하는 테스트를 더했다.

### 테스트는 통과했는데, 실제 기기에서 조용히 실패했다

3.1.0을 실제 기기에서 돌려보다가 찾은 일이다. `/sync-backup`의 한 단계가 이런 bash 코드로 base를 갱신할 파일 목록을 모으고 있었다.

```bash
mapfile -t BASE_RELS < <(python3 -c "...")
```

`mapfile`은 bash 4 이상의 빌트인이라 **macOS 기본 bash(3.2)에도 zsh에도 없다.** 없는 셸에서는 이 줄이 `command not found`로 실패하고 배열은 빈 채로 남는다. 다음 조건문이 빈 배열을 "갱신할 것 없음"으로 읽으니 base를 갱신하는 스크립트는 아예 호출되지 않았다. 오류도 경고도 없고 종료 코드는 0, 백업은 성공한 것처럼 끝났다.

테스트가 없었던 것도 아니다. 다만 그 테스트는 `SKILL.md`에 적힌 bash 블록의 **텍스트**만 검사했다. 실제 셸에서 돌려보지는 않은 것이다. 3.1.1에서 `while read`로 바꾸고, 그 블록을 bash와 zsh에서 실제로 실행해 확인하는 테스트를 더했다.

```bash
BASE_RELS=()
while IFS= read -r rel; do
  [ -n "$rel" ] && BASE_RELS+=("$rel")
done < <(python3 -c "...")
```

그런데 이걸 고치면서 붙인 주석에 "`while read`는 세 셸에서 모두 돈다"고 적었다. POSIX `sh`에는 프로세스 치환(`< <(…)`)이 없으니 이것도 거짓이다. 3.1.2에서 주석을 고치고, 주석이 주장하는 셸과 테스트가 실제로 돌리는 셸이 같은지까지 확인하도록 했다. 두 번 모두 원인은 같았다. **주장이 측정과 묶여 있지 않았다.**

## 마무리

설정 동기화는 파일 몇 개 복사하는 일처럼 보였는데, 막상 만들어 보니 누가 무엇을 바꿨는지 따지는 상태 기계에 가까웠다. 여러 기기에서 Claude Code를 쓴다면 한번 써 봐도 좋겠다.

이 플러그인을 어떤 테스트로 어떻게 만들었는지는 [다음 글](/posts/claude-sync-how-i-tested)에 정리했다. 설치 명령과 저장소 링크는 [Lab의 Claude Tools](/lab/claude-tools)에도 모아뒀다.
