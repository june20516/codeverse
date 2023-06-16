'use client';

import { useEffect } from 'react';

export default function MarkdwonContainer({ content }: { content: string }) {
  return <div className="markdown-body post" dangerouslySetInnerHTML={{ __html: content }} />;
}
