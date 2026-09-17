---
title: 'fzf로 셸 히스토리 다시 꺼내 쓰기, ag'
description: '그 명령, 뭐였더라'
date: 2026/09/17
tags:
  - zsh
  - fzf
  - shell
  - history
categories:
  - dev
  - enhancement
thumbnail: assets/images/posts/thumbnails/zsh-history-picker-ag.jpeg
---

# fzf로 셸 히스토리 다시 꺼내 쓰기, ag

며칠 전에 쳤던 긴 명령을 다시 쓰고 싶을 때가 있다. 옵션이 잔뜩 붙은 `docker run`이라든가, 조건을 여러 개 건 `git log` 같은 것들. 분명 쳤던 기억은 나는데 정확한 옵션은 기억나지 않는다.

셸에도 방법은 있다. `ctrl+r`은 검색어에 맞는 명령을 **한 번에 하나씩** 거슬러 올라가며 보여주고, `history | grep`은 목록은 보여주지만 찾은 명령을 **다시 복사해서 붙여넣어야** 한다. 둘 다 조금씩 아쉬웠다.

## 목표

원하는 건 세 가지였다.

1. 검색어로 좁힌 명령들을 **한눈에 목록으로** 본다.
2. 목록에서 **골라서** 바로 쓴다.
3. 고른 명령은 실행하기 전에 **한 번 고칠 수** 있다.

## 구현: `fc` + `fzf`

뼈대는 단순하다. 히스토리를 목록으로 뽑고, [fzf](https://github.com/junegunn/fzf)로 고르게 한다.

```zsh
fc -rl 1 | fzf --query="$query"
```

`fc -rl 1`은 첫 번째 명령부터 전체 히스토리를 **최신순으로**, 번호를 붙여 출력한다. fzf는 이 목록을 받아 검색하고 고르는 화면을 띄운다. 고른 줄에서 앞의 번호만 떼어내면 명령이 된다. 여기에 `again`이라는 함수 이름을 붙이고, 짧게 부르려고 `ag`라는 alias를 달았다.

## 쓰다 보니 걸린 것들

뼈대만으로도 쓸 만했지만, 자주 쓰다 보니 거슬리는 곳이 하나둘 보였다.

**같은 명령이 여러 번 나온다.** 같은 명령을 열 번 쳤으면 목록에도 열 줄이 나온다. 번호를 뺀 명령 문자열을 기준으로, 처음 나온 줄(가장 최근 것)만 남긴다.

```zsh
fc -rl 1 | awk '!seen[substr($0, index($0,$2))]++'
```

**ag를 부른 기록이 목록을 채운다.** `ag`로 찾은 기록 자체도 히스토리에 남으니 목록에서 뺀다. 처음에는 `ag `가 들어간 줄을 모두 빼는 방식이었는데, 이 글을 쓰면서 다시 보니 `git tag v1.0.0`처럼 **"tag "가 들어간 무관한 명령까지** 함께 숨기고 있었다. 그래서 번호 바로 뒤에 오는 명령 이름이 `ag`나 `again`일 때만 빼도록 고쳤다. 여러 줄짜리 명령이 히스토리에 남기는 빈 줄도 같이 뺀다.

```zsh
local exclude_pattern='^[[:space:]]*[0-9]+\*?[[:space:]]+(ag|again)([[:space:]]|$)|^[[:space:]]*$'
```

**퍼지 매칭이 너무 넓다.** fzf는 기본적으로 글자가 떨어져 있어도 순서만 맞으면 결과에 넣는다. 파일 이름을 찾을 땐 편하지만, 명령을 찾을 땐 엉뚱한 줄이 많이 섞인다. `--exact`로 입력한 문자열이 그대로 들어 있는 줄만 남기고, `--no-sort`로 최신순을 유지했다.

**단어 하나로는 좁혀지지 않는다.** 검색어 하나로 좁히기 어려울 때를 위해 옵션 두 개를 더했다. `-a`(`--and`) 뒤의 단어는 반드시 들어가야 하고, `-e`(`--exclude`) 뒤의 단어는 들어가면 안 된다.

```zsh
ag git -a commit -e status   # git과 commit이 들어가고, status는 없는 명령
```

**고르자마자 실행되면 곤란하다.** 예전 명령을 그대로 다시 실행하기보다, 옵션 하나나 경로 하나만 바꿔서 쓰고 싶을 때도 많다. 그래서 고른 명령을 바로 실행하지 않고, `print -z`로 **입력줄에 올려두기만** 한다. 고칠 곳을 고친 뒤 Enter를 누르면 된다.

```zsh
print -z "$selected_command"
```

**다른 터미널에서 친 명령도 보여야 한다.** 함수가 시작될 때 `fc -W`로 지금 세션의 히스토리를 파일에 쓰고, `fc -R`로 파일을 다시 읽어 들인다. 그래서 다른 터미널이 파일에 남긴 명령까지 목록에 올라온다.

## 사용법

```zsh
ag                                  # 전체 히스토리에서 고르기
ag git                              # "git"이 검색창에 채워진 채로 열기
ag git -a commit -e status          # commit은 들어가고 status는 빠진 git 명령
ag "docker run" --and container     # 공백이 든 검색어는 따옴표로
```

## 설치

1. [fzf](https://github.com/junegunn/fzf)를 설치한다. (`brew install fzf`)
2. 아래 전체 코드를 `~/.zsh/again.zsh` 같은 파일로 저장한다.
3. `~/.zshrc`에서 불러온다.

```zsh
source ~/.zsh/again.zsh
```

참고로 `ag`는 코드 검색 도구 [The Silver Searcher](https://github.com/ggreer/the_silver_searcher)의 명령 이름과 겹친다. 그 도구를 쓰고 있다면 alias 이름을 바꾸는 게 좋다.

## 마무리

대단한 도구는 아니지만, 자주 반복하는 동작이라 체감이 크다. "그 명령 뭐였더라" 싶을 때 `ag` 두 글자로 끝난다. 그리고 오랜만에 코드를 다시 읽어보니 역시 숨어 있던 구멍이 있었다. 자주 쓰는 도구일수록 가끔 다시 들여다볼 일이다.

<details>
<summary>전체 코드</summary>

```zsh
again () {
    local CYAN='\033[0;36m'
    local RED='\033[0;31m'
    local NC='\033[0m'

    # 도움말 메시지 정의
    show_help() {
        echo -e "${CYAN}Usage:${NC} ag [query] [options]"
        echo -e ""
        echo -e "${CYAN}Options:${NC}"
        echo -e "  -a, --and [words...]      Include words (AND search)"
        echo -e "  -e, --exclude [words...]  Exclude words"
        echo -e "  -h, --help                Show this help message"
        echo -e ""
        echo -e "${CYAN}Examples:${NC}"
        echo -e "  ag git -a commit -e status"
        echo -e "  ag \"docker run\" --and container"
    }

    # 1. fzf 설치 체크
    if ! command -v fzf &> /dev/null; then
        echo -e "${RED}Error: 'fzf' is not installed.${NC}"
        return 1
    fi

    # 2. 히스토리 동기화
    builtin fc -W
    builtin fc -R

    local query=""
    # ag/again 호출 자체만 뺀다. 줄 어디서든 "ag "를 찾으면 `git tag v1`처럼 무관한 명령까지 사라진다.
    # fc -l 출력은 "  번호[*]  명령" 형태라 번호 바로 뒤에 오는 명령 이름만 본다.
    # 여러 줄짜리 명령이 남기는 빈 줄도 함께 뺀다.
    local exclude_pattern='^[[:space:]]*[0-9]+\*?[[:space:]]+(ag|again)([[:space:]]|$)|^[[:space:]]*$'
    local and_terms=()
    local mode="query"

    # 3. 인자 처리 (도움말 우선 처리)
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                return 0 # 도움말 출력 후 즉시 종료
                ;;
            -e|--exclude)
                mode="exclude"
                shift
                ;;
            -a|--and)
                mode="include"
                shift
                ;;
            *)
                case "$mode" in
                    exclude) exclude_pattern="$exclude_pattern|$1" ;;
                    include) and_terms+=("$1") ;;
                    query)   query="$1"; mode="normal" ;;
                    *)       and_terms+=("$1") ;;
                esac
                shift
                ;;
        esac
    done

    # 4. 고속 데이터 추출
    local history_data
    history_data=$(fc -rl 1 | awk '!seen[substr($0, index($0,$2))]++' | grep -vE "$exclude_pattern")

    for term in "${and_terms[@]}"; do
        history_data=$(echo "$history_data" | grep -i "$term")
    done

    # 5. fzf 선택
    local selected_raw
    selected_raw=$(echo "$history_data" | \
        fzf --height 60% \
            --layout=reverse \
            --border \
            --inline-info \
            --query="$query" \
            --prompt="Select command > " \
            --header="[Enter] Edit & Run | [ESC] Cancel" \
            --no-hscroll \
            --wrap \
            --exact \
            --no-sort \
            --sync)

    # 6. 입력 버퍼로 전달
    if [[ -n "$selected_raw" ]]; then
        local selected_command=$(echo "$selected_raw" | sed -E 's/^[[:space:]]*[0-9]+[[:space:]]+//')
        print -z "$selected_command"
    fi
}

alias ag='again'
```

</details>
