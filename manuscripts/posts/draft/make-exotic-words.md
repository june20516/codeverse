---
title: 이상한 말 만들기
description: JFF, 피보나치어
date: 2025/10/2 14:23:33
tags: some tags separated by space
categories: some categories separated by space
thumbnail: assets/images/posts/{img file name same as post slog}
---

# 피보나치 셔플

피보나치 수열로 텍스트를 재귀적으로 분할하고 뒤섞는 함수입니다.

## fibonacciShuffle

문자열을 피보나치 수열 길이로 분할하고, 각 depth마다 역순을 적용하여 셔플합니다.

```javascript
/**
 * 피보나치 수열로 텍스트를 재귀적으로 분할하고 셔플합니다.
 * @param {string} text - 셔플할 텍스트
 * @param {number} [depth=0] - 재귀 깊이 (내부 사용)
 * @param {Object} [options={}] - 옵션
 * @param {boolean} [options.removeDoubleSpaces=false] - 연속된 공백을 하나로 합칠지 여부
 * @returns {string} 셔플된 텍스트
 */
const fibonacciShuffle = (text, depth = 0, options = {}) => {
  // 최초 입력일 때 개행 제거
  if (depth === 0) {
    text = text.replace(/\n/g, '');
  }

  const indent = '  '.repeat(depth);
  console.log(`${indent}[depth ${depth}] 입력: "${text}" (길이: ${text.length})`);

  if (text.length === 1) {
    console.log(`${indent}→ 탈출 조건: 한 글자`);
    return text;
  }

  const chunks = splitByFibonacci(text);
  console.log(`${indent}→ 분할 결과:`, chunks);

  // depth가 홀수면 역순으로 처리
  const orderedChunks = depth % 2 === 1 ? chunks.reverse() : chunks;
  console.log(`${indent}→ 처리 순서:`, orderedChunks);

  let result = orderedChunks.map(chunk => fibonacciShuffle(chunk, depth + 1, options)).join('');

  // 연속된 공백 제거 옵션
  if (options.removeDoubleSpaces) {
    result = result.replace(/  +/g, ' ');
  }

  console.log(`${indent}← 반환: "${result}"`);

  return result;
};

const splitByFibonacci = (text) => {
  const result = [];
  let index = 0;
  let a = 1, b = 1;

  while (index < text.length) {
    result.push(text.slice(index, index + a));
    index += a;
    [a, b] = [b, a + b];
  }

  return result;
};
```

## fibonacciUnshuffle

셔플된 문자열을 원본으로 복원합니다.

```javascript
/**
 * 피보나치 셔플된 텍스트를 원본으로 복원합니다.
 * @param {string} shuffledText - 셔플된 텍스트
 * @param {Object} [options={}] - 옵션
 * @param {boolean} [options.removeDoubleSpaces=false] - 연속된 공백을 하나로 합칠지 여부
 * @returns {string} 복원된 텍스트
 */
const fibonacciUnshuffle = (shuffledText, options = {}) => {
  const length = shuffledText.length;
  const structure = getFibStructure(length, 0);
  let result = reconstruct(shuffledText, structure);

  // 연속된 공백 제거 옵션
  if (options.removeDoubleSpaces) {
    result = result.replace(/  +/g, ' ');
  }

  return result;
};

const getFibStructure = (length, depth) => {
  if (length === 1) return { length: 1, depth, children: null };

  const chunks = getFibChunks(length);
  const orderedChunks = depth % 2 === 1 ? chunks.reverse() : chunks;

  return {
    length,
    depth,
    children: orderedChunks.map(chunkLen => getFibStructure(chunkLen, depth + 1))
  };
};

const getFibChunks = (length) => {
  const result = [];
  let remaining = length;
  let a = 1, b = 1;

  while (remaining > 0) {
    const take = Math.min(a, remaining);
    result.push(take);
    remaining -= take;
    [a, b] = [b, a + b];
  }

  return result;
};

const reconstruct = (text, structure) => {
  if (structure.children === null) {
    return text;
  }

  let index = 0;
  const parts = structure.children.map(child => {
    const part = text.slice(index, index + child.length);
    index += child.length;
    return reconstruct(part, child);
  });

  // 홀수 depth였다면 역순이었으므로 다시 뒤집기
  if (structure.depth % 2 === 1) {
    parts.reverse();
  }

  return parts.join('');
};
```

## 사용 예시

```javascript
const original = "이 언어는 피보나치어라고 부르기로 합니다.\n뒤섞였을 때에도 말이 되는 것 처럼 보이지만 의미를 파악하기 어렵습니다.";

// 옵션 없이 사용
const shuffled1 = fibonacciShuffle(original);
const restored1 = fibonacciUnshuffle(shuffled1);

console.log('셔플:', shuffled1);
console.log('복원:', restored1);

// 연속 공백 제거 옵션 사용 (더 자연스러운 결과)
const shuffled2 = fibonacciShuffle(original, 0, { removeDoubleSpaces: true });
const restored2 = fibonacciUnshuffle(shuffled2, { removeDoubleSpaces: true });

console.log('셔플 (옵션):', shuffled2);
console.log('복원 (옵션):', restored2);
```