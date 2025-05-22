import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  console.log(data);

  return (
    <main>
      <div className="container mx-auto">
        <div className="min-h-screen">
          <h1 className="text-3xl font-bold text-center">
            Hello {data?.user?.user_metadata?.full_name || "World"}!
          </h1>
        </div>
      </div>
    </main>
  );
}
