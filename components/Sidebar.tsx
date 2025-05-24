"use client";

import Link from "next/link";
import React, { createContext, useContext, useState } from "react";
import { IconType } from "react-icons";
import { TbLayoutSidebarLeftExpandFilled, TbStarsFilled } from "react-icons/tb";
import { UrlObject } from "url";

interface SidebarItemProps {
  icon: IconType;
  title: string;
  active?: boolean;
  href: string | UrlObject;
}

const SidebarContext = createContext<{
  expanded: boolean;
}>({
  expanded: false,
});

const Sidebar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r border-gray-200">
        <div className="p-3">
          <img src="/periskope.svg" alt="Logo" className="h-8" />
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 p-2">{children}</ul>
        </SidebarContext.Provider>

        <div className="flex flex-col gap-y-4 px-3 py-2">
          <TbStarsFilled
            size="1.3em"
            className="text-gray-600 cursor-pointer"
          />

          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <TbLayoutSidebarLeftExpandFilled
                size="1.3em"
                className="text-gray-600 cursor-pointer"
              />
            ) : (
              <TbLayoutSidebarLeftExpandFilled
                size="1.3em"
                className="text-gray-600 cursor-pointer rotate-180"
              />
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  title,
  active,
  href,
}) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link href={href}>
      <li
        className={`
        relative flex items-center p-2 my-1 
        font-medium rounded-md cursor-pointer 
        transition-colors group ${active ? "bg-gray-200 " : "hover:bg-gray-100"}
        `}
      >
        <Icon
          size="1.3em"
          className={`text-gray-600 ${active ? "text-green-700" : ""}`}
        />
        <span
          className={`overflow-hidden transition-all text-sm shadow-xl ${
            expanded ? "w-30 ml-1.5" : "w-0"
          }`}
        >
          {title}
        </span>
        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-100 text-gray-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 shadow-md
        `}
          >
            {title}
          </div>
        )}
      </li>
    </Link>
  );
};

export default Sidebar;
