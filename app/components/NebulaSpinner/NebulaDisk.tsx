import { useEffect, useState } from 'react';

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
    const get = () => Math.max((flag * randomDigit()) % 10, 5);
    return `rounded-tl-[${get()}0%] rounded-tr-[${get()}0%] rounded-bl-[${get()}0%] rounded-br-[${get()}0%]`;
  };

  const translateSequenceProps = (flag: number) => {
    const get = () => (flag * randomDigit()) % 5;
    return `${get() > 4.5 ? '' : '-'}translate-x-[${get()}px] ${
      get() > 4.5 ? '' : '-'
    }translate-y-[${get()}px]`;
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
    <div
      style={{ width: size }}
      className={`animate-[spin 10s linear infinite] transition-transform duration-[5s] ${
        depth === 0 ? '' : translateSequenceProps(everChangingDigitFlag)
      }`}>
      <div
        style={{
          background: colors[depth],
        }}
        className={`aspect-square transition-[border-radius] ${radiusSequenceProps(
          everChangingDigitFlag,
        )} ease-linear duration-[3000ms] flex justify-center items-center`}>
        {children}
      </div>
    </div>
  );
};

export default NebulaDisk;
