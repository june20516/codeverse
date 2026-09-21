'use client';

import { Box, Input } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import TagToken from './TagToken';

const SearchableTagPanel = ({ tags }: { tags: string[] }) => {
  const [keyword, setKeyword] = useState('');
  const [searchedTags, setSearchedTags] = useState<string[]>([...tags]);

  useEffect(() => {
    setSearchedTags(tags.filter(tag => tag.toLowerCase().includes(keyword.toLowerCase())));
  }, [keyword, tags]);
  return (
    <Box>
      <Input placeholder="검색어 입력" onChange={e => setKeyword(e.target.value)} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', py: 5 }}>
        {searchedTags.map((tag, index) => (
          <Link key={index} href={`/tags/${tag.toLowerCase()}`}>
            <TagToken tag={tag} />
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default SearchableTagPanel;
