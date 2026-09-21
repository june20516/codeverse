'use client';

import { Box, Link, Typography } from '@mui/material';

import { SeriesEntry, SeriesNavigation } from '@/interfaces/PostType';

interface SeriesProps {
  series: SeriesNavigation;
}

const buildPostPath = (entry: SeriesEntry) => `/posts/${entry.slug}`;

export const SeriesIndex = ({ series }: SeriesProps) => {
  const currentPosition = series.entries.findIndex(entry => entry.isCurrent) + 1;

  return (
    <Box
      component="nav"
      aria-label="시리즈 목차"
      sx={{
        mb: { xs: 6, sm: 8 },
        p: { xs: 2.5, sm: 3 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 2,
          mb: 1.5,
        }}>
        <Typography variant="label" component="p">
          {series.name}
        </Typography>
        <Typography variant="micro" component="span" sx={{ color: 'text.tertiary', flexShrink: 0 }}>
          {currentPosition} / {series.entries.length}
        </Typography>
      </Box>
      <Box component="ol" sx={{ m: 0, pl: 3, '& > li + li': { mt: 0.5 } }}>
        {series.entries.map(entry => (
          <Typography
            key={entry.slug}
            variant="small"
            component="li"
            aria-current={entry.isCurrent ? 'page' : undefined}
            sx={{
              color: entry.isCurrent ? 'text.primary' : 'text.secondary',
              fontWeight: entry.isCurrent ? 600 : 400,
            }}>
            {entry.isCurrent ? (
              entry.title
            ) : (
              <Link href={buildPostPath(entry)} color="inherit" underline="hover">
                {entry.title}
              </Link>
            )}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

interface SeriesPagerLinkProps {
  entry: SeriesEntry;
  direction: 'previous' | 'next';
}

const SeriesPagerLink = ({ entry, direction }: SeriesPagerLinkProps) => {
  const isNext = direction === 'next';

  return (
    <Link
      href={buildPostPath(entry)}
      color="inherit"
      underline="none"
      sx={{
        gridColumn: { sm: isNext ? 2 : 1 },
        display: 'block',
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        textAlign: isNext ? 'right' : 'left',
        '&:hover': { backgroundColor: 'action.hover' },
      }}>
      <Typography
        variant="micro"
        component="span"
        sx={{ display: 'block', mb: 0.5, color: 'text.tertiary' }}>
        {isNext ? '다음 편 →' : '← 이전 편'}
      </Typography>
      <Typography variant="small" component="span" sx={{ display: 'block' }}>
        {entry.title}
      </Typography>
    </Link>
  );
};

export const SeriesPager = ({ series }: SeriesProps) => {
  if (!series.previous && !series.next) return null;

  return (
    <Box
      component="nav"
      aria-label="시리즈 이전·다음 편"
      sx={{
        mt: 8,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
      }}>
      {series.previous && <SeriesPagerLink entry={series.previous} direction="previous" />}
      {series.next && <SeriesPagerLink entry={series.next} direction="next" />}
    </Box>
  );
};
