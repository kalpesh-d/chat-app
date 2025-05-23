import { createClient } from "@/utils/supabase/server";
import SidebarItems from "./components/SidebarItems";
import Header from "./components/Header";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <section className="flex">
      <SidebarItems />

      <div className="w-full">
        <Header />
        <div className="p-4">
          <h1 className="text-3xl font-bold text-center">
            Hello {data?.user?.user_metadata?.full_name || "World"}!
          </h1>
        </div>
      </div>
    </section>
  );
}
