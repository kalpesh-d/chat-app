import { createClient } from "@/utils/supabase/server";
import SidebarItems from "./components/SidebarItems";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <main className="flex">
      <SidebarItems />

      <div className="p-4">
        <h1 className="text-3xl font-bold text-center">
          Hello {data?.user?.user_metadata?.full_name || "World"}!
        </h1>
      </div>
    </main>
  );
}
