import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  last_message?: string;
  last_message_time?: string;
}

interface Message {
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentUserId = searchParams.get("currentUserId");
  if (!currentUserId) {
    return NextResponse.json(
      { error: "Missing currentUserId" },
      { status: 400 }
    );
  }
  const supabase = await createClient();
  // Fetch users
  const { data: usersData, error: userError } = await supabase
    .from("users")
    .select("id, full_name, email, avatar_url")
    .neq("id", currentUserId);
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }
  // For each user, fetch the last message between currentUser and that user
  const userIds = (usersData as User[]).map((u) => u.id);
  const { data: messagesData } = await supabase
    .from("messages")
    .select("sender_id, receiver_id, message, created_at")
    .or(
      userIds
        .map(
          (id: string) =>
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${currentUserId})`
        )
        .join(",")
    )
    .order("created_at", { ascending: false });
  // Build a map of userId -> last message
  const lastMessageMap = new Map<
    string,
    { message: string; created_at: string }
  >();
  if (messagesData) {
    (messagesData as Message[]).forEach((msg) => {
      const otherUserId =
        msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      if (!lastMessageMap.has(otherUserId)) {
        lastMessageMap.set(otherUserId, {
          message: msg.message,
          created_at: msg.created_at,
        });
      }
    });
  }
  // Enrich users with last_message and last_message_time
  const enrichedUsers = (usersData as User[]).map((user) => ({
    ...user,
    last_message: lastMessageMap.get(user.id)?.message,
    last_message_time: lastMessageMap.get(user.id)?.created_at,
  }));
  // Sort by last_message_time descending
  enrichedUsers.sort(
    (a, b) =>
      new Date(b.last_message_time || "1970-01-01T00:00:00Z").getTime() -
      new Date(a.last_message_time || "1970-01-01T00:00:00Z").getTime()
  );
  return NextResponse.json({ users: enrichedUsers });
}
