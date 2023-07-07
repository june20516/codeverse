import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SpaceToday from './components/SpaceToday/SpaceToday';

const Home: NextPage = () => {
  return (
    <div className="p-5 w-full h-[100vw]">
      <SpaceToday />
    </div>
  );
};

export default Home;
