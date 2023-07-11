---
title: Command 'tsc' is not found
date: 2021/10/01
tags: NestJS Node error tsc typescript
thumbnail: assets/images/posts/command-tsc-is-not-found.png
---

Node.js 환경에서 Nestjs 프레임 워크를 사용하기 위해 type script를 설정하다가 `Command 'tsc' is not found`라는 에러가 발생하는 경우가 있었습니다. 분명히 tsc는 몇번이고 설치를 하였는데 찾을 수가 없다고 하고, 라이브러리 리스트에서는 여전히 설치가 된 것으로 잡히고 있습니다. yarn과 npm 둘 다 시도해 봤지만 마찬가지였습니다.

여러 레퍼런스를 찾아보다가 해결책을 찾아 기록으로 남깁니다.

```shell
export PATH="$PATH:/Users/narb/.npm-global/lib/node_modules/typescript/bin"

export PATH="$PATH:/Users/narb/.npm-global/bin"
```

문제는 역시나 command가 위치한 path를 찾을 수 없었던 것이었습니다. npm 설치 초기에 path를 별도로 설정해야 하는지는 모르겠지만, 제 로컬 환경에서는 설정이 되어있지 않았던 것이 문제였습니다.

위의 PATH 추가 구문을 terminal에서 사용하는 설정파일인 rc파일이나 profile파일 안에 끼워넣으면 됩니다.
(아래 줄의 코드를 먼저 시도해 보고 안되면 윗줄도 추가하면 좋을 것 같습니다. )
저의 경우 zsh를 쓰기 때문에 `~/.zshrc` 에 넣었습니다. 아직 bash를 쓰고있다면 `~/.bash_profile`에 넣으면 됩니다.
이후 터미널을 재시작 하거나 `source ~/.zshrc` 하고 나서부터 `tsc` 명령어를 사용할 수 있습니다.
다
