'use client';

import { pageview } from '@/lib/gtag';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GtagNavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(`${pathname}${searchParams}`, window.location.origin);
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
