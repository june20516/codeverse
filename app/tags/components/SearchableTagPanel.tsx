'use client';

import TextInput from '@/app/components/Input';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
      <div className="p-5 flex flex-wrap">
        {searchedTags.map((tag, index) => (
          <Link key={index} href={`tags/${tag}`}>
            <code className=" bg-background-primary-200 text-primary-700 rounded-md px-1 m-2">
              {tag}
            </code>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchableTagPanel;
