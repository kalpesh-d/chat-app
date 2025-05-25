import Header from "@/components/Header";
import SidebarItems from "@/components/SidebarItems";
import MainComponent from "@/components/MainComponent";
import { getUsersWithLastMessage } from "@/utils/supabase/server";

export default async function Home() {
  const { userList } = await getUsersWithLastMessage();

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
