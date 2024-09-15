import Link from 'next/link';
import Image from 'next/image';
import { Box, Typography, Theme, useTheme } from '@mui/material';
import { SystemStyleObject } from '@mui/system';

interface HeaderProps {
  layoutStyle?: SystemStyleObject<Theme>;
}

const Header = ({ layoutStyle }: HeaderProps) => {
  const theme = useTheme();
  const headerStyles = styles(theme);
  return (
    <Box component="header" sx={[headerStyles.header, layoutStyle ?? {}]}>
      <Link href="/" passHref>
        <Box sx={headerStyles.content}>
          <Box sx={headerStyles.icon}>
            <Image src="/assets/images/codeverse_icon.png" fill alt="icon of codeverse" />
          </Box>
          <Typography variant="h1">Codeverse</Typography>
        </Box>
      </Link>
    </Box>
  );
};

const styles: (theme: Theme) => Record<string, SystemStyleObject<Theme>> = theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    px: '2rem',
    bgcolor: 'white',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  icon: {
    position: 'relative',
    aspectRatio: '1',
    width: '2.5rem',
  },
});

export default Header;