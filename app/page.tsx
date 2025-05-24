import React from "react";
import Header from "@/components/Header";
import SidebarItems from "@/components/SidebarItems";
import MainComponent from "@/components/MainComponent";
import { createClient, getCurrentUser } from "@/utils/supabase/server";

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
      return { success: false, error: (error as Error).message };
    }
  };

  const { userList } = await getUsers();

  if (!userList) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load user list.</p>
      </div>
    );
  }

  return (
    <section className="flex">
      <SidebarItems />
      <div className="w-full">
        <Header />
        <MainComponent userList={userList} />
      </div>
    </section>
  );
}
