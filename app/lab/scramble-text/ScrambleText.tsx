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
