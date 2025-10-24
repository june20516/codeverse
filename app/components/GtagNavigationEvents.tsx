'use client';

import { pageview } from '@/lib/gtag';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function GtagNavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstVisit = useRef(true);

  useEffect(() => {
    const url = new URL(`${pathname}${searchParams}`, window.location.origin);

    // 첫 방문 시에만 referrer와 UTM 파라미터를 pageview에 포함
    if (isFirstVisit.current) {
      const params = {
        referrer: document.referrer || undefined,
        utm_source: searchParams.get('utm_source') || undefined,
        utm_medium: searchParams.get('utm_medium') || undefined,
        utm_campaign: searchParams.get('utm_campaign') || undefined,
      };

      pageview(url, params);
      isFirstVisit.current = false;
    } else {
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}
