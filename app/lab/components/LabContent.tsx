'use client';

import { getLabItems } from '@/lib/labData';
import LabListItem from './LabListItem';
import { Box } from '@mui/material';

const LabContent = () => {
  const labItems = getLabItems();

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
    },
    gap: { xs: 3, sm: 4 },
    p: 0,
    m: 0,
    listStyle: 'none',
  };

  return (
    <Box component="ul" sx={gridStyle}>
      {labItems.map((item) => (
        <Box component="li" key={item.id}>
          <LabListItem item={item} />
        </Box>
      ))}
    </Box>
  );
};

export default LabContent;
