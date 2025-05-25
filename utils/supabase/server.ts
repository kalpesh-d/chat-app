import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { User } from "@/components/MainComponent";

export async function createClient() {
  const cookieStore = await cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data) {
    return null;
  }

  return data.user;
}

export const getUsersWithLastMessage = async (): Promise<{
  success: boolean;
  userList?: User[];
  error?: string;
}> => {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  try {
    // Get users who have chatted with current user
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email, avatar_url")
      .neq("id", currentUser?.id);

    if (userError) throw userError;

    // Get all messages where currentUser is sender or receiver
    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("sender_id, receiver_id, created_at")
      .or(`sender_id.eq.${currentUser?.id},receiver_id.eq.${currentUser?.id}`);

    if (msgError) throw msgError;

    // Build map of userId => last_message_time
    const lastMessageMap = new Map<string, string>();

    messages.forEach((msg) => {
      const otherUserId =
        msg.sender_id === currentUser?.id ? msg.receiver_id : msg.sender_id;

      const existing = lastMessageMap.get(otherUserId);
      if (!existing || new Date(msg.created_at) > new Date(existing)) {
        lastMessageMap.set(otherUserId, msg.created_at);
      }
    });

    const enrichedUsers: User[] = users.map((user) => ({
      ...user,
      last_message_time: lastMessageMap.get(user.id) || "1970-01-01T00:00:00Z",
    }));

    const sortedUsers = enrichedUsers.sort(
      (a, b) =>
        new Date(b?.last_message_time!).getTime() -
        new Date(a?.last_message_time!).getTime()
    );

    return { success: true, userList: sortedUsers };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
