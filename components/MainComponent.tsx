"use client";
import ChatUi from "./ChatUi";
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
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const supabase = createClient();

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    // Reset unread count for selected user
    setUnreadCounts((prev) => {
      if (prev[user.id]) {
        const copy = { ...prev };
        delete copy[user.id];
        return copy;
      }
      return prev;
    });
  };

  const updateUserListOnNewMessage = useCallback(
    (newMessage: any) => {
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

      // Update unread count if message is from other user and not currently selected
      if (selectedUser && senderId !== selectedUser.id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    },
    [selectedUser]
  );

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
          <UserList
            key={user.id}
            user={user}
            onClick={handleSelectUser}
            unreadCount={unreadCounts[user.id] || 0}
          />
        ))}
      </div>

      <div className="w-full">
        <ChatUi selectedUser={selectedUser} />
      </div>
    </section>
  );
};

export default MainComponent;
