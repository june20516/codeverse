import { useState, useEffect, useRef } from 'react';

interface UseDebounceWithProgressOptions {
  delay?: number;
}

interface UseDebounceWithProgressReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
  progress: number;
  delay: number;
}

export function useDebounceWithProgress<T>(
  value: T,
  options: UseDebounceWithProgressOptions = {},
): UseDebounceWithProgressReturn<T> {
  const { delay = 500 } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [progress, setProgress] = useState(0);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current === value) {
      return;
    }
    prevValueRef.current = value;

    const clearTimers = () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
        progressTimeoutRef.current = null;
      }
    };

    clearTimers();
    setIsDebouncing(true);
    setProgress(0);

    // 다음 프레임에서 progress를 100으로 설정하여 CSS transition 트리거
    progressTimeoutRef.current = setTimeout(() => {
      setProgress(100);
    }, 16);

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
      setProgress(0);
      clearTimers();
    }, delay);

    return clearTimers;
  }, [value, delay]);

  return { debouncedValue, isDebouncing, progress, delay };
}
