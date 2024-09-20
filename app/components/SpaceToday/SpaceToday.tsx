'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getDateStringYyyymmdd } from '@/utils';
import { useAPODStore } from '@/app/stores/APOD';
import NebulaSpinner from '../NebulaSpinner/NebulaSpinner';
import { Box, Typography, Button, Link } from '@mui/material';

const APOD_KEY = 'dBC0DbFqNX7bRDz8NZiz7DAhMpgNhLlddt1kS0qj';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

export interface APODProps {
  copyright: string;
  date: string;
  explanation: string;
  media_type: string;
  title: string;
  url: string;
  hdurl?: string;
  thumbnail_url?: string;
  service_version: string;
}

const SpaceToday = () => {
  const today = useMemo(() => new Date(), []);

  const defaultAPOD = useMemo<APODProps>(
    () => ({
      copyright: '',
      date: getDateStringYyyymmdd(today),
      explanation: 'image of "Astronomic Picture Of the Day"',
      media_type: 'image',
      title: 'loading..',
      url: 'assets/images/placeholder-768x576.png',
      service_version: '',
    }),
    [today],
  );

  const { APOD, setAPOD, fetchedDate, fetched } = useAPODStore();
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const getUrl = useCallback((date: Date) => {
    const hostNameUrl = new URL(APOD_URL);
    const params = hostNameUrl.searchParams;

    params.append('date', getDateStringYyyymmdd(date));
    params.append('api_key', APOD_KEY);
    params.append('thumbs', 'true');
    return hostNameUrl;
  }, []);

  const fetchAPOD = useCallback(
    async (date: Date) => {
      return fetch(getUrl(date))
        .then(async res => {
          const resJson = await res.json();
          if (!resJson['code']) {
            // success
            return resJson as APODProps;
          } else if (resJson['code'] >= 400 && resJson['code'] < 500) {
            throw resJson;
          } else {
            return defaultAPOD;
          }
        })
        .catch(error => {
          throw error;
        });
    },
    [defaultAPOD, getUrl],
  );

  const setAPODAsync = useCallback(
    async (date: Date) => {
      fetchAPOD(date)
        .then(data => setAPOD(data))
        .catch(error => {
          if ([404, 400].includes(error['code'])) {
            setAPODAsync(new Date(date.setDate(date.getDate() - 1)));
          }
        });
    },
    [fetchAPOD],
  );

  useEffect(() => {
    if (!fetched || fetchedDate.getDate() !== today.getDate()) setAPODAsync(today);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'hidden',
        gap: 2,
      }}>
      <Typography variant="h1" color="primary" fontWeight="bold">
        <Link
          href="https://apod.nasa.gov/apod/astropix.html"
          target="_blank"
          underline="none"
          sx={{ color: 'inherit' }}>
          오늘의 우주
        </Link>
      </Typography>

      {!fetched && <NebulaSpinner />}

      {fetched && APOD.media_type === 'video' && (
        <Link href={APOD.url} target="_blank" sx={{ position: 'relative' }}>
          <Image
            src={'assets/icons/play.svg'}
            width={100}
            height={100}
            alt="go to play"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-50px',
              marginLeft: '-50px',
              borderRadius: '3rem',
              backgroundColor: 'rgba(0, 0, 255, 0.3)',
              opacity: 0.5,
            }}
          />
          <Image
            width={768}
            height={0}
            src={APOD.thumbnail_url as string}
            alt={APOD.title}
            loading="lazy"
            style={{ width: '768px', height: 'auto' }}
          />
        </Link>
      )}

      {fetched && APOD.media_type !== 'video' && (
        <Link href={APOD.hdurl} target="_blank">
          <Image
            width={768}
            height={0}
            src={APOD.url}
            alt={APOD.title}
            loading="lazy"
            style={{ width: '768px', height: 'auto' }}
          />
        </Link>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button onClick={() => setShowExplanation(!showExplanation)}>
          <Typography variant="h2" color="secondary">
            {APOD.title}
          </Typography>
        </Button>

        <Typography
          variant="body2"
          sx={{ marginTop: 2, display: showExplanation ? 'block' : 'none' }}>
          {APOD.explanation}
        </Typography>
      </Box>
    </Box>
  );
};

export default SpaceToday;
