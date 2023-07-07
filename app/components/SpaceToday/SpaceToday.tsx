'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
interface APODProps {
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
  const yyyymmdd = useMemo(
    () =>
      `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
        .getDate()
        .toString()
        .padStart(2, '0')}`,
    [today],
  );

  const defaultAPOD = useMemo<APODProps>(
    () => ({
      copyright: '',
      date: yyyymmdd,
      explanation: 'image of "Astronomic Picture Of the Day"',
      media_type: 'image',
      title: 'loading..',
      url: 'assets/images/placeholder-768x576.png',
      service_version: '',
    }),
    [yyyymmdd],
  );

  const [APODImgSrc, setAPODImgSrc] = useState<APODProps>(defaultAPOD);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const url = useMemo(() => {
    console.log('url');
    const hostNameUrl = new URL(APOD_URL);
    const params = hostNameUrl.searchParams;

    params.append('date', yyyymmdd);
    params.append('api_key', APOD_KEY);
    params.append('thumbs', 'true');
    return hostNameUrl;
  }, [yyyymmdd]);

  const getAPOD = useCallback(async () => {
    return fetch(url)
      .then(async res => {
        return (await res.json()) as APODProps;
      })
      .catch(error => defaultAPOD);
  }, [defaultAPOD, url]);

  const setAPODAsync = useCallback(async () => {
    getAPOD().then(data => setAPODImgSrc(data));
  }, [getAPOD]);

  useEffect(() => {
    setAPODAsync();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-y-hidden space-y-5">
      <h1 className="text-2xl font-semibold hover:text-primary-800">
        <a target="_blank" href={'https://apod.nasa.gov/apod/archivepix.html'}>
          🔭 오늘의 우주 🌌 (<span className="text-lg font-semibold">{APODImgSrc.title}</span>)
        </a>
      </h1>
      {APODImgSrc.media_type === 'image' ? (
        <a href={APODImgSrc.hdurl} target="_blank">
          {' '}
          <Image width={768} height={576} src={APODImgSrc.url} alt={APODImgSrc.title} />
        </a>
      ) : (
        <a href={APODImgSrc.url} target="_blank" className="relative">
          <Image
            src={'assets/icons/play.svg'}
            width={100}
            height={100}
            className="absolute top-[50%] left-[50%] mt-[-50px] ml-[-50px] rounded-[3rem] bg-primary-50 bg-opacity-30 opacity-50"
            alt="go to play"
          />
          <Image
            width={768}
            height={576}
            src={APODImgSrc.thumbnail_url as string}
            alt={APODImgSrc.title}
          />
        </a>
      )}
      <div className="flex flex-col items-center">
        <button onClick={() => setShowExplanation(true)}>
          <p className="text-lg underline text-gray-500">설명 보기 💬</p>
        </button>
        <p className={`mt-5 ${showExplanation ? '' : 'hidden'}`}>{APODImgSrc.explanation}</p>
      </div>
    </div>
  );
};

export default SpaceToday;
