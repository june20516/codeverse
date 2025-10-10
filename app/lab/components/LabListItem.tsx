'use client';

import { LabItem } from '@/lib/labData';
import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { getMetaThumbnail } from '@/lib/meta';

interface LabListItemProps {
  item: LabItem;
}

const LabListItem = ({ item }: LabListItemProps) => {
  const theme = useTheme();
  const thumbnail = getMetaThumbnail(item.thumbnail);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      borderColor: theme.palette.text.tertiary,
    },
    '&:hover .lab-title': {
      color: theme.palette.primary.main,
    },
  };

  const thumbnailContainerStyle = {
    width: '100%',
    paddingTop: '66.67%', // 3:2 aspect ratio
    position: 'relative',
    backgroundColor: theme.palette.grey[100],
    overflow: 'hidden',
  };

  const thumbnailImageStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  };

  const contentStyle = {
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  };

  return (
    <Link href={item.path} style={{ textDecoration: 'none' }}>
      <Box sx={cardStyle}>
        {/* Thumbnail */}
        <Box sx={thumbnailContainerStyle}>
          <img src={thumbnail} alt={item.title} style={thumbnailImageStyle} />
        </Box>

        {/* Content */}
        <Box sx={contentStyle}>
          <Typography
            className="lab-title"
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              transition: 'color 0.2s ease',
              fontSize: theme.typography.h6.fontSize,
            }}>
            {item.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
            }}>
            {item.description}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              mt: 1,
            }}>
            {item.createdAt}
          </Typography>

          {item.features && item.features.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
              {item.features.map((feature, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.text.secondary,
                  }}>
                  {feature}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Link>
  );
};

export default LabListItem;
