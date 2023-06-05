import { PostType } from '@/interfaces/PostType';
import { getAllPosts } from '@/lib/api';
import { NextPage } from 'next';
import Image from 'next/image'

// const Home: NextPage<{ posts: PostType[] }> = ({ posts }) => {
const Home: NextPage = () => {
  const posts = getAllPosts(['slug', 'title', 'date', 'author']);
  return (
    <ul>
      {posts.map((post, index) => (
        <li key={index}>{post.title} - {post.author}</li>
      ))}
    </ul>
  );
};

// export async function getStaticProps() {
//   const posts = getAllPosts(['slug', 'title', 'date']);

//   return {
//     props: {
//       posts,
//     },
//   };
// }

export default Home;   
