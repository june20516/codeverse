---
title: macOS GUI 앱에서 nvm Node를 인식하지 못하는 문제 해결하기
description: VS Code 익스텐션이 Node를 찾지 못할 때
date: 2025/01/16
tags:
  - macOS
  - nvm
  - Node.js
  - PATH
  - VS Code
categories:
  - dev
  - troubleshooting
thumbnail: assets/images/posts/thumbnails/macos-gui-app-node-path-fix.png
---

# macOS GUI 앱에서 nvm Node를 인식하지 못하는 문제 해결하기

프로젝트에서 i18n Ally 익스텐션을 사용하고 있었는데, 분명히 정상 작동하던 것이 어느 날 갑자기 고장났다. 로그를 확인해보니 이런 에러가 나오고 있었다

```sh
🐛 Failed to load Error: Command failed: node "/Users/bran/.windsurf/extensions/lokalise.i18n-ally-2.13.1-universal/node_modules/ts-node/dist/bin.js" ...
/bin/sh: node: command not found
```

터미널에서 `node --version`을 실행하면 정상적으로 `v22.18.0`이 출력되는데, VS Code나 Windsurf 같은 GUI 앱의 익스텐션에서는 Node를 찾을 수 없다는 것이다.

## 문제의 원인

### nvm의 동작 방식

nvm은 **동적으로** PATH를 조작한다. 셸이 시작될 때 `.zshrc`나 `.bash_profile`에 있는 `nvm.sh` 스크립트가 실행되면서

1. 현재 활성화된 Node 버전의 경로를 찾는다
2. 해당 경로를 PATH **맨 앞에** 추가한다
3. `nvm use <버전>` 명령을 실행하면 이전 경로를 제거하고 새 경로를 추가한다

```bash
# 터미널에서 확인해보면 nvm Node 경로가 PATH 맨 앞에 있다
$ echo $PATH
/Users/bran/.nvm/versions/node/v22.18.0/bin:/opt/homebrew/bin:...
```

### GUI 앱은 셸 설정을 읽지 않는다

문제는 **macOS GUI 앱은 셸 설정 파일을 읽지 않는다**는 것이다.

- Finder나 Dock에서 앱을 실행하면 `launchd`라는 시스템 데몬이 앱을 실행한다
- `launchd`는 `/etc/paths`와 `/etc/paths.d/` 디렉토리의 설정만 읽는다
- 사용자의 `.zshrc`나 `.bash_profile`은 완전히 무시된다
- 따라서 nvm의 동적 PATH 설정도 적용되지 않는다

터미널을 열면 셸이 시작되면서 `.zshrc`를 읽어 nvm이 로드되지만, GUI 앱은 그런 과정 없이 바로 실행되기 때문에 nvm의 Node를 찾을 수 없는 것이다.

## 해결 방법

`/etc/paths.d/` 디렉토리에 nvm Node 경로를 추가하면 된다. 이렇게 하면 모든 GUI 앱이 시스템 시작 시 해당 경로를 PATH에 포함한다.
기왕 하는김에, nvm만큼 동적으로 대응할수는 없더라도 특정 버전에 의존하지는 않도록 default 버전을 바라보는 방식으로 추가했다.

### 1. 현재 nvm 버전 확인

```bash
nvm current
# v22.18.0
```

### 2. nvm default alias 설정

```bash
nvm alias default 22.18.0
```

nvm은 `default`라는 이름으로 심볼릭 링크를 생성한다

```
~/.nvm/versions/node/default -> ~/.nvm/versions/node/v22.18.0
```

### 3. /etc/paths.d/nvm 파일 생성

```bash
echo "$HOME/.nvm/versions/node/default/bin" | sudo tee /etc/paths.d/nvm
```

위 명령어로 `/etc/paths.d/nvm` 파일이 생성되고, 다음 내용이 저장된다

```
/Users/bran/.nvm/versions/node/default/bin
```

여기까지 했으면 macOS 재부팅 시 적용이 될 것이다. 재부팅 하지 않고 즉시 변경사항을 반영하고 싶다면 다음 4번과 5번 단계를 추가로 거친다.

### 4. Dock 재시작

```bash
killall Dock
```

### 5. GUI 앱 재시작

VS Code, Windsurf 등 Node를 사용하는 앱을 완전히 종료하고 다시 실행한다.

## 작동 원리

### GUI 앱에서

이제 GUI 앱들은 다음과 같은 PATH를 가지게 된다

```
/usr/local/bin
/System/Cryptexes/App/usr/bin
/usr/bin
/bin
/usr/sbin
/sbin
/Users/bran/.nvm/versions/node/default/bin  # 새로 추가됨
```

`/etc/paths.d/` 디렉토리의 모든 파일 내용이 자동으로 PATH에 추가되는 것이다.

### 터미널에서

터미널에서는 여전히 nvm이 정상 작동한다

1. 셸이 시작되면서 `.zshrc`의 `nvm.sh`가 실행된다
2. nvm이 동적으로 PATH 맨 앞에 Node 경로를 추가한다
3. `nvm use` 명령으로 프로젝트별로 다른 Node 버전을 자유롭게 사용할 수 있다

nvm의 PATH가 `/etc/paths.d/nvm`보다 앞에 있기 때문에 터미널에서는 nvm이 우선순위를 가진다.

### default 심볼릭 링크의 장점

`default` 심볼릭 링크를 사용했기 때문에

```bash
# GUI 앱의 기본 Node 버전을 변경하고 싶다면
nvm alias default 18.0.0

# Dock 재시작
killall Dock

# 이제 GUI 앱들은 v18.0.0을 사용한다
```

절대 경로 대신 `default` 심볼릭 링크를 사용하면 `/etc/paths.d/nvm` 파일을 수정할 필요 없이 nvm alias만 바꾸면 된다.

## 결과

이제 GUI로 실행하는 앱들도 node를 찾을 수 있다.
그리고 내 IDE의 i18n Ally 익스텐션도 정상적으로 작동한다.

```
✅ Loading finished
📂 Loading locales under /Users/bran/my-project/src/constants/locales
    📑 Loading (en) en.ts
    📑 Loading (ko) ko.ts
```

## 요약

- **문제**: macOS GUI 앱은 셸 설정 파일을 읽지 않아 nvm Node를 찾지 못함
- **원인**: GUI 앱은 `launchd`가 실행하며, `/etc/paths`와 `/etc/paths.d/`만 참조함
- **해결**: `/etc/paths.d/nvm`에 nvm default 경로를 추가
- **효과**:
  - GUI 앱에서 Node 사용 가능
  - 터미널에서는 여전히 nvm으로 프로젝트별 버전 관리 가능
  - `nvm alias default`로 GUI 앱의 기본 버전 변경 가능

이 방법은 VS Code 익스텐션뿐만 아니라 Electron 앱 등 Node를 필요로 하는 모든 macOS GUI 앱에 적용할 수 있다.
