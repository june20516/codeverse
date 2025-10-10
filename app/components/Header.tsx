'use client';

import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  href: string;
}

interface HeaderProps {
  menuList?: MenuItem[];
}

const Header = ({ menuList = [] }: HeaderProps) => {
  const theme = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Background layer styles
  const backgroundImageLayer = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(/assets/images/default-thumbnail.jpg)',
    backgroundSize: '120%',
    backgroundPosition: 'center',
    opacity: 1,
    zIndex: 0,
    animation: 'headerBackgroundFloat 300s ease-in-out infinite',
    '@keyframes headerBackgroundFloat': {
      '0%, 100%': {
        backgroundPosition: 'center top',
      },
      '50%': {
        backgroundPosition: 'center bottom',
      },
    },
  };

  const overlayLayer = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    opacity: 0.65,
    zIndex: 1,
  };

  const headerContainerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
    '&::before': backgroundImageLayer,
    '&::after': overlayLayer,
  };

  const contentContainerStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1024px',
    mx: 'auto',
    px: { xs: 3, sm: 4, md: 6 },
    py: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  };

  const logoTextStyle = {
    color: theme.palette.text.primary,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    '&:hover': {
      color: theme.palette.text.secondary,
    },
    transition: 'color 0.2s ease',
  };

  const navigationContainerStyle = {
    display: 'flex',
    gap: { xs: 2, sm: 3 },
    alignItems: 'center',
  };

  const getNavLinkStyle = (isActive: boolean) => ({
    color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
    fontWeight: isActive ? 500 : 400,
    fontSize: '0.875rem',
    '&:hover': {
      color: theme.palette.text.primary,
    },
    transition: 'color 0.2s ease',
  });

  return (
    <Box component="header" sx={headerContainerStyle}>
      <Box sx={contentContainerStyle}>
        {/* Logo */}
        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Box sx={logoContainerStyle}>
            {/* Icon - SVG inline */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="6" fill="url(#gradient)" />
              <text
                x="16"
                y="22"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="18"
                fontWeight="700"
                fill="white"
                textAnchor="middle"
                letterSpacing="-0.02em">
                B
              </text>
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            <Typography variant="h6" sx={logoTextStyle}>
              Codeverse
            </Typography>
          </Box>
        </Link>

        {/* Navigation */}
        {menuList.length > 0 && (
          <Box component="nav" sx={navigationContainerStyle}>
            {menuList.map((menu, index) => {
              const active = isActive(menu.href);
              return (
                <Link key={index} href={menu.href} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={getNavLinkStyle(active)}>
                    {menu.name}
                  </Typography>
                </Link>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
