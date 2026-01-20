---
title: 유니코드 범위를 활용한 텍스트 스크램블 효과 구현하기
description: 드르르륵 - 차칵
date: 2026/01/20
tags:
  - typescript
  - components
  - react
  - animation
  - ui
thumbnail: assets/images/posts/thumbnails/unicode-scramble.png
---

# [React] 유니코드 범위를 활용한 텍스트 스크램블 효과 구현하기

정적인 텍스트에 생동감을 불어넣기 위해, 글자가 암호를 해독하듯 빠르게 변화하며 완성되는 '스크램블(Scramble)' 효과를 구현해 보았다. 단순히 무작위 문자를 보여주는 것이 아니라, 문자가 속한 유니코드 범위 내에서 값이 점진적으로 변하도록 하여 시각적인 개연성을 부여하는 것이 목표다.

> Demo

이 포스트에서 다루는 컴포넌트의 실제 동작 모습은 [lab/scramble-text](/lab/scramble-text) 페이지에서 직접 확인해 볼 수 있다.

전체 컴포넌트의 코드는 포스트의 끝에 첨부한다.

## 원리와 의도

이 컴포넌트의 핵심 원리는 문자(Character)를 숫자(Code Point)로 치환하여 다루는 것이다.

컴퓨터 내부에서 모든 문자는 고유한 숫자를 가진다. 예를 들어 'A'는 65, 'B'는 66이다. 우리가 목표로 하는 글자가 'Z'(90)라면, 65부터 90까지 숫자를 빠르게 증가시키며 문자로 변환해 보여줌으로써 마치 슬롯머신이 돌아가는 듯한 효과를 줄 수 있다.

이때 중요한 점은 **'문맥에 맞는 범위'**를 설정하는 것이다. 한글이 나와야 할 자리에서 뜬금없이 특수문자나 알파벳이 나오면 어색하다. 따라서 문자의 종류(숫자, 영문 대소문자, 한글 등)를 식별하고, 해당 범위의 시작점(Start Code)에서 목표 문자(Target Code)까지 도달하는 경로(Track)를 생성하여 자연스러운 연출을 의도했다.

## 컴포넌트 구조

구현된 ScrambleText 컴포넌트는 크게 세 가지 단계로 동작한다.

범위 탐색 (findCharRange): 입력된 문자가 어느 유니코드 블록(예: 한글 소리마디, 영문 대문자 등)에 속하는지 판별한다.

트랙 생성 (createScrambleTrack): 해당 블록의 시작 코드부터 목표 코드까지의 숫자 배열을 생성한다. 이때 maxSteps를 기준으로 중간 과정을 생략하거나 촘촘하게 채워 애니메이션 길이를 조절한다.

애니메이션 실행 (animate): setTimeout을 재귀적으로 호출하며 트랙의 숫자를 순차적으로 문자로 변환해 렌더링한다.

## 주요 구현 코드

### 1. 유니코드 범위 정의

자주 사용되는 문자의 범위를 튜플로 정의해 두었다. 특히 한글은 '가'부터 '힣'까지의 완성형 범위(44032~55203)를 사용하여, 자모음이 분리되지 않고 온전한 글자 형태로 변화하도록 했다.

```TypeScript

const CHARACTER_RANGES: CodeRange[] = [
[48, 57], // 0-9
[65, 90], // A-Z
[97, 122], // a-z
[44032, 55203], // 가-힣
// ... (기타 특수문자 및 자모 범위)
];
```

### 2. 속도 조절 (Ease-out 효과)

모든 글자가 똑같은 속도로 멈추면 기계적인 느낌이 강하다. 이를 완화하기 위해 마지막 글자가 완성되기 직전(layback 구간)에는 딜레이를 지수적으로 증가시키는 calculateSlowdownInterval 함수를 적용했다. 덕분에 글자가 '철컥'하고 맞물리는 듯한 타건감을 줄 수 있다.

```TypeScript
const calculateSlowdownInterval = (
baseInterval: number,
remaining: number,
layback: number,
): number => {
if (remaining >= layback) return baseInterval;
// 남은 단계가 적을수록 간격을 넓혀 속도를 줄인다
return baseInterval \* Math.pow(1.5, layback - remaining);
};
```

### 3. 렌더링 최적화

React의 useState로 화면에 표시될 문자 배열(displayChars)을 관리하고, useEffect 내에서 애니메이션 로직을 수행한다. requestAnimationFrame 대신 setTimeout을 사용한 이유는 각 글자마다 미세하게 다른 속도(Ease-out)를 개별적으로 제어하기 위함이다.

## 주의 사항

구현 시 몇 가지 고려해야 할 점들이 있다.

- 메모리 누수 방지: 컴포넌트가 애니메이션 도중 언마운트될 경우를 대비해 cleanup 함수에서 반드시 clearTimeout을 호출해야 한다. 위 코드에서는 isAnimatingRef 플래그와 클로저 변수 timerId를 통해 이를 관리하고 있다.

- 유니코드 범위 예외 처리: 정의되지 않은 범위의 문자(예: 이모지, 희귀 외국어)가 들어올 경우 CHARACTER_RANGES.find가 실패할 수 있다. 이에 대비해 기본값(SPACE_CODE)을 반환하거나, 해당 문자는 애니메이션 없이 바로 보여주는 식의 처리가 필요하다.

- 성능: 문자열이 매우 길어지면 각 문자마다 setTimeout이 돌기 때문에 성능 저하가 발생할 수 있다. 긴 텍스트의 경우 maxSteps를 줄이거나, 화면에 보이는 부분만 애니메이션 처리하는 최적화가 필요할 수 있다.

## 정리

이 컴포넌트는 단순히 화려함을 더하는 것을 넘어, 데이터가 로딩되거나 값이 변화할 때 사용자에게 시각적인 피드백을 주는 용도로 활용하기 좋다. 유니코드라는 문자의 본질적인 속성을 활용했기 때문에, 별도의 라이브러리 없이도 꽤 그럴싸한 효과를 낼 수 있었다.

---

<details>
<summary>컴포넌트 코드</summary>

```typescript
import { Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

type CodeRange = readonly [number, number];

const SPACE_CODE = 32;

const CHARACTER_RANGES: CodeRange[] = [
  [48, 57], // 0-9
  [65, 90], // A-Z
  [97, 122], // a-z
  [44032, 55203], // 가-힣
  [12593, 12622], // ㄱ-ㅎ
  [12623, 12643], // ㅏ-ㅣ
  [33, 47], // !"#$%&'()*+,-./
  [58, 64], // :;<=>?@
  [91, 96], // [\]^_`
  [123, 126], // {|}~
  [SPACE_CODE, SPACE_CODE],
];

const findCharRange = (char: string): CodeRange => {
  const code = char.codePointAt(0) ?? SPACE_CODE;
  return (
    CHARACTER_RANGES.find(([start, end]) => code >= start && code <= end) ?? [
      SPACE_CODE,
      SPACE_CODE,
    ]
  );
};

interface ScrambleTrack {
  codes: number[];
  length: number;
}

const createScrambleTrack = (char: string, maxSteps: number): ScrambleTrack => {
  if (char === ' ') {
    return { codes: [], length: 0 };
  }

  const [rangeStart] = findCharRange(char);
  const targetCode = char.codePointAt(0) ?? SPACE_CODE;
  const distance = targetCode - rangeStart;
  const step = Math.max(1, Math.floor(distance / maxSteps));

  const codes: number[] = [];
  for (let code = rangeStart; code < targetCode; code += step) {
    codes.push(code);
  }
  codes.push(targetCode);

  return { codes, length: codes.length };
};

const updateCharAt = (chars: string[], index: number, newChar: string): string[] => {
  const next = [...chars];
  next[index] = newChar;
  return next;
};

const calculateSlowdownInterval = (
  baseInterval: number,
  remaining: number,
  layback: number,
): number => {
  if (remaining >= layback) return baseInterval;
  const slowdownFactor = layback - remaining;
  return baseInterval * Math.pow(1.5, slowdownFactor);
};

interface ScrambleTextProps {
  value: string;
  maxSteps?: number;
  layback?: number;
  baseInterval?: number;
}

const ScrambleText = ({
  value,
  maxSteps = 20,
  layback = 7,
  baseInterval = 30,
}: ScrambleTextProps) => {
  const [displayChars, setDisplayChars] = useState<string[]>(() => Array(value.length).fill(' '));
  const isAnimatingRef = useRef(false);

  const createTrackForValue = useCallback(
    () => Array.from(value).map(char => createScrambleTrack(char, maxSteps)),
    [value, maxSteps],
  );

  useEffect(() => {
    if (value.length === 0) return;

    setDisplayChars(Array(value.length).fill(' '));
    isAnimatingRef.current = true;
    const tracks = createTrackForValue();

    let charIndex = 0;
    let codeIndex = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const animate = () => {
      if (charIndex >= value.length) {
        isAnimatingRef.current = false;
        return;
      }

      const track = tracks[charIndex];
      const isTrackComplete = !track.codes.length || codeIndex >= track.length;

      if (isTrackComplete) {
        setDisplayChars(prev => updateCharAt(prev, charIndex, value[charIndex]));
        charIndex++;
        codeIndex = 0;
        timerId = setTimeout(animate, baseInterval);
        return;
      }

      const currentCode = track.codes[codeIndex];
      setDisplayChars(prev => updateCharAt(prev, charIndex, String.fromCodePoint(currentCode)));
      codeIndex++;

      const isLastChar = charIndex === value.length - 1;
      const remaining = track.length - codeIndex;
      const interval = isLastChar
        ? calculateSlowdownInterval(baseInterval, remaining, layback)
        : baseInterval;

      timerId = setTimeout(animate, interval);
    };

    animate();

    return () => {
      if (timerId) clearTimeout(timerId);
      isAnimatingRef.current = false;
    };
  }, [value, createTrackForValue, layback, baseInterval]);

  return (
    <Typography variant="h1" sx={{ padding: 10 }}>
      {displayChars.join('')}
    </Typography>
  );
};

export default ScrambleText;
```

</details>
