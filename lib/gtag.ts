'use client';

export const GA_MEASUREMENT_ID: string = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] as string;

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  console.log('ga_measurement_id', GA_MEASUREMENT_ID);
  console.log('window.gtag', window.gtag);
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
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
