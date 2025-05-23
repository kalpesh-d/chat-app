import React from "react";

import { BsChatDotsFill } from "react-icons/bs";
import { TbRefreshDot } from "react-icons/tb";

const Header = () => {
  return (
    <header className="p-4 border-b border-gray-200 flex justify-between">
      <div className="flex items-center">
        <BsChatDotsFill className="text-gray-500" />
        <span className="ml-2 text-xs font-bold text-gray-500 tracking-tight">
          chats
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center text-sm text-black font-medium px-3 py-1 border border-gray-300 rounded-sm hover:bg-gray-100 transition duration-200 gap-1">
          <TbRefreshDot size="1.4em" /> Refresh
        </button>
        <button className="flex items-center text-sm text-black font-medium px-3 py-1 border border-gray-300 rounded-sm hover:bg-gray-100 transition duration-200 gap-1">
          <TbRefreshDot size="1.4em" /> Help
        </button>
        <button className="flex items-center text-sm text-black font-medium px-3 py-1 border border-gray-300 rounded-sm hover:bg-gray-100 transition duration-200 gap-1">
          <TbRefreshDot size="1.4em" />
          5/6 Phones
          <TbRefreshDot size="1.4em" />
        </button>
        <button className="flex items-center text-sm text-black font-medium px-2 py-1 border border-gray-300 rounded-sm hover:bg-gray-100 transition duration-200 gap-1">
          <TbRefreshDot size="1.4em" />
        </button>
        <button className="flex items-center text-sm text-black font-medium px-2 py-1 border border-gray-300 rounded-sm hover:bg-gray-100 transition duration-200 gap-1">
          <TbRefreshDot size="1.4em" />
        </button>
        <button className="flex items-center text-sm text-black font-medium px-2 py-1 border border-gray-300 rounded-sm hover:bg-gray-100 transition duration-200 gap-1">
          <TbRefreshDot size="1.4em" />
        </button>
      </div>
    </header>
  );
};

export default Header;
