import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const NebulaDisk = ({
  size,
  depth,
  children,
}: {
  size: number;
  depth: number;
  children?: React.ReactNode;
}) => {
  const [everChangingDigitFlag, setEverChangingDigitFlag] = useState(0);

  const randomDigit = () => Math.floor(Math.random() * 10);

  const colors = ['#6366f1', '#a855f7', '#ec4899'];

  const radiusSequenceProps = (flag: number) => {
    const get = () => Math.max(flag * randomDigit(), 50);
    return {
      borderTopLeftRadius: `${get()}%`,
      borderTopRightRadius: `${get()}%`,
      borderBottomLeftRadius: `${get()}%`,
      borderBottomRightRadius: `${get()}%`,
    };
  };

  const translateSequenceProps = (flag: number) => {
    const get = () => (flag * randomDigit()) % 10;
    return {
      transform: `translate(${get() > 4.5 ? '' : '-'}${get()}px, ${
        get() > 4.5 ? '' : '-'
      }${get()}px)`,
    };
  };

  useEffect(() => {
    setEverChangingDigitFlag(randomDigit());
    let quantom = false;
    const frameInterval = setInterval(() => {
      setEverChangingDigitFlag(everChangingDigitFlag + randomDigit());
      quantom = !quantom;
    }, 3000);

    return () => clearInterval(frameInterval);
  }, []);

  return (
    <Box
      sx={{
        width: size,
        animation: 'spin 20s linear infinite',
        '@keyframes spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      }}>
      <Box
        sx={{
          transition: 'transform 10s',
          ...translateSequenceProps(everChangingDigitFlag),
        }}>
        <Box
          sx={{
            backgroundColor: colors[depth],
            aspectRatio: '1 / 1',
            transition: 'border-radius 5s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...radiusSequenceProps(everChangingDigitFlag),
          }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default NebulaDisk;
