"use client";
import ChatUi from "./ChatUi";
import UserList from "./UserList";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserList, User } from "@/utils/supabase/hooks";

const MainComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          full_name: String(
            user.user_metadata?.full_name || user.email || "User"
          ),
          email: String(user.email || ""),
          avatar_url: String(
            user.user_metadata?.avatar_url || "/default-avatar.png"
          ),
        });
      }
    };
    fetchCurrentUser();
  }, []);

  const { users: sortedUsers, loading } = useUserList(currentUser);

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
    const channel = createClient()
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
      createClient().removeChannel(channel);
    };
  }, [updateUserListOnNewMessage]);

  return (
    <section className="flex">
      <div className="max-w-sm w-full border-r border-gray-200">
        {loading
          ? [0, 1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="mx-auto border border-green-300 p-4">
                <div className="flex animate-pulse space-x-4">
                  <div className="size-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-2 rounded bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : sortedUsers.map((user) => (
              <UserList
                key={user.id}
                user={user}
                onClick={handleSelectUser}
                unreadCount={unreadCounts[user.id] || 0}
              />
            ))}
      </div>

      <div className="w-full h-full">
        <ChatUi selectedUser={selectedUser} />
      </div>
    </section>
  );
};

export default MainComponent;
