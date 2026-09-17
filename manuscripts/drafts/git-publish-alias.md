---
title: "git alias 활용하기, 나만의 git publish 만들기"
description: 브랜치 이름을 두 번 치기 싫어서
date: 2026/09/17
tags:
  - git
  - alias
  - push
  - upstream
categories:
  - dev
  - enhancement
thumbnail: assets/images/posts/thumbnails/git-publish-alias.png
---

# git alias 활용하기, 나만의 git publish 만들기

git을 쓰다 보면 하루에도 몇 번씩 같은 명령을 친다. `git status`, `git switch`, 옵션을 잔뜩 붙인 `git log`까지. 매번 전부 치기엔 길고, 옵션은 자꾸 헷갈린다.

git에는 이런 명령에 짧은 이름을 붙여 쓰는 **alias** 기능이 있다. 이 글에서는 alias를 만드는 법과 활용하는 방법을 정리하고, 내가 새 브랜치를 올릴 때 쓰는 `git publish`를 소개한다.

## git alias란

alias는 git 명령에 붙이는 별명이다. 예를 들어 `status`에 `st`라는 이름을 붙이면

```bash
git config --global alias.st status
```

이제 `git st`가 `git status`와 똑같이 동작한다. 설정은 `~/.gitconfig`의 `[alias]` 섹션에 저장되니, 파일을 직접 열어 고쳐도 된다.

```ini
[alias]
    st = status
    sw = switch
    br = branch
    cm = commit
```

지금 등록된 alias는 이렇게 확인할 수 있다.

```bash
git config --global --get-regexp '^alias\.'
```

한 가지 알아둘 점은, **git에 이미 있는 명령과 같은 이름의 alias는 무시된다**는 것이다. `alias.status = ...`처럼 기존 명령을 덮어쓰는 건 안 된다.

## 활용하는 방법

### 1. 자주 쓰는 명령 줄이기

가장 흔한 쓰임새다. alias 뒤에 붙인 인자는 그대로 원래 명령에 전달된다.

```ini
[alias]
    st = status
    sw = switch
    cm = commit
    aa = add .
```

```bash
git sw -c feat/login        # git switch -c feat/login
git aa                      # git add .
git cm -m "로그인 화면 추가"  # git commit -m "로그인 화면 추가"
```

### 2. 긴 옵션 조합 저장하기

옵션을 여러 개 조합해야 하는 명령은 alias로 저장해두면 외울 필요가 없다. 나는 브랜치 그래프를 보기 좋게 찍는 `lg`를 쓴다.

```ini
[alias]
    lg = !git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

### 3. `!`로 셸 명령 실행하기

alias 값이 `!`로 시작하면 git 명령이 아니라 **셸 명령**으로 실행된다. 그래서 파이프(`|`)나 명령 치환(`$(...)`)을 쓸 수 있다. 예를 들어 최근에 커밋한 브랜치를 순서대로 보여주는 `recent`는 이렇게 만들었다.

```ini
[alias]
    recent = "!git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:relative)|%(refname:short)|%(subject)' | awk -F'|' '{ printf \"%-15s %-35.35s %s\\n\", $1, $2, $3 }'"
```

로직이 길어지면 스크립트 파일로 빼고 alias에서 부르면 된다. 나는 리모트에서 지워진 브랜치를 로컬에서 찾아주는 `pruned-list`와, 그 브랜치들을 확인을 거쳐 지우는 `pruned-clean`을 이렇게 쓴다.

```ini
[alias]
    pruned-list = "!~/.git-tools/.git-pruned-list.sh"
    pruned-clean = "!~/.git-tools/.git-pruned-clean.sh"
```

`!` alias를 쓸 때 주의할 점이 하나 있다. 셸 명령은 **지금 있는 디렉터리가 아니라 저장소의 최상위 디렉터리에서** 실행된다. 하위 폴더에서 상대 경로를 쓰는 alias를 만들면 예상과 다르게 동작할 수 있다.

## 나는 `publish`로 쓴다

나는 로컬 브랜치와 리모트 브랜치의 이름을 따로 두지 않는다. 로컬에서 `feat/login`을 만들었으면 리모트에도 `feat/login`으로 올린다. 그러니 새 브랜치를 처음 올릴 때는 늘 같은 명령을 치게 된다.

```bash
git push -u origin feat/login
```

브랜치 이름을 다시 치는 게 번거롭고, 오타라도 나면 엉뚱한 이름의 브랜치가 리모트에 생긴다. 그래서 현재 브랜치 이름을 알아서 채워 주는 alias를 만들었다.

```bash
git config --global alias.publish '!git push -u origin $(git branch --show-current)'
```

- `git branch --show-current`는 지금 브랜치 이름을 출력한다. (Git 2.22부터)
- `!`로 시작하니 셸이 `$(...)` 부분을 실행해 브랜치 이름으로 바꿔준다.
- 등록할 때 **작은따옴표**로 감싸야 한다. 큰따옴표를 쓰면 등록하는 순간 셸이 `$(...)`를 먼저 풀어버려서, 그때의 브랜치 이름이 고정으로 박힌다.

`~/.gitconfig`에는 이렇게 들어간다.

```ini
[alias]
    publish = !git push -u origin $(git branch --show-current)
```

쓰는 흐름은 이렇다.

```bash
git sw -c feat/login
git aa && git cm -m "로그인 화면 추가"
git publish
```

```bash
git status -sb
## feat/login...origin/feat/login
```

`-u`로 upstream이 걸리니, 그다음부터는 `git push`와 `git pull`만 치면 된다. 덤으로 upstream이 걸려 있으면 리모트에서 브랜치가 지워졌을 때 `git branch -vv`에 `gone`으로 표시되는데, 앞에서 소개한 `pruned-list`가 바로 이 표시로 정리할 브랜치를 찾는다.

참고로 Git 2.37부터는 `push.autoSetupRemote`를 켜두면 upstream이 없는 브랜치에서 그냥 `git push`만 해도 upstream이 함께 설정된다. 설정으로 해결하고 싶다면 이쪽도 방법이다.

## 고려하고 있는 것: 브랜치별 자동 stash

브랜치를 오가다 보면 아직 커밋하기 애매한 변경이 남아 있을 때가 있다. 특히 git이 추적하지 않는 새 파일은 브랜치를 바꿔도 그대로 따라와서, 다른 브랜치 작업에 섞이기 쉽다.

그래서 브랜치를 전환할 때 **추적하지 않는(untracked) 변경사항을 브랜치별로 자동 stash**해 두고, 다시 그 브랜치로 돌아오면 **자동으로 pop**해주는 alias도 고려하고 있다. 브랜치마다 작업하던 상태가 그대로 보관되는 셈이다.

## 마무리

alias는 설정 한 줄이지만, 매일 치는 명령에서 아낀 몇 초와 줄어든 오타가 쌓인다. 반복해서 치는 명령이 보이면 alias로 만들어두자.
