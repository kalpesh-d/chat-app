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
  { icon: AiFillHome, text: "Home", active: true },
  { icon: BsChatDotsFill, text: "Chats", alert: true },
  { icon: IoTicket, text: "Ticket" },
  { icon: GoGraph, text: "Analytics" },
  { icon: IoListSharp, text: "Lists" },
  { icon: HiMegaphone, text: "Announcements" },
  { icon: TiFlowMerge, text: "Connections" },
  { icon: RiContactsBookFill, text: "Contacts" },
  { icon: RiFolderImageFill, text: "Gallery" },
  { icon: MdChecklist, text: "Checklist" },
  { icon: IoIosSettings, text: "Settings" },
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
            alert={item.alert}
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
