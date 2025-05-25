"use client";
import ChatUi from "./ChatUi";
import UserList from "./UserList";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserList, User } from "@/utils/supabase/hooks";
import RightPanel from "./RightPanel";
import { HiFolderArrowDown } from "react-icons/hi2";
import { CgSearch } from "react-icons/cg";
import { IoFilter, IoClose } from "react-icons/io5";
import { TbMessageCirclePlus } from "react-icons/tb";

const MainComponent = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
          avatar_url: String(user.user_metadata?.avatar_url),
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
    (payload: { new: { sender_id: string } }) => {
      const senderId = payload.new.sender_id;
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
        (payload: { new: { sender_id: string } }) => {
          updateUserListOnNewMessage(payload);
        }
      )
      .subscribe();

    return () => {
      createClient().removeChannel(channel);
    };
  }, [updateUserListOnNewMessage]);

  // Filter and search users
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) => {
        switch (filter) {
          case "unread":
            return unreadCounts[user.id] > 0;
          case "ai":
            return user.id === "groq-ai";
          default:
            return true;
        }
      });

    return matchesSearch && matchesFilters;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in real-time through the filteredUsers
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <section className="flex">
      <div className="max-w-sm w-full border-r border-gray-200 relative max-h-screen overflow-y-auto">
        <div className="flex gap-2 items-center h-12 bg-gray-100 px-4 justify-between border-b border-gray-200">
          <div className="flex items-center text-green-700 gap-1">
            <HiFolderArrowDown size="1em" />
            <span className="text-xs font-bold tracking-tight">
              Custom Filter
            </span>
            <button
              className="ml-1 text-xs text-gray-800 font-semibold px-2 py-1 border border-gray-300 bg-white rounded-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            >
              Save
            </button>
          </div>
          <div className="flex items-center">
            <button
              className="flex items-center gap-1 ml-1 text-xs text-gray-800 font-semibold px-2 py-[6px] border border-gray-300 bg-white rounded-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => setShowSearch(!showSearch)}
            >
              <CgSearch size="1.3em" />
              Search
            </button>
            <button
              className="relative flex items-center gap-1 ml-1 text-xs text-green-600 font-semibold px-2 py-[6px] border border-gray-300 bg-white rounded-sm hover:bg-green-50 cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            >
              <IoFilter size="1.3em" />
              Filtered
              {activeFilters.length > 0 && (
                <IoClose
                  size="1.3em"
                  className="absolute bg-green-600 text-white rounded-full top-[-6px] right-[-7px]"
                />
              )}
            </button>
          </div>
        </div>

        {/* Search Input */}
        {showSearch && (
          <div className="p-2 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <IoClose size={20} />
              </button>
            </form>
          </div>
        )}

        {/* Filter Options */}
        {showFilter && (
          <div className="p-2 border-b border-gray-200">
            <div className="space-y-2">
              <button
                onClick={() => toggleFilter("unread")}
                className={`w-full text-left px-1 py-1 rounded-md text-sm ${
                  activeFilters.includes("unread")
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Unread Messages
              </button>
              <button
                onClick={() => toggleFilter("ai")}
                className={`w-full text-left px-1 py-1 rounded-md text-sm ${
                  activeFilters.includes("ai")
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                AI Chats
              </button>
            </div>
          </div>
        )}

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
          : filteredUsers.map((user) => (
              <UserList
                key={user.id}
                user={user}
                onClick={handleSelectUser}
                unreadCount={unreadCounts[user.id] || 0}
              />
            ))}

        <div className="absolute bg-green-700 text-white rounded-full p-3 z-10 bottom-3 right-3 shadow-2xl">
          <TbMessageCirclePlus size="1.4em" />
        </div>
      </div>

      <div className="w-full h-full">
        <ChatUi selectedUser={selectedUser} />
      </div>
      <RightPanel />
    </section>
  );
};

export default MainComponent;
