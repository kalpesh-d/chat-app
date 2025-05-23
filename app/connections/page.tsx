"use client";
import SidebarItems from "../components/SidebarItems";
import Header from "../components/Header";
import { AddUserChat } from "../components/AddUserChat";

export default function Page() {
  const handleNewChat = (chatId: string) => {
    // navigate or update chat list state
    console.log("New or existing chat ID:", chatId);
    // optionally redirect to the chat window
  };

  return (
    <section className="flex">
      <SidebarItems />

      <div className="w-full">
        <Header />
        <section className="flex">
          <AddUserChat onChatCreated={handleNewChat} />
        </section>
      </div>

      <div className="border-l"></div>
    </section>
  );
}
