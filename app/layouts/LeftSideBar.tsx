import Link from 'next/link';

export default function LeftSideBar({ menuList }: { menuList: { name: string; href: string }[] }) {
  return (
    <aside>
      <ul>
        {menuList.map((menu, index) => (
          <li key={index} className="hover:backdrop-brightness-90">
            <Link className="block w-full h-full p-5 text-lg" href={menu.href}>
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
