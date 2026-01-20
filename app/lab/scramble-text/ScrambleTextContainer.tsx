'use client';
import ScrambleText from './ScrambleText';
import { Box, Input, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounceWithProgress } from '@/app/hooks/useDebounceWithProgress';

const ScrambleTextContainer = () => {
  const [inputValue, setInputValue] = useState('');
  const { debouncedValue, isDebouncing, progress, delay } = useDebounceWithProgress(inputValue, {
    delay: 1000,
  });
  const [paddingTimeAppliedProgressDisplay, setPaddingTimeAppliedProgressDisplay] = useState(false);

  useEffect(() => {
    if (paddingTimeAppliedProgressDisplay) return;
    if (isDebouncing) {
      setPaddingTimeAppliedProgressDisplay(true);
    }
  }, [isDebouncing]);

  useEffect(() => {
    if (paddingTimeAppliedProgressDisplay && !isDebouncing) {
      setTimeout(() => {
        setPaddingTimeAppliedProgressDisplay(false);
      }, 1000);
    }
  }, [paddingTimeAppliedProgressDisplay, isDebouncing]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
          <Input
            placeholder="Text to scramble"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {paddingTimeAppliedProgressDisplay && (
              <CircularProgress
                variant="determinate"
                value={progress}
                size={24}
                thickness={4}
                sx={{
                  '& .MuiCircularProgress-circle': {
                    transition: progress === 100 ? `stroke-dashoffset ${delay}ms linear` : 'none',
                  },
                }}
              />
            )}
          </Box>
        </Box>
        <ScrambleText value={debouncedValue || 'Hello, Universe!'} />
      </Box>
    </Box>
  );
};

export default ScrambleTextContainer;
