"use client";
import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { AiFillHome } from "react-icons/ai";
import { BsChatDotsFill } from "react-icons/bs";
import { IoTicket, IoListSharp } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { HiMegaphone } from "react-icons/hi2";
import { TiFlowMerge } from "react-icons/ti";
import { RiContactsBookFill, RiFolderImageFill } from "react-icons/ri";
import { MdChecklist } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

const sidebarItems = [
  { icon: AiFillHome, text: "Home", active: true, href: "/" },
  { icon: BsChatDotsFill, text: "Chats", href: "/" },
  { icon: IoTicket, text: "Ticket", href: "/" },
  { icon: GoGraph, text: "Analytics", href: "/" },
  { icon: IoListSharp, text: "Lists", href: "/" },
  { icon: HiMegaphone, text: "Announcements", href: "/" },
  { icon: TiFlowMerge, text: "Connections", href: "/connections" },
  { icon: RiContactsBookFill, text: "Contacts", href: "/" },
  { icon: RiFolderImageFill, text: "Gallery", href: "/" },
  { icon: MdChecklist, text: "Checklist", href: "/" },
  { icon: IoIosSettings, text: "Settings", href: "/" },
];

const SidebarItems = () => {
  return (
    <Sidebar>
      {sidebarItems.map((item, index) => (
        <React.Fragment key={index}>
          <SidebarItem
            icon={item.icon}
            text={item.text}
            active={item.active}
            href={item.href}
          />
          {/* Add a border between items */}
          {(item.text === "Home" ||
            item.text === "Analytics" ||
            item.text === "Connections" ||
            item.text === "Gallery") && (
            <div className="border-b border-gray-300 my-2"></div>
          )}
        </React.Fragment>
      ))}
    </Sidebar>
  );
};

export default SidebarItems;
