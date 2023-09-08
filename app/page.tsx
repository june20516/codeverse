import { NextPage } from 'next';
import SpaceToday from './components/SpaceToday/SpaceToday';

const Home: NextPage = () => {
  return (
    <div className="w-full p-5">
      <SpaceToday />
    </div>
  );
};

export default Home;
