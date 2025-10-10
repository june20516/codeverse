export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const DraftLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default DraftLayout;
