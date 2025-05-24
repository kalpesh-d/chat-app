import ChatUi from "@/components/ChatUi";
import Header from "@/components/Header";
import UserList from "@/components/UserList";
import SidebarItems from "@/components/SidebarItems";
import { createClient, getCurrentUser } from "@/utils/supabase/server";
import React from "react";

export default async function Home() {
  const supabase = await createClient();

  const getUsers = async () => {
    try {
      const user = await getCurrentUser();

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("id", user?.id);

      if (error) throw error;
      return { success: true, userList: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const { userList } = await getUsers();

  return (
    <section className="flex">
      <SidebarItems />

      <div className="w-full">
        <Header />
        <section className="flex">
          <div className="max-w-sm w-full border-r border-gray-200">
            {userList?.map((user) => (
              <UserList user={user} key={user.id} />
            ))}
          </div>

          <div className="w-full">
            <ChatUi />
          </div>
          <div className="border-l">
            <SidebarItems />
          </div>
        </section>
      </div>

      <div className="border-l"></div>
    </section>
  );
}
