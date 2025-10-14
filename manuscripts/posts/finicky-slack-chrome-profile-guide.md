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
thumbnail: assets/images/posts/thumbnails/finicky-slack-chrome-profile-guide.png
---

# macOS에서 Slack 링크를 원하는 Chrome 프로필로 열기 (Finicky 사용)

나는 회사 일과 개인 활동을 분리하려고 Chrome 프로필을 따로 쓴다. 그런데 macOS에서 Slack이나 mail 같은 앱에서 링크를 클릭하면 **무조건 시스템 기본 프로필로만 열린다**.

Slack에서 회사 Jira 링크를 클릭했는데 개인 프로필로 열려서 로그인이 안 되어 있거나, 반대로 YouTube 링크가 회사 프로필로 열려 프리미엄 계정이 있음에도 광고를 보는 상황이 하루에도 몇 번씩 생긴다. 그럴 때마다 프로필 바꾸고 새로고침하는 게 퍽 번거롭다. 개발자스럽게 해결해보자.

`Finicky`라는 앱을 찾았다. 이걸 쓰면 **링크의 출처나 도메인에 따라 자동으로 원하는 Chrome 프로필로 열 수 있다**.

## 1. [Finicky](https://github.com/johnste/finicky) 설치

```bash
brew install --cask finicky
```

설치 후 macOS 시스템 설정에서 **기본 웹 브라우저를 Finicky로 지정**한다:

```
시스템 설정 > 데스크탑 및 Dock > 기본 웹 브라우저
```

**중요**: Finicky가 제대로 동작하려면 반드시 시스템의 기본 브라우저로 설정되어 있어야 한다. 다른 앱(Slack, Mail 등)에서 링크를 클릭하면 기본 브라우저가 실행되는데, 이때 Finicky가 중간에서 설정에 따라 적절한 브라우저와 프로필을 선택해서 열어주는 방식이다.

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

## 3. Finicky 설정 파일 작성

홈 디렉토리에 `~/.finicky.js` 파일을 만들고 이곳에 설정을 작성하면 된다.

나의 경우 아래와 같이 설정했다

- Slack에서 열리는 링크는 전부 회사 프로필로
- 회사 Jira, GitHub organization, Figma도 회사 프로필로
- YouTube는 프리미엄이 있는 개인 프로필로
- 나머지는 다 개인 프로필(기본값)

```javascript
export default {
  defaultBrowser: {
    name: 'Google Chrome',
    profile: 'Personal', // 기본값으로 사용할 프로필
  },
  handlers: [
    {
      match: url => url.hostname.includes('youtube') || url.hostname.includes('youtu.be'),
      browser: {
        name: 'Google Chrome',
        profile: 'Personal', // YouTube Premium 계정이 설정된 프로필
      },
    },
    {
      match: url => url.hostname === 'company.atlassian.net',
      browser: {
        name: 'Google Chrome',
        profile: 'Work',
      },
    },
    {
      match: url => url.hostname === 'github.com' && url.pathname.startsWith('/company-org'),
      browser: {
        name: 'Google Chrome',
        profile: 'Work',
      },
    },
    {
      match: url => url.hostname.includes('www.figma.com'),
      browser: {
        name: 'Google Chrome',
        profile: 'Work',
      },
    },
    {
      match: (_url, app) => app.opener && app.opener.bundleId === 'com.tinyspeck.slackmacgap',
      browser: {
        name: 'Google Chrome',
        profile: 'Work',
      },
    },
  ],
};
```

handlers는 **위에서부터 순차적으로 평가**되며, 첫 번째로 매칭되는 규칙이 적용된다. 그래서 YouTube 규칙을 Slack bundleId 규칙보다 위에 배치했다. 만약 순서가 반대라면 Slack에서 YouTube 링크를 클릭해도 모두 Work 프로필로 열릴 것이다.

## 4. 디버깅

설정이 제대로 동작하는지 확인하려면 Finicky를 실행하고 **Troubleshoot** 탭을 열면 된다. 여기서 실시간 로그를 볼 수 있다.

<div style="text-align: center;">
  <img src="/assets/images/posts/finicky-slack-chrome-profile-guide/finicky-debug.png" alt="Finicky Troubleshoot" width="600" />
</div>

match 함수 안에서 `console.log()`를 사용하면 필요한 데이터를 확인할 수 있다:

```javascript
{
  match: (_url, app) => {
    console.log('URL:', _url.hostname);
    console.log('Opener:', app.opener?.bundleId);
    return app.opener && app.opener.bundleId === 'com.tinyspeck.slackmacgap';
  },
  browser: {
    name: 'Google Chrome',
    profile: 'Work',
  },
}
```

이렇게 하면 어떤 앱에서 어떤 URL을 열었는지 정확히 알 수 있어서, 새로운 규칙을 추가할 때 유용하다.
