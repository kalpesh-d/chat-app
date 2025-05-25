"use client";
import ChatUi from "./ChatUi";
import SidebarItems from "./SidebarItems";
import UserList from "./UserList";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  last_message_time?: string;
}

interface UserListProps {
  userList: User[];
}

const MainComponent = ({ userList }: UserListProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortedUsers, setSortedUsers] = useState<User[]>(userList);
  const supabase = createClient();

  const handleSelectUser = (user: User) => setSelectedUser(user);

  const updateUserListOnNewMessage = useCallback((newMessage: any) => {
    const senderId = newMessage.sender_id;
    const receiverId = newMessage.receiver_id;
    const timestamp = newMessage.created_at;

    setSortedUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.id === senderId || user.id === receiverId) {
          return { ...user, last_message_time: timestamp };
        }
        return user;
      });

      return [...updatedUsers].sort((a, b) => {
        return (
          new Date(b.last_message_time || 0).getTime() -
          new Date(a.last_message_time || 0).getTime()
        );
      });
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          updateUserListOnNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, updateUserListOnNewMessage]);

  return (
    <section className="flex min-h-[91vh]">
      <div className="max-w-sm w-full border-r border-gray-200">
        {sortedUsers.map((user) => (
          <UserList user={user} key={user.id} onClick={handleSelectUser} />
        ))}
      </div>

      <div className="w-full">
        <ChatUi selectedUser={selectedUser} />
      </div>
      {/* <div className="border-l">
        <SidebarItems />
      </div> */}
    </section>
  );
};

export default MainComponent;
