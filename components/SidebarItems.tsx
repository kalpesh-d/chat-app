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
  { icon: AiFillHome, title: "Home", href: "/", divider: true },
  { icon: BsChatDotsFill, title: "Chats", href: "/", active: true },
  { icon: IoTicket, title: "Ticket", href: "/" },
  { icon: GoGraph, title: "Analytics", href: "/", divider: true },
  { icon: IoListSharp, title: "Lists", href: "/" },
  { icon: HiMegaphone, title: "Announcements", href: "/" },
  {
    icon: TiFlowMerge,
    title: "Connections",
    href: "/",
    divider: true,
  },
  { icon: RiContactsBookFill, title: "Contacts", href: "/" },
  { icon: RiFolderImageFill, title: "Gallery", href: "/", divider: true },
  { icon: MdChecklist, title: "Checklist", href: "/" },
  { icon: IoIosSettings, title: "Settings", href: "/" },
];

const SidebarItems = () => {
  return (
    <Sidebar>
      {sidebarItems.map((item, index) => (
        <React.Fragment key={index}>
          <SidebarItem
            icon={item.icon}
            title={item.title}
            active={item.active}
            href={item.href}
          />
          {item.divider && (
            <hr className="border-b border-[0.8px] border-gray-200 my-2"></hr>
          )}
        </React.Fragment>
      ))}
    </Sidebar>
  );
};

export default SidebarItems;
