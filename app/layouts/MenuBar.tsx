'use client';

import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MenuBar({ menuList }: { menuList: { name: string; href: string }[] }) {
  const theme = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <Box
      component="nav"
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        mb: 4,
      }}>
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          '::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}>
        {menuList.map((menu, index) => {
          const active = isActive(menu.href);
          return (
            <Link key={index} href={menu.href} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  py: 2,
                  borderBottom: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
                    fontWeight: active ? 500 : 400,
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      color: theme.palette.text.primary,
                    },
                    transition: 'color 0.2s ease',
                  }}>
                  {menu.name}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
