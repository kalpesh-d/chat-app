"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FiClock,
  FiFile,
  FiMic,
  FiPaperclip,
  FiSmile,
  FiStar,
} from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { User } from "./MainComponent";
import { createClient } from "@/utils/supabase/client";
import { formatDateLabel } from "@/utils/helper";

interface MessageProps {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

interface ChatUiProps {
  selectedUser: User | null;
}

const ChatUi = ({ selectedUser }: ChatUiProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch current logged-in user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  // Fetch conversation messages
  const fetchMessages = useCallback(async () => {
    if (!currentUser || !selectedUser) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
  }, [currentUser, selectedUser, supabase]);

  // Fetch messages on user switch
  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages();
    }
  }, [selectedUser, currentUser, fetchMessages]);

  // Real-time listener for new messages
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

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
          const msg = payload.new as MessageProps;
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, selectedUser]);

  // Auto scroll to last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedUser) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        message: newMessage.trim(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage(""); // Clear input
    }
  };

  const renderMessages = () => {
    let lastDate: string | null = null;

    return messages.map((msg, index) => {
      const currentDate = formatDateLabel(msg.created_at);
      const showDate = currentDate !== lastDate;
      lastDate = currentDate;

      const isLast = index === messages.length - 1;

      return (
        <React.Fragment key={msg.id}>
          {showDate && (
            <div className="flex justify-center">
              <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium text-[0.6rem]">
                {currentDate}
              </div>
            </div>
          )}
          <div
            className={`mb-2 flex ${
              msg.sender_id === currentUser?.id
                ? "justify-end"
                : "justify-start"
            }`}
            ref={isLast ? messagesEndRef : null}
          >
            <div className="bg-green-100 text-green-700 p-2 rounded-tl-md rounded-br-md rounded-bl-md max-w-xs shadow">
              <div className="font-bold text-xs flex items-center gap-x-6">
                <p>
                  {msg.sender_id === currentUser?.id
                    ? currentUser?.user_metadata?.full_name
                    : selectedUser?.full_name}
                </p>
                <p className="text-[0.6rem] text-slate-400 font-medium">
                  +91 12345 67890
                </p>
              </div>
              <div className="text-black text-sm font-medium mt-1">
                {msg.message}
              </div>
              <div className="text-[0.6rem] text-right font-medium text-slate-400">
                {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white text-black">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={selectedUser.avatar_url}
              width={100}
              height={100}
              alt={`${selectedUser.full_name}-avatar`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold">{selectedUser.full_name}</p>
            <p className="text-xs font-medium text-gray-500">
              {selectedUser.email}
            </p>
          </div>
        </div>
        <LuSearch />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-chat-background bg-cover min-h-[537px] max-h-[537px]">
        <div className="flex flex-col space-y-4">{renderMessages()}</div>
      </div>

      {/* Input */}
      <div className="flex flex-col p-3 bg-white border-t border-gray-300">
        <form className="flex mb-3 gap-5">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleSendMessage}
            className="hover:bg-green-200 cursor-pointer px-3 py-2 rounded-md"
          >
            <IoSend className="text-green-700" size="1.2em" />
          </button>
        </form>

        {/* Icons */}
        <div className="flex justify-between">
          <div className="flex space-x-2">
            {[FiPaperclip, FiSmile, FiClock, FiStar, FiFile, FiMic].map(
              (Icon, idx) => (
                <button
                  key={idx}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Icon className="text-gray-600" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;
