import { getAllTags } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import Link from 'next/link';
import SearchableTagPanel from './components/SearchableTagPanel';

const Tags: NextPage = () => {
  const tags: string[] = getAllTags();

  return <SearchableTagPanel tags={tags} />;
};

export default Tags;
