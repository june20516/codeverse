'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { getDateStringYyyymmdd } from '@/utils';
import { useAPODStore } from '@/app/stores/APOD';
import NebulaSpinner from '../NebulaSpinner/NebulaSpinner';

const APOD_KEY = 'dBC0DbFqNX7bRDz8NZiz7DAhMpgNhLlddt1kS0qj';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

/**
 *     "copyright": "\nMartin Pugh\n",
    "date": "2023-06-05",
    "explanation": "What's happening at the center of the Trifid Nebula? Three prominent dust lanes that give the Trifid its name all come together. Mountains of opaque dust appear near the bottom, while other dark filaments of dust are visible threaded throughout the nebula.  A single massive star visible near the center causes much of the Trifid's glow.  The Trifid, cataloged as M20, is only about 300,000 years old, making it among the youngest emission nebulas known.  The star forming nebula lies about 9,000 light years away toward the constellation of the Archer (Sagittarius). The region pictured here spans about 20 light years.    Portal Universe: Random APOD Generator",
    "hdurl": "https://apod.nasa.gov/apod/image/2306/Trifid_Pugh_2346.jpg",
    "media_type": "image",
    "service_version": "v1",
    "title": "In the Center of the Trifid Nebula",
    "url": "https://apod.nasa.gov/apod/image/2306/Trifid_Pugh_1080.jpg"
 */
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
          console.log('im fetching now...');
          if (!resJson['code']) {
            // success
            return resJson as APODProps;
          } else if (resJson['code'] >= 400 && resJson['code'] < 500) {
            //404, 400
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
    <div className="w-full flex flex-col items-center justify-center overflow-y-hidden space-y-5">
      <h1 className="text-2xl font-semibold">
        <a
          target="_blank"
          className="hover:text-primary-800"
          href={'https://apod.nasa.gov/apod/astropix.html'}>
          🔭 오늘의 우주 ({APOD.title}) 🌌
        </a>
      </h1>
      {fetched && <NebulaSpinner></NebulaSpinner>}
      {!fetched && APOD.media_type === 'video' && (
        <a href={APOD.url} target="_blank" className="relative">
          <Image
            src={'assets/icons/play.svg'}
            width={100}
            height={100}
            className="absolute top-[50%] left-[50%] mt-[-50px] ml-[-50px] rounded-[3rem] bg-primary-50 bg-opacity-30 opacity-50"
            alt="go to play"
          />
          <Image
            // width={768}
            // height={576}
            width={0}
            height={0}
            src={APOD.thumbnail_url as string}
            alt={APOD.title}
            loading="lazy"
            style={{ width: '768px', height: 'auto' }}
          />
        </a>
      )}
      {!fetched && APOD.media_type !== 'video' && (
        <a href={APOD.hdurl} target="_blank">
          <Image
            width={0}
            height={0}
            src={APOD.url}
            alt={APOD.title}
            loading="lazy"
            style={{ width: '768px', height: 'auto' }}
          />
        </a>
      )}
      <div className="flex flex-col items-center">
        <button onClick={() => setShowExplanation(!showExplanation)}>
          <p className="text-lg underline text-gray-500">
            설명 {showExplanation ? '접기' : '보기'} 💬
          </p>
        </button>
        <p className={`mt-5 ${showExplanation ? '' : 'hidden'}`}>{APOD.explanation}</p>
      </div>
    </div>
  );
};

export default SpaceToday;
