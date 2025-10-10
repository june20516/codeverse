---
title: macOS에서 Slack 링크를 원하는 Chrome 프로필로 열기 (Finicky 사용)
description: 크롬을 조금 더 스마트하게 써보자
date: 2024/12/13
tags:
  - finicky
  - chrome
  - slack
categories:
  - dev
  - enhancement
thumbnail:
---

# macOS에서 Slack 링크를 원하는 Chrome 프로필로 열기 (Finicky 사용)

macOS에서 여러 개의 Chrome 프로필을 사용할 때, Slack 등 앱에서 URL을 클릭하면 항상 **기본 프로필로만 열리는 문제**가 있다. 업무/개인 프로필을 구분해서 사용하고 싶을 때, 불편함이 생긴다.

이 글은 `Finicky`를 사용해 **Slack에서 클릭한 링크만 특정 Chrome 프로필로 열리도록 설정하는 방법**을 정리한 것이다.

---

## 1. Finicky 설치

```bash
brew install --cask finicky
```

설치 후 macOS 시스템 설정에서 **기본 웹 브라우저를 Finicky로 지정**한다:

```
시스템 설정 > 데스크탑 및 Dock > 기본 웹 브라우저
```

---

## 2. Chrome 프로필 이름 확인

Chrome에서 아래 주소를 열어 현재 프로필의 **폴더명**과 **사용자 지정 이름**을 확인한다:

```
chrome://version
```

예시:

```
Profile Path: /Users/username/Library/Application Support/Google/Chrome/Profile 2
```

- `Default`: 첫 번째 프로필
- `Profile 1`, `Profile 2` ...: 이후 생성된 프로필
- 사용자 이름은 오른쪽 상단 프로필 버튼 또는 `chrome://settings/people`에서 확인 가능

---

## 3. Finicky 설정 파일 작성

홈 디렉토리에 `~/.finicky.js` 파일을 생성하고 아래처럼 작성한다:

```javascript
export default {
  defaultBrowser: {
    name: 'Google Chrome',
    profile: '준호 (개인)', // 기본값으로 사용할 프로필
  },
  handlers: [
    {
      match: (_url, app) => app.opener && app.opener.bundleId === 'com.tinyspeck.slackmacgap',
      browser: {
        name: 'Google Chrome',
        profile: '준호 (이즐랩스)',
      },
    },
    {
      match: url => url.hostname.includes('myezl.atlassian.net'),
      browser: {
        name: 'Google Chrome',
        profile: '준호 (이즐랩스)',
      },
    },
    {
      match: url => url.hostname === 'github.com' && url.pathname.startsWith('/ezllabs'),
      browser: {
        name: 'Google Chrome',
        profile: '준호 (이즐랩스)',
      },
    },
    {
      match: url => url.hostname.includes('figma.com'),
      browser: {
        name: 'Google Chrome',
        profile: '준호 (이즐랩스)',
      },
    },
  ],
};
```

---

## 4. Finicky 재시작

1. 메뉴 바에서 Finicky 아이콘 클릭 → "Quit Finicky"
2. 다시 실행

---

## 5. 동작 확인

- Slack에서 업무용 링크 클릭 → `준호 (이즐랩스)` 프로필로 열리는지 확인
- 다른 앱에서는 기본값인 `준호 (개인)` 프로필로 열리는지 확인

---

## 마무리

Finicky는 `opener.bundleId`를 통해 **Slack 앱에서 발생한 링크 클릭**을 정확히 감지할 수 있다. 이를 기반으로 원하는 Chrome 프로필을 지정하면, 업무/개인 환경을 깔끔하게 분리할 수 있다.
