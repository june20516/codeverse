'use client';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

const COPIED_FEEDBACK_DURATION_MS = 1500;
const MONOSPACE_FONT_FAMILY = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

interface CopyableCommandProps {
  commands: string[];
}

const CopyableCommand = ({ commands }: CopyableCommandProps) => {
  const theme = useTheme();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timerId = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands.join('\n'));
      setIsCopied(true);
    } catch (error) {
      console.error('설치 명령을 복사하지 못했습니다', error);
    }
  };

  const containerStyle = {
    position: 'relative',
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  };

  const preStyle = {
    m: 0,
    py: 2,
    pl: 2,
    pr: 7,
    overflowX: 'auto',
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: '0.8125rem',
    lineHeight: 1.8,
    color: theme.palette.text.primary,
  };

  const copyButtonStyle = {
    position: 'absolute',
    top: 8,
    right: 8,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    color: isCopied ? theme.palette.success.main : theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      color: isCopied ? theme.palette.success.main : theme.palette.text.primary,
    },
  };

  return (
    <Box sx={containerStyle}>
      <Box component="pre" sx={preStyle}>
        <code>
          {commands.map(command => (
            <Box component="span" key={command} sx={{ display: 'block', whiteSpace: 'pre' }}>
              <Box component="span" sx={{ color: theme.palette.text.tertiary, userSelect: 'none' }}>
                ${' '}
              </Box>
              {command}
            </Box>
          ))}
        </code>
      </Box>
      <Tooltip title={isCopied ? '복사됨' : '복사'} placement="top">
        <IconButton aria-label="설치 명령 복사" size="small" onClick={handleCopy} sx={copyButtonStyle}>
          {isCopied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CopyableCommand;
