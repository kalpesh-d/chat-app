import Image from "next/image";
import { TbLayoutSidebarLeftExpandFilled, TbStarsFilled } from "react-icons/tb";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

const Sidebar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Image
            src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg"
            width="200"
            height="200"
            alt="Logo"
          />
        </div>
        <ul className="flex-1 px-3">{children}</ul>
        <div className="flex flex-col gap-4 p-3">
          <TbStarsFilled size="1.5em" className="text-gray-600" />

          <TbLayoutSidebarLeftExpandFilled
            size="1.5em"
            className="text-gray-600"
          />
        </div>
      </nav>
    </aside>
  );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active,
  alert,
}) => {
  return (
    <li className="flex items-center">
      {icon}
      <span>{text}</span>
    </li>
  );
};

export default Sidebar;
