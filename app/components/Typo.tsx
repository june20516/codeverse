const Typo = ({
  size = 'sm',
  color = 'primary',
  children,
}: {
  size: Size;
  children: React.ReactNode;
  color: Color;
}) => {
  return <span className={`text-${size} text-${color}-900`}>{children}</span>;
};

export default Typo;
