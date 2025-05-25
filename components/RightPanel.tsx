import React from "react";
import { RiListSettingsLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { MdAlternateEmail } from "react-icons/md";
import { RiFolderImageFill } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import {
  CollapseIcon,
  MembersIcon,
  OverviewIcon,
  PropertiesIcon,
} from "./Icon";
import { FaHubspot } from "react-icons/fa";

const menuItems = [
  { icon: CollapseIcon },
  { icon: LuRefreshCw },
  { icon: FiEdit3 },
  { icon: OverviewIcon },
  { icon: PropertiesIcon },
  { icon: FaHubspot },
  { icon: MembersIcon },
  { icon: MdAlternateEmail },
  { icon: RiFolderImageFill },
  { icon: RiListSettingsLine },
];

const RightPanel = () => {
  return (
    <aside className="w-14 border-l pt-10 border-gray-200 p-2 flex flex-col gap-4 h-full min-h-[91vh]">
      {menuItems.map(
        (item, index) =>
          item.icon && (
            <button
              key={index}
              className="w-full p-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-gray-400 flex items-center justify-center relative"
            >
              <item.icon className="h-5 w-5" />
            </button>
          )
      )}
    </aside>
  );
};

export default RightPanel;
