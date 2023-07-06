import { MouseEventHandler } from 'react';

const Button = ({
  size = 'sm',
  color = 'primary',
  children,
  onClick,
}: {
  size: Size;
  children: React.ReactNode;
  color: Color;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button className={`text-${size} text-${color}-700`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
