'use client';

import { NextPage } from 'next';
import SpaceToday from './components/SpaceToday/SpaceToday';
import { Box } from '@mui/material';

const Home: NextPage = () => {
  return (
    <Box sx={{ width: '100%', p: 5 }}>
      <SpaceToday />
    </Box>
  );
};

export default Home;
