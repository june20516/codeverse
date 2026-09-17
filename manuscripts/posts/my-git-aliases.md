---
title: 내가 쓰는 git alias 모음
description: 깃을 좀 더 편하게 쓰기
date: 2026/05/20
tags:
  - git
  - alias
categories:
  - dev
  - enhancement
thumbnail: assets/images/posts/thumbnails/my-git-aliases.jpeg
---

# 내가 쓰는 git alias 모음

git을 쓰다 보면 하루에도 몇 번씩 같은 명령을 친다. `git status`, `git switch`, 옵션을 잔뜩 붙인 `git log`까지. 매번 전부 치기엔 길고, 옵션은 자꾸 헷갈린다.

git에는 이런 명령에 짧은 이름을 붙여 쓰는 **alias** 기능이 있다. 이 글에서는 alias를 만드는 법을 짧게 정리하고, 내가 실제로 쓰고 있는 alias들을 하나씩 소개한다.

## alias 만드는 법

alias는 `git config`로 등록한다.

```bash
git config --global alias.st status
```

이제 `git st`가 `git status`와 똑같이 동작한다. 설정은 `~/.gitconfig`의 `[alias]` 섹션에 저장되니, 파일을 직접 열어 고쳐도 된다. 등록된 alias는 이렇게 확인할 수 있다.

```bash
git config --global --get-regexp '^alias\.'
```

알아둘 규칙이 몇 가지 있다.

- alias 뒤에 붙인 인자는 **그대로 원래 명령에 전달**된다.
- git에 **이미 있는 명령과 같은 이름**의 alias는 무시된다.
- 값이 `!`로 시작하면 git 명령이 아니라 **셸 명령**으로 실행된다. 파이프(`|`)나 명령 치환(`$(...)`)을 쓸 수 있고, 저장소의 **최상위 디렉터리에서** 실행된다.

## 내가 쓰는 alias

내 `~/.gitconfig`의 `[alias]` 섹션은 이렇다.

```ini
[alias]
    sw = switch
    br = branch
    cm = commit
    st = status
    aa = add .
    lg = !git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    publish = !git push -u origin $(git branch --show-current)
    pruned-list = "!~/.git-tools/.git-pruned-list.sh"
    pruned-clean = "!~/.git-tools/.git-pruned-clean.sh"
    recent = "!git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:relative)|%(refname:short)|%(subject)' | awk -F'|' '{ printf \"%-15s %-35.35s %s\\n\", $1, $2, $3 }'"
```

### `git st` — status

```ini
st = status
```

작업하다가 지금 무엇이 바뀌었는지 수시로 확인할 때 쓴다. 짧게 요약해서 보고 싶으면 옵션을 그대로 붙이면 된다.

```bash
git st -sb
```

### `git sw` — switch

```ini
sw = switch
```

브랜치를 옮기거나 새로 만들 때 쓴다. `checkout`보다 역할이 분명한 `switch`를 짧게 부르는 용도다.

```bash
git sw main
git sw -c feat/login   # 새 브랜치를 만들며 이동
```

### `git br` — branch

```ini
br = branch
```

로컬 브랜치 목록을 보거나 정리할 때 쓴다. `-vv`를 붙이면 각 브랜치가 어떤 리모트 브랜치를 추적하는지도 함께 보인다.

```bash
git br
git br -vv
```

### `git cm` — commit

```ini
cm = commit
```

커밋할 때 쓴다. 메시지 옵션은 그대로 뒤에 붙인다.

```bash
git cm -m "로그인 화면 추가"
```

### `git aa` — add .

```ini
aa = add .
```

변경을 한 번에 스테이징할 때 쓴다. `.`은 **지금 있는 디렉터리 아래**를 뜻하니, 저장소 최상위에서 실행해야 전체가 올라간다.

```bash
git aa && git cm -m "로그인 화면 추가"
```

### `git lg` — 한눈에 보는 log

```ini
lg = !git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

브랜치 흐름을 그래프로 보면서, 한 줄에 해시·브랜치·메시지·시간·작성자를 색으로 구분해 보여준다. 옵션이 길어서 외워 쓰기 어려운 명령의 대표적인 예다. 인자도 그대로 전달되니 `git lg -5`처럼 개수를 제한할 수도 있다.

```bash
git lg
```

```
* cbc8980 - (HEAD -> fix/button, origin/fix/button) 버튼 색상 수정 (12분 전) <Bran>
*   10b12d3 - (origin/main, main) Merge branch 'feat/login' (2시간 전) <Bran>
|\
| * 0ec8586 - (feat/login) 로그인 화면 추가 (4시간 전) <Bran>
| * e724c75 - 로그인 API 연결 (5시간 전) <Bran>
|/
*   0d7baec - Merge branch 'fix/header' (6시간 전) <Bran>
|\
| * 3e7ded0 - (fix/header) 헤더 레이아웃 수정 (7시간 전) <Bran>
|/
* beabdd0 - 프로젝트 초기 설정 (2일 전) <Bran>
```

### `git recent` — 최근에 작업한 브랜치

```ini
recent = "!git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:relative)|%(refname:short)|%(subject)' | awk -F'|' '{ printf \"%-15s %-35.35s %s\\n\", $1, $2, $3 }'"
```

브랜치가 많아지면 방금 전까지 무슨 브랜치에서 작업했는지 헷갈린다. 로컬 브랜치를 마지막 커밋 시간 순으로 정렬해, 시간·브랜치 이름·마지막 커밋 메시지를 표처럼 보여준다.

```bash
git recent
```

```
12분 전       fix/button                          버튼 색상 수정
2시간 전     main                                Merge branch 'feat/login'
4시간 전     feat/login                          로그인 화면 추가
7시간 전     fix/header                          헤더 레이아웃 수정
```

### `git publish` — 새 브랜치 올리기

```ini
publish = !git push -u origin $(git branch --show-current)
```

나는 로컬 브랜치와 리모트 브랜치의 이름을 따로 두지 않는다. 그래서 새 브랜치를 처음 올릴 때는 늘 `git push -u origin <지금 브랜치 이름>`을 치게 되는데, 이름을 다시 치는 게 번거롭고 오타가 나면 엉뚱한 브랜치가 리모트에 생긴다. `git branch --show-current`(Git 2.22부터)로 지금 브랜치 이름을 채워 넣는다.

```bash
git sw -c feat/login
git publish          # git push -u origin feat/login
```

직접 등록할 때는 `'!git push -u origin $(git branch --show-current)'`처럼 **작은따옴표**로 감싸야 한다. 큰따옴표를 쓰면 등록하는 순간 셸이 `$(...)`를 먼저 풀어서, 그때의 브랜치 이름이 고정으로 박힌다. 참고로 Git 2.37부터는 `push.autoSetupRemote` 설정으로도 비슷한 효과를 낼 수 있다.

### `git pruned-list` — 리모트에서 지워진 브랜치 찾기

```ini
pruned-list = "!~/.git-tools/.git-pruned-list.sh"
```

PR을 병합하고 리모트 브랜치를 지워도 로컬 브랜치는 그대로 남는다. 이 alias는 스크립트를 불러 리모트 정보를 갱신(`git remote update origin --prune`)한 뒤, 추적하던 리모트 브랜치가 사라진(`git branch -vv`에 `gone`으로 표시되는) 로컬 브랜치를 모아 보여준다. 접두사를 주면 그 이름으로 시작하는 브랜치만 찾는다.

```bash
git pruned-list          # 전체
git pruned-list feat/    # feat/로 시작하는 브랜치만
```

`gone` 표시는 upstream이 걸린 브랜치에만 뜨니, `git publish`로 올린 브랜치와 짝이 잘 맞는다.

### `git pruned-clean` — 지워진 브랜치 정리하기

```ini
pruned-clean = "!~/.git-tools/.git-pruned-clean.sh"
```

`pruned-list`로 찾은 브랜치를 실제로 지운다. 삭제는 리스크가 크기 때문에, 어떤 브랜치들을 지울 건지 의사를 더 선명하게 드러내도록 **접두사를 반드시 지정**하게 했다. 지울 목록을 보여준 뒤 `y`를 눌러야 실제로 삭제한다.

```bash
git pruned-clean feat/
```

로직이 길어지는 alias는 이렇게 스크립트 파일로 빼두고 alias에서는 부르기만 하면 관리하기 편하다.

## 추가하고 싶은 것: 브랜치별 자동 stash

브랜치를 오가다 보면 아직 커밋하기 애매한 변경이 남아 있을 때가 있다. 특히 git이 추적하지 않는 새 파일은 브랜치를 바꿔도 그대로 따라와서, 다른 브랜치 작업에 섞이기 쉽다.

그래서 브랜치를 전환할 때 **추적하지 않는(untracked) 변경사항을 브랜치별로 자동 stash**해 두고, 다시 그 브랜치로 돌아오면 **자동으로 pop**해주는 alias를 고려하고 있다. 브랜치마다 작업하던 상태가 그대로 보관되는 셈이다.

## 마무리

alias는 설정 한 줄이지만, 매일 치는 명령에서 아낀 몇 초와 줄어든 오타가 쌓인다. 반복해서 치는 명령이 보이면 alias로 만들어두자.
