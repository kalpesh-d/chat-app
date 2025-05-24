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
  { icon: AiFillHome, text: "Home", active: true, href: "/", divider: true },
  { icon: BsChatDotsFill, text: "Chats", href: "/" },
  { icon: IoTicket, text: "Ticket", href: "/" },
  { icon: GoGraph, text: "Analytics", href: "/", divider: true },
  { icon: IoListSharp, text: "Lists", href: "/" },
  { icon: HiMegaphone, text: "Announcements", href: "/" },
  {
    icon: TiFlowMerge,
    text: "Connections",
    href: "/connections",
    divider: true,
  },
  { icon: RiContactsBookFill, text: "Contacts", href: "/" },
  { icon: RiFolderImageFill, text: "Gallery", href: "/", divider: true },
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
          {item.divider && (
            <hr className="border-b border-[0.8px] border-gray-200 my-2"></hr>
          )}
        </React.Fragment>
      ))}
    </Sidebar>
  );
};

export default SidebarItems;
