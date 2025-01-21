---
title: Command 'tsc' is not found
date: 2021/10/01
tags:
  - NestJS
  - Node
  - tsc
  - typescript
thumbnail: assets/images/posts/command-tsc-is-not-found.png
---

Node.js 환경에서 NestJS 프레임워크를 사용하기 위해 TypeScript를 설정하다가 `Command 'tsc' is not found`라는 에러가 발생했다. 분명 여러 번 tsc를 설치했음에도 불구하고, 명령어를 찾을 수 없다고 나오며, 라이브러리 리스트에서는 설치가 완료된 것으로 보였다. Yarn과 npm을 모두 사용해 봤지만 결과는 같았다.

여러 레퍼런스를 찾은 끝에 해결책을 찾았고, 이를 기록으로 남긴다.

```shell
export PATH="$PATH:/Users/narb/.npm-global/lib/node_modules/typescript/bin"

export PATH="$PATH:/Users/narb/.npm-global/bin"
```

문제는 결국 명령어가 위치한 경로를 터미널이 찾지 못했던 것이었다. npm 설치 시 별도로 PATH 설정을 해야 하는지는 불분명하지만, 내 로컬 환경에서는 PATH가 설정되어 있지 않아서 이 문제가 발생했다.

위의 `PATH` 추가 구문을 터미널 설정 파일(예: .zshrc, .bash_profile)에 추가하면 된다. 먼저 두 번째 줄의 코드를 시도해 보고, 문제가 해결되지 않으면 첫 번째 줄도 추가해 보는 것이 좋다. 나는 zsh을 사용 중이어서 ~/.zshrc에 추가했지만, bash를 사용하고 있다면 ~/.bash_profile에 넣으면 된다.

파일을 수정한 후에는 터미널을 재시작하거나 `source ~/.zshrc` 명령어를 실행하면 된다. 이후 `tsc` 명령어가 정상적으로 동작하는 것을 확인할 수 있다.
