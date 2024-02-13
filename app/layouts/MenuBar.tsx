import Link from 'next/link';

export default function LeftSideBar({ menuList }: { menuList: { name: string; href: string }[] }) {
  return (
    <nav className="self-center">
      <ul className="px-5 flex justify-around">
        {menuList.map((menu, index) => (
          <li key={index} className="">
            <Link className="block w-full h-fulltext-lg text-lg" href={menu.href}>
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
