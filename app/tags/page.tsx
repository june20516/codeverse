import { getAllTags } from '@/lib/staticFileApi';
import { NextPage } from 'next';
import SearchableTagPanel from './components/SearchableTagPanel';

const Tags: NextPage = () => {
  const tags: string[] = getAllTags();

  return <SearchableTagPanel tags={tags} />;
};

export default Tags;
