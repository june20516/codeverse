import Link from 'next/link';

export default function LeftSideBar({ menuList }: { menuList: { name: string; href: string }[] }) {
  return (
    <aside>
      <ul className="px-5">
        {menuList.map((menu, index) => (
          <li key={index} className="pt-4 border-b border-b-primary-900">
            <Link className="block w-full h-fulltext-lg text-lg" href={menu.href}>
              {menu.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
