"use client";
import ChatUi from "./ChatUi";
import SidebarItems from "./SidebarItems";
import UserList from "./UserList";
import { useState } from "react";

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
}

interface UserListProps {
  userList: User[];
}

const MainComponent = ({ userList }: UserListProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSelectUser = (user: User) => setSelectedUser(user);

  return (
    <section className="flex">
      <div className="max-w-sm w-full border-r border-gray-200">
        {userList?.map((user) => (
          <UserList user={user} key={user.id} onClick={handleSelectUser} />
        ))}
      </div>

      <div className="w-full">
        <ChatUi selectedUser={selectedUser} />
      </div>
      <div className="border-l">
        <SidebarItems />
      </div>
    </section>
  );
};

export default MainComponent;
