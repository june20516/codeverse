import { Box, List, ListItem, Typography } from '@mui/material';
import Link from 'next/link';

export default function MenuBar({ menuList }: { menuList: { name: string; href: string }[] }) {
  return (
    <Box
      component={'nav'}
      sx={{
        gridRowStart: 1,
        alignSelf: 'center',
      }}>
      <List sx={{ px: 5, display: 'flex', justifyContent: 'space-around' }}>
        {menuList.map((menu, index) => (
          <Link key={index} href={menu.href}>
            <ListItem sx={{ width: '100%', height: '100%' }}>
              <Typography variant="subtitle1">{menu.name}</Typography>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
}
