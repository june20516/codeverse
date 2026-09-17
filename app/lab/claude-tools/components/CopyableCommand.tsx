'use client';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

const COPIED_FEEDBACK_DURATION_MS = 1500;
const MONOSPACE_FONT_FAMILY = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

interface CopyableCommandProps {
  label: string;
  commands: string[];
}

const CopyableCommand = ({ label, commands }: CopyableCommandProps) => {
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
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
  };

  // 복사 버튼을 명령어 영역 밖에 두어, 긴 명령을 가로 스크롤해도 겹치지 않게 한다
  const toolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    pl: 2,
    pr: 1,
    py: 0.5,
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  const labelStyle = {
    color: theme.palette.text.tertiary,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  const copyButtonStyle = {
    color: isCopied ? theme.palette.success.main : theme.palette.text.secondary,
    '&:hover': {
      color: isCopied ? theme.palette.success.main : theme.palette.text.primary,
    },
  };

  const preStyle = {
    m: 0,
    px: 2,
    py: 1.5,
    overflowX: 'auto',
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: '0.8125rem',
    lineHeight: 1.8,
    color: theme.palette.text.primary,
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={toolbarStyle}>
        <Typography variant="micro" component="span" sx={labelStyle}>
          {label}
        </Typography>
        <Tooltip title={isCopied ? '복사됨' : '복사'} placement="top">
          <IconButton aria-label={`${label} 명령 복사`} size="small" onClick={handleCopy} sx={copyButtonStyle}>
            {isCopied ? <CheckRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
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
    </Box>
  );
};

export default CopyableCommand;
