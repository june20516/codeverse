'use client';

import TextInput from '@/app/components/Input';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TagToken from './TagToken';

const SearchableTagPanel = ({ tags }: { tags: string[] }) => {
  const [keyword, setKeyword] = useState('');
  const [searchedTags, setSearchedTags] = useState<string[]>([...tags]);

  useEffect(() => {
    setSearchedTags(tags.filter(tag => tag.includes(keyword)));
  }, [keyword, tags]);
  return (
    <div>
      <TextInput
        label="검색"
        onChange={e => setKeyword(e.target.value)}
        placeholder={'검색어 입력'}
      />
      <div className="flex flex-wrap p-5">
        {searchedTags.map((tag, index) => (
          <Link key={index} href={`tags/${tag}`}>
            <TagToken tag={tag} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchableTagPanel;
