'use client';

export const GA_MEASUREMENT_ID: string = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] as string;

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

type PageViewParams = {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL, params?: PageViewParams) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    url,
    ...(params || {}),
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 외부 링크 클릭 추적
export const trackExternalLink = (url: string) => {
  window.gtag('event', 'click', {
    event_category: 'external_link',
    event_label: url,
  });
};

// 내부 링크 클릭 추적
export const trackInternalLink = (url: string) => {
  window.gtag('event', 'click', {
    event_category: 'internal_link',
    event_label: url,
  });
};
