import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  last_message_time?: string;
  last_message?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

export function useMessages(
  currentUser: User | null,
  selectedUser: User | null
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const subscriptionRef = useRef<any>(null);

  const fetchMessages = useCallback(async () => {
    if (!currentUser || !selectedUser) return;
    setLoading(true);
    setError(null);

    if (selectedUser.id === "groq-ai") {
      // For AI user, we don't need to fetch from database
      setMessages([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", { ascending: true });
    if (error) {
      setError(error.message);
      setMessages([]);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, [currentUser, selectedUser, supabase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    if (selectedUser.id === "groq-ai") {
      // Don't set up realtime subscription for AI user
      return;
    }

    const channel = supabase
      .channel(`chat-${currentUser.id}-${selectedUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          const isRelevant =
            (msg.sender_id === currentUser.id &&
              msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id &&
              msg.receiver_id === currentUser.id);
          if (isRelevant) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();
    subscriptionRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser, supabase]);

  const sendMessage = async (message: string) => {
    if (!currentUser || !selectedUser || !message.trim()) return;

    if (selectedUser.id === "groq-ai") {
      // Handle AI message
      const userMessage: Message = {
        id: Date.now().toString(),
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        message: message.trim(),
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch("/api/groq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((msg) => ({
                role: msg.sender_id === currentUser.id ? "user" : "assistant",
                content: msg.message,
              })),
              { role: "user", content: message.trim() },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI response");
        }

        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender_id: selectedUser.id,
          receiver_id: currentUser.id,
          message: data.choices[0].message.content,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (err: any) {
        setError(err.message);
      }
      return;
    }

    // Handle regular user message
    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        message: message.trim(),
      },
    ]);
    if (error) setError(error.message);
  };

  return { messages, loading, error, sendMessage, fetchMessages };
}

export function useUserList(currentUser: User | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/userlist?currentUserId=${currentUser.id}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setUsers([]);
      } else {
        // Add Groq AI user to the list
        const aiUser: User = {
          id: "groq-ai",
          full_name: "Groq AI Assistant",
          email: "ai@groq.com",
          avatar_url: "/aiprofile.jpeg",
          last_message:
            "I am your AI assistant powered by Groq. How can I help you today?",
          last_message_time: new Date().toISOString(),
        };
        setUsers([aiUser, ...(data.users || [])]);
      }
    } catch (err: any) {
      setError(err.message);
      setUsers([]);
    }
    setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!currentUser) return;
    const channel = supabase
      .channel("realtime-users")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new;
          const otherUserId =
            msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) =>
              user.id === otherUserId
                ? {
                    ...user,
                    last_message_time: msg.created_at,
                    last_message: msg.message,
                  }
                : user
            );
            // Sort by last_message_time descending (default to epoch if missing)
            return [...updatedUsers].sort(
              (a, b) =>
                new Date(
                  b.last_message_time || "1970-01-01T00:00:00Z"
                ).getTime() -
                new Date(
                  a.last_message_time || "1970-01-01T00:00:00Z"
                ).getTime()
            );
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, supabase]);

  return { users, loading, error, fetchUsers };
}
