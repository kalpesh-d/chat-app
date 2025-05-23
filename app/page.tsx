import { createClient } from "@/utils/supabase/server";
import SidebarItems from "./components/SidebarItems";
import Header from "./components/Header";
import ChatUI from "./components/ChatUi";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <section className="flex">
      <SidebarItems />

      <div className="w-full">
        <Header />
        <section className="flex">
          <ChatUI />
          <ChatUI />
          <div className="border-l">
            <SidebarItems />
          </div>
        </section>
      </div>

      <div className="border-l"></div>
    </section>
  );
}
